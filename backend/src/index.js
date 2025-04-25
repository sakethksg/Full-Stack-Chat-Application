import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';

import { connectDB } from "./lib/db.js";
import config from "./config.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || config.port;

// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, '../../frontend/dist');
  console.log('Serving frontend from:', frontendPath);
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Add basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
