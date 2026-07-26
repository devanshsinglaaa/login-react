# 🚀 Production Management System - Dockerized Deployment

A production-ready **Full Stack Production & Workforce Management System** containerized using **Docker** and orchestrated with **Docker Compose**.

This project demonstrates how to deploy a real-world React + Node.js + MySQL application using Docker with multi-container architecture, custom networking, persistent storage, health checks, environment variables, and Nginx.

---

# 📌 Project Overview

This application is designed for managing production workflows, employees, vendors, products, and reporting within a manufacturing environment.

The objective of this repository is **not application development**, but demonstrating **production-grade containerization and deployment practices** using Docker.

---

# 🏗 Architecture

```

                     Browser
                        │
                        ▼
                  Nginx (Frontend)
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
 React (Vite Build)             Express Backend
                                        │
                                        ▼
                                 MySQL Database
                              (Persistent Volume)

```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Multer
- Bcrypt

## Database

- MySQL 8.4

## DevOps

- Docker
- Docker Compose
- Nginx
- Docker Networks
- Docker Volumes
- Health Checks
- Environment Variables

---

# 📂 Project Structure

```

login-react/
│
├── backend/
│ ├── Dockerfile
│ ├── server.js
│ ├── package.json
│
├── outstaff-app/
│ ├── Dockerfile
│ ├── nginx.conf
│ ├── src/
│ ├── public/
│ ├── package.json
│
├── database/
│ └── outstaff_db.sql
│
├── docker-compose.yml
│
└── README.md

```

---

# 🐳 Docker Architecture

The application consists of **three containers**.

| Container | Technology | Purpose |
|------------|------------|----------|
| Frontend | Nginx | Serves React Production Build |
| Backend | Node.js | REST APIs |
| Database | MySQL 8.4 | Stores Application Data |

All containers communicate over a custom Docker network.

---

# ⚙ Docker Features Implemented

✅ Multi-container deployment

✅ Docker Compose orchestration

✅ Custom Docker Network

✅ Persistent MySQL Volume

✅ Database auto initialization

✅ Environment Variables

✅ Health Checks

✅ Container Dependencies

✅ Nginx Static File Hosting

✅ React SPA Routing Support

✅ Automatic Database Import

---

# 📦 Docker Compose Services

## Frontend

- Built using multi-stage Docker build
- React production build
- Served using Nginx
- SPA routing enabled
- Runs on

```

http://localhost:3007

```

---

## Backend

Node.js Express API Server

Runs on

```

http://3.89.255.32:5000

```

Uses environment variables for

- Database Host
- Database User
- Password
- Database Name
- Client URL

---

## Database

MySQL 8.4

Features

- Persistent Docker Volume
- Automatic SQL Import
- Health Checks
- Database Initialization

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/production-management-system.git

cd production-management-system
```

---

## Start Application

```bash
docker compose up --build -d
```

---

## Verify Running Containers

```bash
docker ps
```

Expected

```
production_frontend
production_backend
production_mysql
```

---

## Stop Containers

```bash
docker compose down
```

---

## Remove Containers and Volumes

```bash
docker compose down -v
```

---

# 🌐 Application URLs

Frontend

```
http://localhost:3007
```

Backend

```
http://3.89.255.32:5000
```

Database

```
localhost:3306
```

---

# 🗄 Database

The database is automatically created using

```
database/outstaff_db.sql
```

during the first Docker Compose startup.

Persistent storage is provided using Docker Volumes.

---

# 🔧 Environment Variables

Backend

| Variable | Description |
|------------|------------|
| PORT | Backend Port |
| DB_HOST | MySQL Container |
| DB_USER | Database User |
| DB_PASSWORD | Database Password |
| DB_NAME | Database Name |
| CLIENT_URL | Allowed Frontend Origin |

---

# 🌍 Docker Network

A custom Docker bridge network connects all services.

```
production_network
```

This allows communication using container names.

Example

```
Backend → mysql
```

instead of

```
localhost
```

---

# 📁 Persistent Storage

Database persistence is achieved using

```
mysql_data
```

Docker Volume.

Application data remains intact even if containers are recreated.

---

# 🔍 Health Check

The MySQL container uses

```yaml
healthcheck:
  test: ["CMD","mysqladmin","ping","-h","localhost","-proot123"]
```

The backend waits until the database becomes healthy before starting.

---

# 🔐 Security

- Environment Variables
- Password Hashing using Bcrypt
- CORS Configuration
- JWT Authentication
- Docker Network Isolation

---

# 🧪 Deployment Workflow

1. Clone Repository

2. Build Images

```
docker compose build
```

3. Start Containers

```
docker compose up -d
```

4. Verify Containers

```
docker ps
```

5. Access Application

```
http://localhost:3007
```

---

# 🛠 Troubleshooting

## Check Running Containers

```
docker ps
```

---

## Backend Logs

```
docker logs production_backend
```

---

## Frontend Logs

```
docker logs production_frontend
```

---

## MySQL Logs

```
docker logs production_mysql
```

---

## Enter MySQL Container

```
docker exec -it production_mysql mysql -uroot -p
```

---

## Restart Services

```
docker compose restart
```

---

# 📚 DevOps Concepts Demonstrated

- Docker Images
- Multi-stage Builds
- Docker Compose
- Container Networking
- Docker Volumes
- Environment Variables
- Health Checks
- Nginx Reverse Proxy
- React SPA Deployment
- Backend Containerization
- Database Containerization
- Production Deployment
- Application Troubleshooting
- Container Debugging

---

# 📈 Future Improvements

- Reverse Proxy API Routing (/api)
- HTTPS using Let's Encrypt
- GitHub Actions CI/CD
- Docker Hub Image Publishing
- Kubernetes Deployment
- AWS EC2 Deployment
- Nginx SSL Termination
- Load Balancer
- Monitoring using Prometheus & Grafana

---

# 👨‍💻 Author

**Devansh Singla**

MCA Student | DevOps Enthusiast | Full Stack Developer

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/devansh-singla

---

# ⭐ Support

If you found this project useful,

⭐ Star the repository

🍴 Fork the repository

💼 Connect with me on LinkedIn

🚀 Happy Learning!
