const config = {
  apiUrl: process.env.NODE_ENV === "production" 
    ? "https://chat-app-backend.onrender.com"
    : "http://localhost:5001"
};

export default config; 