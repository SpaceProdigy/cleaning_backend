import mongoose from "mongoose";
import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";

const { DB_HOST, PORT } = process.env;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("chat-message", (sms) => {
    socket.broadcast.emit("chat-message", sms);
  });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    httpServer.listen(PORT || 3000, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
