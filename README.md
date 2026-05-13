# Smart Task Management System (Microservices)

A complete project demonstrating **Microservices Based Application Deployment on Cloud** using Node.js, Express, MongoDB, Docker, and a modern React dashboard.

## 🚀 Architecture Overview
- **User Service (Port 5001)**: Registration, Login, Authentication, Profile Management.
- **Task Service (Port 5002)**: CRUD operations for tasks, assignment, and status tracking.
- **Project Service (Port 5003)**: Project creation and team collaboration tracking.
- **Notification Service (Port 5004)**: Global alert management and reminders.
- **API Gateway (Port 3000)**: Serves the Frontend and handles routing to internal microservices.

## 🛠 Technology Stack
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Individual databases per service)
- **Frontend**: React, Tailwind CSS (Modern Dark Dashboard)
- **Containerization**: Docker, Docker Compose
- **Tooling**: Axios, Lucid-React, Motion

---

## 📦 Installation & Setup

### 1. Manual Local Installation
If you want to run services without Docker (requires Local MongoDB):
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Start all services concurrently:
   ```bash
   npm run dev
   ```

### 2. Docker Setup (Recommended)
Build and start all containers including MongoDB:
```bash
docker-compose up --build
```
This will start:
- MongoDB at `localhost:27017`
- All microservices at ports `5001-5004`
- Frontend dashboard at `localhost:3000`

---

## 📑 API Endpoints & Testing

### User Service (`/users`)
- `POST /users/register`: Create a new user.
- `POST /users/login`: Authenticate and login.
- `GET /users`: List all users (JSON output).
- `GET /users/:id`: Get specific user details.

### Task Service (`/tasks`)
- `POST /tasks`: Create a new task.
- `GET /tasks`: List all tasks.
- `PUT /tasks/:id`: Update task status/details.
- `DELETE /tasks/:id`: Remove a task.

---

## ☁️ Cloud Deployment Steps

This project is structured for easy deployment to **Google Cloud Platform**, **AWS**, or **Azure**:

1. **Push Container Images**:
   Build each service subdirectory into its own image and push to Container Registry (GCR/ECR).
2. **Kubernetes (GKE/EKS)**:
   Deploy using Kubernetes manifests (provided in sample documentation) to manage scaling and self-healing.
3. **Environment Variables**:
   Ensure `MONGO_URI` is set to point to a managed MongoDB instance (like MongoDB Atlas) in your production environment.
4. **Load Balancing**:
   Use an Ingress Controller to route traffic to the Frontend (Port 3000) and API endpoints.

---

## 📸 Sample Outputs
The dashboard features glowing cards and a sidebar navigation.
- **Home**: Dashboard stats and quick-action forms.
- **JSON Routes**: Native JSON viewing for audit and API testing (e.g., `localhost:3000/users`).

---

*Note: In the AI Studio preview environment, services run concurrently within the container and are proxied to Port 3000.*
