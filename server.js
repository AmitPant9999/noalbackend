const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

require("./auth"); // Import the auth configuration
const app = require("./app");

const port = process.env.port || 3000; // Use a different port than your React app

const DB = process.env.DATABASE_URL;
console.log(DB);
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false, // Don't save empty sessions
    store: MongoStore.create({
      mongoUrl: DB,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true, // Prevents XSS attacks
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connection successful!"))
  .catch((error) => console.error("DB connection error:", error));

// API routes
app.get("/api", (req, res) => {
  res.send("API is working");
});

// Google authentication routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Authenticated user:", req.user); // Debugging line
    const name = req.user.username;
    const email = req?.user?.email;
    const photo = req?.user?.image;
    res.redirect(
      `http://localhost:5173?name=${name}&email=${email}&photo=${photo}`
    ); // Redirect to the React app's home page
  },
  (error, req, res, next) => {
    console.error("Authentication error:", error);
    res.status(500).send("Authentication failed");
  }
);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
