const { Server } = require("socket.io");

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
    socket.on("sendMessage", ({ userId, toUserId, text, firstName }) => {
      const roomId = [userId, toUserId].sort().join("_");
      io.to(roomId).emit("receivedMessage", { firstName, text });
      //   console.log(newMessage);
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializingSocket;
