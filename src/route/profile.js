const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  editDataValidation,
  updatePasswordValidation,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(404).json({ message: `Bad request` });
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = editDataValidation(req);
    if (!isAllowed) {
      throw new Error("Updation is not possible");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).json({
      message: `Hi,${loggedInUser.firstName} your profile is updated`,
      updatedData: req.body,
    });
  } catch (err) {
    res.status(401).json({ message: `ERROR:${err.message}` });
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const isAllowed = updatePasswordValidation(req);
    if (!isAllowed) {
      throw new Error("Updation can't be possible");
    }
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Password mismatch , not able to update passwrod");
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashPassword;
    await user.save();
    res.status(200).json({
      message: `Hi,${user.firstName} your password is change sucessfully`,
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  } catch (err) {
    res.status(401).json({ message: `${err.message}` });
  }
});

module.exports = profileRouter;
