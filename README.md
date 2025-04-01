# 📝 Todo App

A full-stack Todo application built with React, Express.js, TypeScript, PostgreSQL, and Prisma. The app supports JWT-based authentication, user-specific todo management.

---

## 🚀 Features

- User registration & login with JWT
- Create, update, delete, and search todos
- Pagination, filtering, and sorting
- Search by title or description
- PostgreSQL + Prisma ORM
- Dockerized 
- Swagger API docs: `/api-docs`
- Dark/Light theme
- Overdue display

---

## 🧱 Tech Stack

- Frontend: React + TypeScript + MUI
- Backend: Express.js + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Containerization: Docker & Docker Compose

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/furkannzdl/to-do-app.git
cd to-do-app
```




## 🐳 Run with Docker


```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001/api](http://localhost:5001/api)
- Swagger API Docs: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

---

## 🛠️ After Running Containers

### Migrate & Generate Prisma Client (These commands should be executed one by one)

```bash
docker exec -it to-do-app-main-backend-1 npx prisma migrate dev
docker exec -it to-do-app-main-backend-1 npx prisma generate
```

---



