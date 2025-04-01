import React, { useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { alpha } from '@mui/material/styles';

import {
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import EditTodoDialog from './EditTodoDialog';
import ConfirmDialog from './ConfirmDialog';
import TodoDetailsDialog from './TodoDetailsDialog';

type Todo = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority?: string;
  createdAt: string;
  dueDate?: string;
};

type TodoListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList = ({ todos, setTodos }: TodoListProps) => {
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTodoDetails, setSelectedTodoDetails] = useState<Todo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetailsClick = (todo: Todo) => {
    setSelectedTodoDetails(todo);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditOpen(true);
  };

  const handleSave = async (updatedTodo: Todo) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/todos/${updatedTodo.id}`, updatedTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos((prev) => prev.map((t) => (t.id === updatedTodo.id ? res.data : t)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!token) {
      console.error('No token found.');
      return;
    }

    if (todoToDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/todos/${todoToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTodos((prev) => prev.filter((t) => t.id !== todoToDelete.id));
        setDeleteConfirmOpen(false);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Todo List
      </Typography>

      <Stack spacing={2}>
      {todos.map((todo) => {
  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'Complete';

  return (
    <Paper
      key={todo.id}
      elevation={2}
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderLeft: isOverdue ? '5px solid #f44336' : 'none',
        bgcolor: isOverdue
        ? theme.palette.mode === 'dark'
          ? alpha(theme.palette.error.main, 0.1)
          : '#fff0f0'
        : 'background.paper',


      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          {todo.title}
        </Typography>
        <Box>
          <IconButton onClick={() => handleViewDetailsClick(todo)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleEditClick(todo)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(todo)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {todo.dueDate && (
  <Typography
    variant="caption"
    sx={{
      fontWeight: isOverdue ? 600 : 'normal',
      fontSize: isOverdue && theme.palette.mode === 'dark' ? '0.75rem' : 'inherit',
      color: isOverdue
        ? theme.palette.mode === 'dark'
          ? '#ff6b6b' // daha parlak kırmızı
          : 'error.main'
        : 'text.secondary',
    }}
  >
    Due: {new Date(todo.dueDate).toLocaleDateString()}
  </Typography>
)}


      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label={todo.status} color="primary" size="small" />
        {todo.priority && <Chip label={`Priority: ${todo.priority}`} size="small" />}
        {isOverdue && <Chip label="Overdue" color="error" size="small" />}
      </Stack>
    </Paper>
  );
})}

      </Stack>

      {selectedTodo && (
        <EditTodoDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          todo={selectedTodo}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this task?"
      />

      {selectedTodoDetails && (
        <TodoDetailsDialog
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          todo={selectedTodoDetails}
        />
      )}
    </Box>
  );
};

export default TodoList;
