const express = require ("express");
const app = express();
const path = require("path")
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res,next) => {
  res.render("index");
})

app.listen(PORT , () => {
  console.log(`Server running on http://localhost:${PORT}`);
})