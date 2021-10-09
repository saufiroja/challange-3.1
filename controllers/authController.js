const database = require("../data/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// error handling
const handleErrors = (err) => {
  console.log(err.msg, err.code);
  let errors = { username: "", password: "" };

  // incorrect username
  if (err.message === "Incorrect username") {
    errors.username = "That username is not registered";
    return errors;
  }

  // incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "That password is incorrect";
    return errors;
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.username = "That username is already registered";
    return errors;
  }
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

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
    const newUser = {
      id: uuidv4(),
      username,
      password,
    };

    database.push(newUser);
    fs.writeFileSync("./data/db.json", JSON.stringify(database));

    const token = createToken(newUser.id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ newUser: newUser.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// log in post
module.exports.login_post = (req, res) => {
  const { username, password } = req.body;

  try {
    const login = (username, password) => {
      const findUser = database.find((user) => user.username === username);
      if (findUser) {
        const auth = database.find((user) => user.password === password);
        if (auth) {
          return findUser;
        }
        throw Error("Incorrect password");
      }
      throw Error("Incorrect username");
    };

    const userLogin = login(username, password);
    const token = createToken(userLogin.id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ userLogin: userLogin.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// log out get

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
