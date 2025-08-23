const { Server } = require("socket.io");
const Chat = require("../models/chat");

const initializingSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.VITE_APP_URL,
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, toUserId, firstName }) => {
      const roomId = [userId, toUserId].sort().join("_");
      socket.join(roomId);
      console.log(`${firstName} joined this room ${roomId}`);
    });
    socket.on("sendMessage", async ({ userId, toUserId, text, firstName }) => {
      const roomId = [userId, toUserId].sort().join("_");
      io.to(roomId).emit("receivedMessage", { firstName, text });
      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, toUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, toUserId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          text,
        });
        await chat.save();
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializingSocket;
