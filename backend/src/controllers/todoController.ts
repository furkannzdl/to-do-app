import express from 'express';
import { getTodosBySearchAndFilter, createTodo, deleteTodo, updateTodo } from '../services/todoService.ts';  // Import the service methods
type Request = express.Request;
type Response = express.Response;


export const getAllTodos = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const priority = req.query.priority as string || '';
    const sortBy = (req.query.sortBy as string) || 'title';
    const sortOrder = (req.query.sortOrder as string) || 'asc';
  
    try {
      const { todos, totalPages, totalTodos } = await getTodosBySearchAndFilter(
        page,
        limit,
        search,
        status,
        priority,
        sortBy,
        sortOrder
      );
  
      res.json({ todos, totalPages, totalTodos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  };
  
// Create a new todo
export const createTodoHandler = async (req: Request, res: Response) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const todo = await createTodo(title, description, status, priority, dueDate);
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Delete a todo by ID
export const deleteTodoHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteTodo(Number(id)); // Pass the ID to the service method
    res.status(204).send(); // 204 = No Content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Update a todo by ID
export const updateTodoHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const updated = await updateTodo(Number(id), title, description, status, priority, dueDate);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};
