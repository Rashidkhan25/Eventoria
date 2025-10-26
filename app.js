const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();
const User = require("./models/User");

const app = express();
const PORT = 3000;
const {
  upcomingEvents,
  nearbyEvents,
  featuredEvents,
} = require("./data/eventsData");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.render("loading", { session: req.session }));
app.get("/home", (req, res) => res.render("index", { session: req.session }));
app.get("/contact", (req, res) => res.render("contact-us", { session: req.session }));
app.get("/events", (req, res) =>
  res.render("events", { upcomingEvents, nearbyEvents, featuredEvents, session: req.session })
);
app.get("/userlogin", (req, res) => res.render("loginPage", { session: req.session }));
app.get("/hostlogin", (req, res) => res.render("hostloginPage", { session: req.session }));

// Login route
app.post("/login", async (req, res) => {
  const { userusername, useremail, userphonenumber } = req.body;

  try {
    let user = await User.findOne({
      username: userusername,
      email: useremail,
      phonenumber: userphonenumber
    });

    if (!user) {
      user = new User({
        username: userusername,
        email: useremail,
        phonenumber: userphonenumber,
        photo: '/images/default-profile.jpg' 
      });
      await user.save();
    }

    req.session.loggedIn = true;
    req.session.userPhoto = user.photo;
    req.session.userName = user.username;

    return res.json({ success: true, message: "New user created and OTP section shown." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Database error." });
  }
});

// OTP verification route (still dummy for now)
app.post("/verify-otp", (req, res) => {
  const { userotp } = req.body;

  if (userotp === "123456") {
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Invalid OTP" });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
