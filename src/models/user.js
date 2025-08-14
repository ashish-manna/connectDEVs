const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 40,
      minLength: 4,
    },
    lastName: {
      type: String,
      maxLength: 40,
      minLength: 4,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: (val) => {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Please enter a strong Password.");
        }
      },
    },
    photoUrl: {
      type: String,
      default: function () {
        const randomAvatar = Math.floor(Math.random() * 100) + 1;
        return `${process.env.DUMMY_DEFAULT_PROFILE_IMG}/${randomAvatar}`;
      },
      validate: (val) => {
        if (!validator.isURL(val)) {
          throw new Error("Photo URL is not valid!!");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Email is not valid!!");
        }
      },
    },
    about: {
      type: String,
      default: "Your description will shows here...",
    },
    skills: {
      type: [String],
      validate: (arr) => {
        if (arr.length > 5) {
          throw new Error("Max of 5 skills can be added.");
        }
      },
    },
    age: {
      type: Number,
      validate: (val) => {
        if (val < 18) {
          throw new Error("Age must be above 18");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
