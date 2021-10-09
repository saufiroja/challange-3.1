const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const database = require("./data/db.json");

const app = express();
const port = 3000;

// middleware
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/game", (req, res) => {
  res.render("game");
});

app.get("/json", (req, res) => {
  res.render("json", {
    database,
  });
});

app.use(authRoutes);

app.listen(port, () => {
  console.log(`connect to http://localhost:${port}`);
});
