import express from 'express';
import { getAllTodos, createTodoHandler, deleteTodoHandler, updateTodoHandler } from '../controllers/todoController.ts';  // Import the controller methods

const router = express.Router();

router.get('/', getAllTodos); // Get all todos with pagination
router.post('/', createTodoHandler); // Create a new todo
router.delete('/:id', deleteTodoHandler); // Delete a todo by ID
router.put('/:id', updateTodoHandler); // Update a todo by ID

export default router;
