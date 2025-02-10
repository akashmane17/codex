# Collaborative Code Sharing & Editing Platform

A real-time collaborative platform for seamless code sharing and editing, built using **React.js, Node.js, Express, Socket.io, MongoDB, Redis, Kafka, and Docker**.

---

## 🚀 Getting Started

Follow the steps below to set up and run the project on your local machine.

### **Prerequisites**

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Node.js & npm](https://nodejs.org/)

### **Installation & Setup**

1. **Start Services with Docker**

   ```sh
   docker-compose up -d
   ```

   This will start **Zookeeper, Kafka, and Redis** services.

2. **Set Up the Backend**

   ```sh
   cd backend
   npm install
   npm run dev
   ```

   This starts the backend server.

3. **Set Up the Client**

   ```sh
   cd ../client
   npm install
   npm run dev
   ```

   This starts the frontend application.

4. **Set Up the Kafka Consumer**
   ```sh
   cd ../kafka-consumer
   npm install
   npm run dev
   ```
   This starts the Kafka consumer service.

---

## 📌 Features

- **Real-time collaborative code editing** using **Socket.io**
- **Scalable architecture** powered by **Kafka & Redis**
- **Microservices-based design** for better maintainability
- **Dockerized environment** for easy deployment

---

## 📂 Project Structure

```
📦 project-root
 ┣ 📂 backend       # Backend service (Node.js, Express, MongoDB)
 ┣ 📂 client        # Frontend application (React.js)
 ┣ 📂 kafka-consumer # Kafka consumer service
 ┣ 📜 docker-compose.yml  # Docker configuration
 ┣ 📜 README.md      # Project documentation
```

---

## 🔧 Stopping the Services

To stop all running services, use:

```sh
docker-compose down
```

To remove all volumes (including Redis data), use:

```sh
docker-compose down -v
```