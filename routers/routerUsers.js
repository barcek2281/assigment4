const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {getDatabase} = require("../db/mongo.js");

const router = express.Router();


let usersCollection = () => {
    return getDatabase().collection("users");
};

router.get("/", async (req, res) => {
    let user = await usersCollection().find()
    
    res.render("index");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/registration", async (req, res) => {
    res.render("registration")
});

module.exports = router;