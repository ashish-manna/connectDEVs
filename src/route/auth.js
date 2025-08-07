const express = require("express");
const { singhUpDataValidation } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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

module.exports = authRouter;
