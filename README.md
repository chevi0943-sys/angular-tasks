# 👍 WolfTasks - Team & Project Management System

An advanced **Full-Stack** project management system designed for team collaboration and task tracking, inspired by **Kanban** and **ClickUp** workflows.

---

## 📂 Project Structure
The project is divided into two main repositories/folders:
* **`task-manager`**: The Frontend client built with **Angular 20**.
* **`server`**: The Backend server built with **Node.js** and **SQLite** database.

---

## 🛠 Tech Stack

### **Frontend**
* **Framework:** Angular 20 (TypeScript)
* **Styling:** SCSS
* **Authentication:** JWT (JSON Web Token)

### **Backend**
* **Runtime:** Node.js
* **Database:** SQLite
* **Architecture:** RESTful API

---

## 🚀 Installation & Setup

### 1. Run the Backend (Server)
The server must be running at `http://localhost:3000` for the client to connect.
```bash
cd server
npm install
npm start
2. Run the Frontend (Client)
Open a new terminal and run:

Bash
cd task-manager
npm install
ng serve
After successful compilation, the app will be available at: http://localhost:4200.

📋 Key Features
Authentication System: Secure Registration and Login with token-based session management.

Team Management: Create teams and invite members to collaborate.

Project Organization: Organize team workloads into specific, manageable projects.

Interactive Task Board: * Add, update (PATCH), and delete tasks.

Real-time task comments for team communication.

Status tracking for project transparency.
