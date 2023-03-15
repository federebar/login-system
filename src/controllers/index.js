const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const homeController = (req, res) => {
  res.render("home");
};

const signInPageController = (req, res) => {
  res.render("signin");
};

const signInPageHandler = (req, res) => {
  res.redirect("/");
};

const signUpPageController = (req, res) => {
  res.render("signup");
};

const signUpHandler = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  // find user with email
  const user = await User.findOne({
    where: {
      email
    }
  });
  if(user) {
    return res.status(400).send("A user with this email already exists");
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  res.redirect("/sign-in");
};

const signOutController = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/sign-in");
  });
};

module.exports = {
  signInPageController,
  signUpPageController,
  signUpHandler,
  signInPageHandler,
  homeController,
  signOutController,
};
