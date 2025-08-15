const express = require("express");
const userAuth = require("../middleware/userAuth");
const Request = require("../models/request");
const User = require("../models/user");

const userRouter = express.Router();
const USER_PUBLIC_DATA =
  "firstName lastName skills age about photoUrl createdAt";

userRouter.get("/received/request", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const receivedRequests = await Request.find({
      receiverId: user._id,
      status: "interested",
    })
      .populate("senderId", USER_PUBLIC_DATA)
      .select("senderId");
    const formattedData = receivedRequests.map((req) => ({
      _id: req._id,
      sender_id: req.senderId._id,
      firstName: req.senderId.firstName,
      photoUrl: req.senderId.photoUrl,
      about: req.senderId.about,
      skills: req.senderId.skills,
      age: req.senderId.age,
      createdAt: req.senderId.createdAt,
    }));
    res.status(200).json({ data: formattedData });
  } catch (err) {
    res.json({ message: err.message });
  }
});
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionList = await Request.find({
      $or: [
        { senderId: user._id, status: "accepted" },
        { receiverId: user._id, status: "accepted" },
      ],
    })
      .populate("senderId", USER_PUBLIC_DATA)
      .populate("receiverId", USER_PUBLIC_DATA);
    const filteredList = connectionList.map((listItem) => {
      if (listItem.senderId._id.toString() === user._id.toString()) {
        return listItem.receiverId;
      }
      return listItem.senderId;
    });
    res.status(200).json({ data: filteredList });
  } catch (err) {
    res.json({ message: err.message });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const hideProfileList = await Request.find({
      $or: [{ receiverId: user._id }, { senderId: user._id }],
    }).select("senderId receiverId");
    const filterdHideProfileList = new Set();
    hideProfileList.forEach((profile) => {
      filterdHideProfileList.add(profile.senderId.toString());
      filterdHideProfileList.add(profile.receiverId.toString());
    });
    const feedProfileList = await User.find({
      $and: [
        { _id: { $nin: Array.from(filterdHideProfileList) } },
        { _id: { $nin: user._id } },
      ],
    }).select(USER_PUBLIC_DATA);
    res.status(200).json({ data: feedProfileList });
  } catch (err) {
    res.status(404).json({ message: `ERROR: ${err.message}` });
  }
});

module.exports = userRouter;
