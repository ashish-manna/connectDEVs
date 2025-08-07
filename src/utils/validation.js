const validator = require("validator");

const singhUpDataValidation = (req) => {
  const { email, password, firstName, lastName } = req.body;
  if (!firstName || !password || !email || !lastName) {
    throw new Error("Please fill required inputs.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password for better safety.");
  }
};
const loginDataValidation = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
};
module.exports = { singhUpDataValidation, loginDataValidation };
