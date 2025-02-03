const express = require('express');
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const {connectToDatabase} = require("./db/mongo.js");
const routerUser = require("./routers/routerUsers");
const routerFeature = require("./routers/routerFeature");

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

// for css style and javascript scripts
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// for ejs files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for sessions
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure: true, если используешь HTTPS
}));


app.use("/", routerUser)
app.use("/", routerFeature);

try {
    connectToDatabase();
    app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
} catch (err) {
    console.error("Failed to start server:", err);
}
