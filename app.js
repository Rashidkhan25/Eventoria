const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const User = require("./models/User");

// FIREBASE ADMIN 
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  }),
});

const {
  upcomingEvents,
  nearbyEvents,
  featuredEvents,
} = require("./data/eventsData");

const app = express();
const PORT = process.env.PORT || 3000;

// MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// SESSIONS 
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

// MIDDLEWARES 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// STATIC ROUTES 
app.get("/", (req, res) => res.render("loading"));
app.get("/home", (req, res) => res.render("index", { session: req.session }));
app.get("/contact", (req, res) => res.render("contact-us", { session: req.session }));
app.get("/events", (req, res) =>
  res.render("events", { upcomingEvents, nearbyEvents, featuredEvents, session: req.session })
);
app.get("/usersignup", (req, res) => res.render("signupPage"));
app.get("/userlogin", (req, res) => res.render("loginPage"));

app.post("/sessionLogin", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.json({ success: false, message: "Missing ID Token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await new User({
        username: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        photo: decoded.picture || "/images/default-profile.jpg",
      }).save();
    }

    req.session.loggedIn = true;
    req.session.username = user.username;
    req.session.userEmail = user.email;

    res.json({ success: true });

  } catch (err) {
    console.error("Firebase Token Error:", err);
    res.json({ success: false, message: "Invalid Token" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
