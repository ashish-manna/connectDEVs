const express = require("express");
const userAuth = require("../middleware/userAuth");
const Request = require("../models/request");

const userRouter = express.Router();
const USER_PUBLIC_DATA = "firstName lastName skills age about";

userRouter.get("/received/request", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const receivedRequests = await Request.find({
      receiverId: user._id,
      status: "interested",
    })
      .populate("senderId", USER_PUBLIC_DATA)
      .select("senderId");
    res.status(200).json({ data: receivedRequests });
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

module.exports = userRouter;
