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
    cookie: { maxAge: 600000 } 
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
app.get("/usersignup", (req, res) => res.render("signupPage", { session: req.session }));
app.get("/userlogin", (req, res) => res.render("loginPage", { session: req.session }));
app.get("/hostlogin", (req, res) => res.render("hostloginPage", { session: req.session }));
app.get("/hostsignup", (req, res) => res.render("hostsignupPage", { session: req.session }));


app.post("/signup", async (req, res) => {
  const { userusername, useremail } = req.body;

  try {
    let user = await User.findOne({ email: useremail });

    if (user) {
      return res.json({ success: false, message: "Account already exists. Please login." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    req.session.tempSignup = {
      username: userusername,
      email: useremail,
      otp: otp,
      otpExpiry: Date.now() + 300000 
    };

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: useremail,
      subject: "Your Eventoria Signup OTP",
      text: `Hi ${userusername},\n\nYour OTP for signup is: ${otp}\n\nIt will expire in 5 minutes.\n\nThank you,\nEventoria Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error processing signup." });
  }
});

app.post("/verify-signup-otp", async (req, res) => {
  const { userotp } = req.body;

  try {
    if (!req.session.tempSignup) {
      return res.json({ success: false, message: "Session expired. Please try again." });
    }

    const { username, email, otp, otpExpiry } = req.session.tempSignup;

    // Check if OTP is expired
    if (Date.now() > otpExpiry) {
      delete req.session.tempSignup;
      return res.json({ success: false, message: "OTP expired. Please try again." });
    }

    if (userotp === otp) {
      const newUser = new User({
        username: username,
        email: email,
        photo: "/images/default-profile.jpg",
      });
      await newUser.save();

      req.session.loggedIn = true;
      req.session.userEmail = email;
      req.session.username = username;
      delete req.session.tempSignup;

      return res.json({ success: true, message: "Account created successfully!" });
    } else {
      return res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error verifying OTP." });
  }
});

// LOGIN ROUTE - Check if user exists and send OTP
app.post("/login", async (req, res) => {
  const { userusername, useremail } = req.body;

  try {
    const user = await User.findOne({ email: useremail });

    if (!user) {
      return res.json({ success: false, message: "Account not found. Please sign up first." });
    }

    if (user.username !== userusername) {
      return res.json({ success: false, message: "Username does not match with this email." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in session
    req.session.loginOtp = {
      otp: otp,
      email: useremail,
      username: userusername,
      otpExpiry: Date.now() + 300000 // 5 minutes
    };

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: useremail,
      subject: "Your Eventoria Login OTP",
      text: `Hi ${userusername},\n\nYour OTP for login is: ${otp}\n\nIt will expire in 5 minutes.\n\nThank you,\nEventoria Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error processing login." });
  }
});

app.post("/verify-login-otp", (req, res) => {
  const { userotp } = req.body;

  if (!req.session.loginOtp) {
    return res.json({ success: false, message: "Session expired. Please try again." });
  }

  const { otp, email, username, otpExpiry } = req.session.loginOtp;

  if (Date.now() > otpExpiry) {
    delete req.session.loginOtp;
    return res.json({ success: false, message: "OTP expired. Please try again." });
  }

  if (userotp === otp) {
    req.session.loggedIn = true;
    req.session.userEmail = email;
    req.session.username = username;
    delete req.session.loginOtp;
    return res.json({ success: true, message: "Login successful!" });
  }

  res.json({ success: false, message: "Invalid OTP" });
});

// RESEND OTP FOR SIGNUP AND LOGIN 
app.post("/resend-signup-otp", async (req, res) => {
  try {
    if (!req.session.tempSignup) {
      return res.json({ success: false, message: "Session expired. Please start signup again." });
    }

    const { username, email } = req.session.tempSignup;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    req.session.tempSignup.otp = otp;
    req.session.tempSignup.otpExpiry = Date.now() + 300000;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Eventoria Signup OTP (Resent)",
      text: `Hi ${username},\n\nYour new OTP for signup is: ${otp}\n\nIt will expire in 5 minutes.\n\nThank you,\nEventoria Team`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP resent successfully." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error resending OTP." });
  }
});

app.post("/resend-login-otp", async (req, res) => {
  try {
    if (!req.session.loginOtp) {
      return res.json({ success: false, message: "Session expired. Please start login again." });
    }

    const { username, email } = req.session.loginOtp;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    req.session.loginOtp.otp = otp;
    req.session.loginOtp.otpExpiry = Date.now() + 300000;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Eventoria Login OTP (Resent)",
      text: `Hi ${username},\n\nYour new OTP for login is: ${otp}\n\nIt will expire in 5 minutes.\n\nThank you,\nEventoria Team`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP resent successfully." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error resending OTP." });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});