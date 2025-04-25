const config = {
  mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  port: process.env.PORT || 5001
};

export default config; 