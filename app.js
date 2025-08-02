const express = require ("express");
const app = express();
const path = require("path")
const PORT = 3000;
const {
  upcomingEvents,
  pastEvents,
  featuredEvents,
} = require("./data/eventsData");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res,next) => {
  res.render("loading");
})

app.get("/home", (req,res,next) => {
  res.render("index");
})

app.get("/contact", (req, res,next) => {
  res.render("contact-us");
});

app.get("/events", (req, res) => {
  res.render("events", { upcomingEvents, pastEvents, featuredEvents });
});

app.get("/userlogin", (req, res, next) => {
  res.render("loginPage");
});
app.get("/hostlogin", (req, res, next) => {
  res.render("hostloginPage");
});

app.listen(PORT , () => {
  console.log(`Server running on http://localhost:${PORT}`);
})