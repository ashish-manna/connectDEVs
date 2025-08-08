const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token must required");
    }
    const { _id } = jwt.verify(token, "Vampire");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    const { token } = req.cookies;
    res.status(401).json({ message: `Unauthorized user`, token: token });
  }
};

module.exports = userAuth;
