// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const masterRoute = require("./routes/masterRoutes");
const adminRoute = require("./routes/administrationRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app); // 🧠 Socket.IO uses this
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Attach io to app for global use
app.set("io", io);

// Allow frontend access
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/master", authMiddleware, masterRoute);  
app.use("/api/administration", authMiddleware, adminRoute);

// Setup socket connection
io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);

  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

// Start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
