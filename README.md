# 📝 Todo App

A full-stack Todo application built with React, Express.js, TypeScript, PostgreSQL, and Prisma. The app supports JWT-based authentication, user-specific todo management, and is fully Dockerized for consistent cross-platform development.

---

## 🚀 Features

- User registration & login with JWT
- Create, update, delete, and search todos
- Pagination, filtering, and sorting
- PostgreSQL + Prisma ORM
- Fully Dockerized (works on any machine)
- Swagger API docs: `/api-docs`

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

## 🛠️ Useful Commands

### Migrate & Generate Prisma Client (inside backend container)

```bash
docker exec -it to-do-app-main-backend-1 npx prisma migrate dev
docker exec -it to-do-app-main-backend-1 npx prisma generate
```

---

## ⚠️ Troubleshooting

- If the frontend/backend containers crash:
  - Make sure your `.env` files are created and contain correct values.
  - Run `docker system prune -af` to clean old layers if needed.

---

