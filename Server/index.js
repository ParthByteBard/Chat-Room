const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = 3002;


app.use(cors());  // Use CORS middleware to allow cross-origin requests

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.io server attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Only allow requests from this origin (client-side)
    methods: ["GET", "POST"],
  },
});

// Listen for WebSocket connections
io.on("connection", (socket) => {
  console.log("Connection established, socket ID:", socket.id);

  // Listen for the 'join_room' event and join the specified room
  socket.on("join_room", (data) => {
    socket.join(data);  // Join the specified room
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Listen for 'send_message' events and broadcast to the specified room
  socket.on("send_message", (data) => {
    console.log(data);  // Log the message data
    socket.to(data.room).emit("recieve_message", data);  // Broadcast the message to others in the room
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`User with ID: ${socket.id} left room: ${room}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
