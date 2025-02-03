const express = require("express");
const bcrypt = require('bcrypt');
const {getDatabase} = require("../db/mongo.js");
const crypto = require("crypto");
const path = require("path")
const {ObjectId} = require('mongodb'); 
const multer = require('multer');
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 3000;
const router = express.Router();
const saltRounds = Number(process.env.SALT);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, req.session.user + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

let usersCollection = () => {
    return getDatabase().collection("users");
};



router.get("/forget-password", async (req, res) => {
    res.render("password-reset", {error: null})
});

router.post("/forget-password", async (req, res) => {
    const { email } = req.body;
    const user = await usersCollection().findOne({ email });
    if (!user){
         return res.render("password-reset", {error: "cannot find email"});
    }

    const token = crypto.randomBytes(32).toString("hex");
    await usersCollection().updateOne({ email }, { $set: { resetToken: token, tokenExpiration: Date.now() + 3600000 } });
    const resetLink = `http://localhost:${PORT}/forget-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });
    res.render("password-reset", {error: "link to reset your email sent"});
});

router.get("/forget-password/:token", async (req, res) => {
    const {token} = req.params;
    res.render("new-password", {token: token, msg: null})
});

router.post("/forget-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await usersCollection().findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } });
    if (!user) return res.render("new-password", {token: token, msg: "error with token: expired"});
    if (String(password).length < 6) {
        return  res.render("new-password", {token: token, msg: "password length less than 6"});
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await usersCollection().updateOne({ resetToken: token }, { $set: { password: hashedPassword, resetToken: null, tokenExpiration: null } });

    res.render("new-password", {token: token, msg: "password changed"});
});

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    if (!req.file){
         return res.status(400).send("No file uploaded");
    }
    await usersCollection().updateOne({ _id: new ObjectId(req.session.user) }, { $set: { avatar: `/uploads/${req.file.filename}` } });
    res.redirect("/");
});

module.exports = router