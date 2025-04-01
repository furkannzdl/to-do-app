import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes'; 
import authRoutes from './routes/authRoutes';

declare namespace Express {
  export interface Request {
    user?: { id: number; email: string };
  }
}

dotenv.config();

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');
const PORT = process.env.PORT || 5001;

// Middlewares

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes); // ✅ USE ROUTES

// Health check
app.get('/', (req, res) => {
  res.send('Todo API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
