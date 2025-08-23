const express = require("express");
const userAuth = require("../middleware/userAuth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

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

module.exports = chatRouter;
