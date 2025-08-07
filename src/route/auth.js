const express = require("express");
const {
  singhUpDataValidation,
  loginDataValidation,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    singhUpDataValidation(req);
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: `User created successfully with name ${firstName}` });
  } catch (err) {
    res.status(500).json({ message: `Invalid Input` });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    loginDataValidation(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not Found...");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Wrong Passwrod...");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token);
    res
      .status(200)
      .json({ message: `Logged in sucessfully as ${user.firstName}` });
  } catch (err) {
    res.status(500).json({ message: `Invalid credential` });
  }
});

module.exports = authRouter;
