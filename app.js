const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const { upcomingEvents, nearbyEvents, featuredEvents } = require("./data/eventsData");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

  console.log("MONGO_URI:", process.env.MONGO_URI);


// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Page routes
app.get("/", (req, res) => res.render("loading", { session: req.session }));
app.get("/home", (req, res) => res.render("index", { session: req.session }));
app.get("/contact", (req, res) => res.render("contact-us", { session: req.session }));
app.get("/events", (req, res) =>
  res.render("events", { upcomingEvents, nearbyEvents, featuredEvents, session: req.session })
);

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
