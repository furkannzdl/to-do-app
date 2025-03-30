import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.ts'; // ✅ IMPORT ROUTES

declare namespace Express {
  export interface Request {
    user?: { id: number; email: string };
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes); // ✅ USE ROUTES

// Health check
app.get('/', (req, res) => {
  res.send('Todo API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
