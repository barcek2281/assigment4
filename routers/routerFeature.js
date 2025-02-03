const express = require("express");
const bcrypt = require('bcrypt');
const {getDatabase} = require("../db/mongo.js");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const {ObjectId} = require('mongodb'); 
const nodemailer = require("nodemailer");

const router = express.Router();
const saltRounds = process.env.SALT;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

let usersCollection = () => {
    return getDatabase().collection("users");
};

router.get("/forget-password", async (req, res) => {
    res.render("password-reset", {error: null})
})

router.post("/forget-password", async (req, res) => {
    const { email } = req.body;
    const user = await usersCollection().findOne({ email });
    if (!user){
         return res.render("password-reset", {error: "cannot find email"});
    }

    const token = crypto.randomBytes(32).toString("hex");
    await usersCollection().updateOne({ email }, { $set: { resetToken: token, tokenExpiration: Date.now() + 3600000 } });
    const resetLink = `http://localhost:3000/forget-password/${token}`;
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
    if (!user) return res.status(400).send("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection().updateOne({ resetToken: token }, { $set: { password: hashedPassword, resetToken: null, tokenExpiration: null } });

    res.render("new-password", {token: token, msg: "password changed"});
});

module.exports = router