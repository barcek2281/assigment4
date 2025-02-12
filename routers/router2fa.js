const express = require("express");
const {getDatabase} = require("../db/mongo.js");
const {ObjectId} = require('mongodb'); 
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

router2FA = express.Router();

let usersCollection = () => {
    return getDatabase().collection("users");
};

router2FA.get("/turn-on-2FA", async (req, res) => {
    if (!req.session.user) {
        return
    } 
    user = await usersCollection().findOne({_id: new ObjectId(req.session.user)})
    const secret = speakeasy.generateSecret({ name: `MyApp (${user.email})` });
    
    user.twoFASecret = secret.base32;
    user.is2FAEnabled = true;

    await usersCollection().updateOne({ email: user.email }, { $set: { twoFASecret: secret.base32, is2FAEnabled: true, isActive: true}});

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ message: "Error generating QR Code" });
        res.render("2fa", { qrCode: data_url, secret: secret.base32 });
      });
});

router2FA.get("/turn-off-2FA", async (req, res) => {
    res.render("verify_2fa", {error: null, login: false})
});

router2FA.post("/turn-off-2FA", async (req, res) => {
    const code = req.body.code;
    
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
        return res.render("verify_2fa", {error: "invalid code", login: false});
    }

    await usersCollection().updateOne({ email: user.email }, { $set: { twoFASecret: "", is2FAEnabled: false, isActive: true}});

    res.redirect("/")
});



module.exports = router2FA