const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const datajson = require("./data/db.json");

const app = express();
const port = 3000;

// connect to json
const data = datajson;
// console.log(data);

// middleware
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.use(authRoutes);

app.listen(port, () => {
  console.log(`connect to http://localhost:${port}`);
});
