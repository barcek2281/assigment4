const express = require("express");
const bcrypt = require('bcrypt');
const {getDatabase} = require("../db/mongo.js");
const { body, validationResult } = require("express-validator");
const {ObjectId} = require('mongodb'); 
const speakeasy = require("speakeasy");

const router = express.Router();
const saltRounds = Number(process.env.SALT);

let usersCollection = () => {
    return getDatabase().collection("users");
};

router.get("/", async (req, res) => {
    user = await usersCollection().findOne({_id: new ObjectId(req.session.user)})
    if (user) {
        res.render("index", {user: user});
    }else{
        res.render("index", {user: null})
    }
});

router.get("/login", async (req, res) => {
    res.render("login", {error: null});
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    let user = await usersCollection().findOne({email: email});
    if (!user) {
        return res.render("login", {error: "incorrect email or password"})
    }

    result = await bcrypt.compare(password, user.password);
    if (result) {
        req.session.user = user._id
        if (user.is2FAEnabled) {
            res.redirect("/login-2fa")
            return
        }
        res.redirect("/")
    } else {
        res.render("login", {error: "incorrect email or password"})
    }
});

router.get("/login-2fa", async (req, res) => {
    res.render("verify_2fa", {error:null, login: true})
});

router.post("/login-2fa", async (req, res) => {
    const code = req.body.code;
    if (!req.session.user) {
            return
    } 
    const user = await usersCollection().findOne({_id: new ObjectId(req.session.user)})
    if (!user) {
        return
    }

    const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token: code,
    });

    if (!verified) {
        return res.render("verify_2fa", {error: "invalid code", login: true});
    }

    res.redirect("/")
}); 

router.get("/registration", async (req, res) => {
    res.render("registration", {error: null})
});

router.post("/registration",  
    [body("login").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),],
    async (req, res) => {
    const { login, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("registration", { error: errors.array()[0].msg });
    }

    let existingUser = await usersCollection().findOne({ email });
    if (existingUser) {
        return res.render("registration", { error: "Email is already registered" });
    }

    let user = await usersCollection().insertOne({
        login: login,
        email: email,
        password: await bcrypt.hash(password, 10),
        twoFASecret: "", 
        is2FAEnabled: false,
    });

    req.session.user = user.insertedId;
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return
        }
        res.clearCookie("connect.sid", { path: "/", httpOnly: true, secure: false, sameSite: "lax" });
        res.redirect("/"); 
    });
});

module.exports = router;