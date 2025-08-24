const express = require("express");
const userAuth = require("../middleware/userAuth");
const Chat = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

const USER_PUBLIC_DATA =
  "firstName lastName skills age about photoUrl createdAt";

chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
  try {
    const { targetId } = req.params;
    const userId = req.user._id;
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetId],
        messages: [],
      });
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json(err);
  }
});
chatRouter.get("/chat/profile/:targetId", userAuth, async (req, res) => {
  try {
    const { targetId } = req.params;
    const targetUser = await User.findById({ _id: targetId }).select(
      USER_PUBLIC_DATA
    );
    if (!targetUser) {
      throw new Error(`User not found!`);
    }
    res.status(200).json(targetUser);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = chatRouter;
