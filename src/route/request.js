const express = require("express");
const userAuth = require("../middleware/userAuth");
const User = require("../models/user");
const { sendRequestValidation } = require("../utils/validation");
const Request = require("../models/request");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      sendRequestValidation(req);
      const { status, receiverId } = req.params;
      const user = req.user;
      const isValidUser = await User.findById(receiverId);
      if (!isValidUser) {
        throw new Error("User Not Found");
      }
      const isExistRequest = await Request.findOne({
        $or: [
          { senderId: user._id, receiverId: receiverId },
          { senderId: receiverId, receiverId: user._id },
        ],
      });
      if (isExistRequest) {
        throw new Error("Request is already exist");
      }
      const newRequest = new Request({
        senderId: user._id,
        receiverId,
        status,
      });
      await newRequest.save();
      res.status(200).json({
        message: `${user.firstName}  ${status} to ${isValidUser.firstName} `,
        receiver: isValidUser.firstName,
        sender: user.firstName,
      });
    } catch (err) {
      res.json({ message: `${err.message}` });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const user = req.user;
      const validStatus = ["accepted", "rejected"];
      const isValidStatus = validStatus.includes(status);
      if (!isValidStatus) {
        throw new Error(`Request is not valid of ${status}`);
      }
      const validRequest = await Request.findOne({
        _id: requestId,
        receiverId: user._id,
        status: "interested",
      }).populate("senderId", ["firstName"]);
      if (!validRequest) {
        throw new Error("Request is not valid");
      }
      validRequest.status = status;
      await validRequest.save();
      res.status(200).json({
        message: `You ${status} connection request received from ${validRequest.senderId.firstName}`,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
