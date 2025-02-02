const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const {getDatabase} = require("../db/mongo.js");
const { body, validationResult } = require("express-validator");
const {ObjectId} = require('mongodb'); 

const router = express.Router();
const saltRounds = process.env.SALT;


let usersCollection = () => {
    return getDatabase().collection("users");
};

router.get("/", async (req, res) => {
    // console.log(req.session.user)
    user = await usersCollection().findOne({_id: new ObjectId(req.session.user)})
    

    if (user) {
        res.render("index", {user: user});
    }else{
        res.render("index", {user: null})
    }
});


router.get("/login", async (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
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

    hashedPassword = bcrypt.hash(password, 10)

    let user = await usersCollection().insertOne({
        login: login,
        email: email,
        password: hashedPassword
    });

    req.session.user = user.insertedId;
    // console.log( req.session.user )
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
