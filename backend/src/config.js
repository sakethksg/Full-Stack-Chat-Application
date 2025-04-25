const config = {
  mongoURI: process.env.MONGODB_URI || "mongodb://mongoadmin:secret@mongodb:27017/dbname?authSource=admin",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  port: process.env.PORT || 5001
};

export default config; 