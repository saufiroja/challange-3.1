const data = require("../data/db.json");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { json } = require("express");

// const maxAge = 3 * 24 * 60 * 60;
// const createToken = (id) => {
//   return jwt.sign({ id }, "secret", {
//     expiresIn: maxAge,
//   });
// };

// sign up get
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

// log in get
module.exports.login_get = (req, res) => {
  res.render("login");
};

// sign up post
module.exports.signup_post = (req, res) => {
  const { username, password } = req.body;

  try {
    const saveData = (data) => {
      fs.writeFileSync("data/db.json", JSON.stringify(data));
    };

    let foundUser = data.find((json) => {
      return json.username === username;
    });

    if (!foundUser) {
      let newUser = {
        id: Date.now(),
        username,
        password,
      };
      data.push(newUser);
      saveData(data);
      // console.log(data);
    }
  } catch (error) {
    console.log(error);
  }

  // res.redirect("/");
  return res.status(200).json({
    message: "success",
  });
};

// log in post
module.exports.login_post = (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = data.find((data) => {
      return data.username === username;
    });

    if (!exists) {
      res.json({
        message: "user not found",
      });
    }

    if (exists.password !== password) {
      res.json({
        message: "password salah",
      });
    }

    res.redirect("/");
    // return res.status(200).json({
    //   message: "success",
    // });
  } catch (error) {
    console.log(error);
  }
};
