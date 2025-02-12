const { default: mongoose } = require("mongoose");

const schemaUser = new mongoose.Schema({
    login: String,
    email: String,
    password: String,
    twoFASecret: String, // Stores the 2FA secret key
    is2FAEnabled: { type: Boolean, default: false }, // 2FA flag
})


module.exports = mongoose.model("user", schemaUser)