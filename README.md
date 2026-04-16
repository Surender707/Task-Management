# 🚀 TaskFlow: Intelligent Task Management System

**TaskFlow** is a premium, full-stack productivity application built on the MERN (MongoDB, Express, React, Node) stack. Designed for the modern professional, it transcends basic CRUD applications by integrating a custom "Intelligence Engine" that provides smart insights, urgency-based task recommendations, and live productivity scoring.

---

## ✨ Elite Features

### 🧠 Custom Intelligence Engine
- **Smart Insights**: A rule-based engine that analyzes your workflow to provide strategic advice, identifying category backlogs and workload pressure.
- **Productivity Scoring**: A dynamic 0-100% score that gamifies your productivity, using a weighted algorithm based on task priority and completion speed.
- **Recommended Next Task**: An AI-priority algorithm that automatically selects the most critical task for you to tackle next.
- **Focus Mode**: A one-tap "tunnel vision" toggle that instantly hides non-essential tasks, leaving only **High** and **Urgent** priorities.

### 📊 Advanced Analytics
- **Live Dashboards**: Interactive Doughnut and Bar charts (powered by Chart.js) visualizing status distribution, priority spread, and category health.
- **Performance Tracking**: Real-time stats bar showing To-Do, In-Progress, and Completed task counts across the entire application.

### 🛠️ Professional Workflow
- **Precision Tasking**: Full CRUD capabilities with tagging for Priority (Low to Urgent) and Categories (Work, Personal, Study, Health).
- **Drag-and-Drop Reordering**: Seamlessly organize your day using the natural drag handles (using `@dnd-kit`).
- **Data Portability**: Export your entire task backlog to a professionally formatted **CSV** for external reporting or archival.
- **Glassmorphism UI**: A stunning, modern dark-themed interface with high-performance animations and responsive layouts.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Chart.js, React-Router-DOM, React-Toastify, React-Icons |
| **Backend** | Node.js, Express.js, JWT (JSON Web Tokens), Bcryptjs |
| **Database** | MongoDB (Mongoose), MongoDB-Memory-Server (Auto-Fallback) |
| **Styling** | Vanilla CSS (Modern CSS3 Variables & Flex/Grid) |

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Optional - Fallback available)

### 2. Setup Server
```bash
cd server
npm install
npm run dev
```
*Note: The server will automatically use a high-performance Memory Database if your local MongoDB instance is not detected, ensuring 0-config startup for demos.*

### 3. Setup Client
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Server (`/server/.env`)
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
```

### Client (`/client/.env`)
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🏗️ Architecture Summary

### Backend Architecture
- **JWT Auth Middleware**: Protects private routes and ensures session security.
- **Resilient DB Config**: A custom database connector that attempts persistent storage first before failing over to an in-memory server for demonstrations.

### Frontend Architecture
- **Context API**: Centralized state management for Authentication and User sessions.
- **Component Decomposition**: Reusable modules for Cards, Filters, and Analytics.
- **Intelligence Engine**: Localized business logic for productivity scoring and data analysis.

---

## 👨‍💻 Capstone Project
This project was developed as a comprehensive internship capstone project to demonstrate proficiency in modern Full-Stack development, secure API design, and data-driven client logic.
