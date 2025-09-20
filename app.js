const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer");  
require("dotenv").config();
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
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Page routes
app.get("/", (req, res) => res.render("loading", { session: req.session }));
app.get("/home", (req, res) => res.render("index", { session: req.session }));
app.get("/contact", (req, res) => res.render("contact-us", { session: req.session }));
app.get("/events", (req, res) =>
  res.render("events", { upcomingEvents, nearbyEvents, featuredEvents, session: req.session })
);
app.get("/userlogin", (req, res) => res.render("loginPage", { session: req.session }));
app.get("/hostlogin", (req, res) => res.render("hostloginPage", { session: req.session }));

// Login route (send OTP via email)
app.post("/login", async (req, res) => {
  const { userusername, useremail } = req.body;

  try {
    let user = await User.findOne({
      username: userusername,
      email: useremail,
    });

    if (!user) {
      user = new User({
        username: userusername,
        email: useremail,
        photo: "/images/default-profile.jpg",
      });
      await user.save();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    req.session.otp = otp;
    req.session.userEmail = user.email;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your EventSync Login OTP",
      text: `Hi ${user.username},\n\nYour OTP is: ${otp}\n\nIt will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Database error." });
  }
});

app.post("/verify-otp", (req, res) => {
  const { userotp } = req.body;

  if (req.session.otp && userotp === req.session.otp) {
    req.session.loggedIn = true;
    delete req.session.otp; 
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Invalid or expired OTP" });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
