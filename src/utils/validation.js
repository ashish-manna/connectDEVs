const validator = require("validator");

const singhUpDataValidation = (req) => {
  const { email, password, firstName, age } = req.body;
  if (!firstName || !password || !email || !age) {
    throw new Error("Please fill required inputs.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};
const loginDataValidation = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
};
const editDataValidation = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error("Noting to update");
  }
  const allowedFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "age",
    "photoUrl",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  return isAllowed;
};
const updatePasswordValidation = (req) => {
  const { newPassword } = req.body;
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter a strong password for better seafty.");
  }
  const allowedFields = ["newPassword", "oldPassword"];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  return isAllowed;
};
const sendRequestValidation = (req) => {
  const { status, receiverId } = req.params;
  const user = req.user;
  const validSatus = ["interested", "ignored"];
  const isValidStatus = validSatus.includes(status);

  if (!isValidStatus) {
    throw new Error("Requested Staus is not valid");
  }
  if (receiverId === user._id.toString()) {
    throw new Error("Invalid request");
  }
};

module.exports = {
  singhUpDataValidation,
  loginDataValidation,
  editDataValidation,
  updatePasswordValidation,
  sendRequestValidation,
};
