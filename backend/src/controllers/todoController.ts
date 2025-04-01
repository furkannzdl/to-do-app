import express from 'express';
import { getTodosBySearchAndFilter, createTodo, deleteTodo, updateTodo } from '../services/todoService';  // Import the service methods
import { AuthenticatedRequest } from '../Middleware/authMiddleware';
type Request = express.Request;
type Response = express.Response;


export const getAllTodos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

  
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const priority = req.query.priority as string || '';
    const sortBy = (req.query.sortBy as string) || 'title';
    const sortOrder = (req.query.sortOrder as string) || 'asc';
    const userId = req.user?.id;

    if (typeof userId !== 'number') {
      res.status(401).json({ error: 'Unauthorized' }); 
      return; 
    }
  
    try {
      const { todos, totalPages, totalTodos } = await getTodosBySearchAndFilter(
        userId,
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
export const createTodoHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized' }); 
    return; 
  }

  const { title, description, status, priority, dueDate } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required and must be a string' });
    return;
  }

  if (status && typeof status !== 'string') {
    res.status(400).json({ error: 'Status must be a string' });
    return;
  }

  if (priority && typeof priority !== 'string') {
    res.status(400).json({ error: 'Priority must be a string' });
    return;
  }

  try {
    const todo = await createTodo(userId,title, description, status, priority, dueDate);
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Delete a todo by ID
export const deleteTodoHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;


  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }



  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized' }); 
    return; 
  }

  const id = parseInt(req.params.id);

  try {
    await deleteTodo(Number(id)); 
    res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Update a todo by ID
export const updateTodoHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized' }); 
    return; 
  }


  const id = parseInt(req.params.id);
  const { title, description, status, priority, dueDate } = req.body;



  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required and must be a string' });
    return;
  }

  if (status && typeof status !== 'string') {
    res.status(400).json({ error: 'Status must be a string' });
    return;
  }

  if (priority && typeof priority !== 'string') {
    res.status(400).json({ error: 'Priority must be a string' });
    return;
  }

  try {
    const updated = await updateTodo(id, title, description, status, priority, dueDate);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};
