# 💬 Full-Stack Real-Time Chat Application

A modern, scalable real-time chat application built with the MERN stack, featuring WebSocket communication, JWT authentication, and cloud-ready deployment with Docker and Kubernetes.

## 📝 Introduction

This full-stack chat application delivers a seamless real-time messaging experience with a focus on scalability, security, and modern web technologies. Built with React, Node.js, MongoDB, and Socket.io, it provides instant messaging capabilities with user authentication, profile management, and online presence tracking.

## ✨ Features

* **Real-time Messaging**: Instant message delivery using Socket.io WebSockets
* **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
* **Profile Management**: Upload and update profile pictures using Cloudinary
* **Online Status**: Real-time online/offline status indicators
* **Message History**: Persistent message storage with MongoDB
* **Responsive UI**: Mobile-friendly design with TailwindCSS and DaisyUI
* **Theme Support**: Multiple theme options for personalized experience
* **Typing Indicators**: See when other users are typing
* **Scalable Architecture**: Containerized with Docker and orchestrated with Kubernetes

## 🛠️ Tech Stack

### Backend
* **Node.js** & **Express.js** - Server framework
* **MongoDB** - Database
* **Socket.io** - Real-time bidirectional communication
* **JWT** - Authentication
* **Cloudinary** - Media storage
* **bcryptjs** - Password hashing

### Frontend
* **React** - UI library
* **Vite** - Build tool
* **TailwindCSS** - Styling
* **DaisyUI** - Component library
* **Zustand** - State management
* **Axios** - HTTP client
* **React Router** - Navigation

### DevOps & Infrastructure
* **Docker** - Containerization
* **Docker Compose** - Multi-container orchestration
* **Kubernetes** - Container orchestration
* **Nginx** - Reverse proxy & static file serving

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher)
* **Docker** & **Docker Compose** (for containerization)
* **MongoDB** (if running locally without Docker)
* **Git** (to clone the repository)
* **Kubernetes** (kubectl and a cluster - optional, for K8s deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sakethksg/ChatHub.git
cd ChatHub
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create `.env` with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://mongoadmin:secret@mongodb:27017/chatapp?authSource=admin

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Server Configuration
PORT=5001
NODE_ENV=production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **⚠️ Important:** Replace the placeholder values with your actual credentials. Generate a strong JWT secret using: `openssl rand -base64 32`

### 3. Run with Docker Compose (Recommended)

The easiest way to run the entire application:

```bash
# From the project root directory
docker-compose up -d --build
```

This will start:
- MongoDB database on port 27017
- Backend API on port 5001
- Frontend application on port 80

**Access the application:** `http://localhost`

**Backend API:** `http://localhost:5001`

### 4. Verify Deployment

Check container status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f
```

Stop the application:
```bash
docker-compose down
```

## 🐳 Docker Deployment (Manual)

If you prefer to build and run containers individually:

### Step 1: Create Docker Network

```bash
docker network create chatapp-network
```

### Step 2: Run MongoDB

```bash
docker build -f mongodb.Dockerfile -t chatapp-mongo .
docker run -d \
  --name mongodb \
  --network chatapp-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  chatapp-mongo
```

### Step 3: Build and Run Backend

```bash
cd backend
docker build -t chatapp-backend .
docker run -d \
  --name backend \
  --network chatapp-network \
  -p 5001:5001 \
  --env-file .env \
  chatapp-backend
cd ..
```

### Step 4: Build and Run Frontend

```bash
cd frontend
docker build -t chatapp-frontend .
docker run -d \
  --name frontend \
  --network chatapp-network \
  -p 80:80 \
  chatapp-frontend
cd ..
```

## ☸️ Kubernetes Deployment

Deploy the application to a Kubernetes cluster:

### Step 1: Create Namespace

```bash
kubectl apply -f k8s/namespace.yml
```

### Step 2: Configure Secrets

Edit `k8s/secrets.yml` with your base64-encoded credentials:

```bash
echo -n "your_jwt_secret" | base64
echo -n "mongodb://mongoadmin:secret@mongodb:27017/chatapp?authSource=admin" | base64
```

Apply secrets:
```bash
kubectl apply -f k8s/secrets.yml
```

### Step 3: Deploy MongoDB

```bash
kubectl apply -f k8s/mongodb-pv.yml
kubectl apply -f k8s/mongodb-pvc.yml
kubectl apply -f k8s/mongodb-deployment.yml
kubectl apply -f k8s/mongodb-service.yml
```

### Step 4: Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml
```

### Step 5: Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
```

### Step 6: Configure Ingress

```bash
kubectl apply -f k8s/ingress.yml
```

### Verify Kubernetes Deployment

```bash
# Check pods
kubectl get pods -n chatapp

# Check services
kubectl get services -n chatapp

# Check ingress
kubectl get ingress -n chatapp

# View logs
kubectl logs -f <pod-name> -n chatapp
```

## 💻 Local Development (Without Docker)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
ChatHub/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── lib/             # Utilities (socket, db, cloudinary)
│   │   └── seeds/           # Database seeders
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Frontend React app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilities
│   │   └── constants/       # Constants
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── k8s/                     # Kubernetes manifests
│   ├── namespace.yml
│   ├── secrets.yml
│   ├── mongodb-*.yml
│   ├── backend-*.yml
│   ├── frontend-*.yml
│   └── ingress.yml
├── docker-compose.yml       # Docker Compose configuration
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with a specific user
- `POST /api/messages/send/:id` - Send a message to a user

## 🔌 WebSocket Events

### Client → Server
- `setup` - Initialize socket connection for user
- `typing` - User started typing
- `stop-typing` - User stopped typing

### Server → Client
- `online-users` - List of currently online users
- `new-message` - New message received
- `user-connected` - User came online
- `user-disconnected` - User went offline

## 🧪 Testing

### Seed Database with Test Users

```bash
cd backend
npm run seed
```

This creates test users you can use to test the chat functionality.

## 🐛 Troubleshooting

### Connection Issues

**MongoDB Connection Error:**
```bash
# Check MongoDB container is running
docker ps | grep mongodb

# View MongoDB logs
docker logs mongodb
```

**Backend Not Starting:**
```bash
# Check environment variables
cat backend/.env

# View backend logs
docker logs backend
```

**Frontend Build Errors:**
```bash
# Clear node_modules and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts

If ports 80, 5001, or 27017 are already in use:

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :5001
sudo lsof -i :27017

# Kill the process or change the port in docker-compose.yml
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage

## 🔮 Roadmap & Future Enhancements

- [ ] **Group Chat**: Multi-user chat rooms
- [ ] **File Sharing**: Send images, videos, and documents
- [ ] **Voice/Video Calls**: WebRTC integration
- [ ] **Message Reactions**: Emoji reactions to messages
- [ ] **Read Receipts**: See when messages are read
- [ ] **Search Functionality**: Search through message history
- [ ] **Push Notifications**: Desktop and mobile notifications
- [ ] **Message Encryption**: End-to-end encryption
- [ ] **User Blocking**: Block/unblock users
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Monitoring**: Prometheus and Grafana integration
- [ ] **Load Balancing**: Redis adapter for Socket.io scaling

## 📸 Screenshots

### Chat Interface
![Chat Interface](frontend/public/chat.png)

### Settings Page
![Settings](frontend/public/settings.png)

### Logout Confirmation
![Logout](frontend/public/logout.png)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for flexible data storage
- Cloudinary for media management
- The open-source community for amazing tools and libraries

## 👤 Author

**Saketh**
- GitHub: [@sakethksg](https://github.com/sakethksg)
- Repository: [ChatHub](https://github.com/sakethksg/ChatHub)

---

## 💡 Support

If you find this project helpful, please give it a ⭐️!

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, MongoDB, and Socket.io**
