import React, { useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import VisibilityIcon for details
import IconButton from '@mui/material/IconButton';
import EditTodoDialog from './EditTodoDialog';
import ConfirmDialog from './ConfirmDialog';
import TodoDetailsDialog from './TodoDetailsDialog'; // Import your TodoDetailsDialog component
import { List, ListItem, ListItemText, Typography, Chip, Box, Divider } from '@mui/material';

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
      const res = await axios.put(`http://localhost:5001/api/todos/${updatedTodo.id}`, updatedTodo);
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
    if (todoToDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/todos/${todoToDelete.id}`);
        setTodos((prev) => prev.filter((t) => t.id !== todoToDelete.id));
        setDeleteConfirmOpen(false); // Close confirm dialog
      } catch (error) {
        console.error('Failed to delete todo', error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        To do List
      </Typography>
      <List>
        {todos.map((todo) => (
          <Box key={todo.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={todo.title}
                secondary={
                  <Box component="span" sx={{ display: 'block' }}>
                    {todo.dueDate && (
                      <Typography component="span" variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                    <Box component="span" sx={{ mt: 1, display: 'block' }}>
                      <Chip label={todo.status} color="primary" size="small" sx={{ mr: 1, display: 'inline-block' }} component="span" />
                      {todo.priority && (
                        <Chip label={`Priority: ${todo.priority}`} size="small" sx={{ display: 'inline-block' }} component="span" />
                      )}
                    </Box>
                  </Box>
                }
              />
              <IconButton edge="end" aria-label="view details" onClick={() => handleViewDetailsClick(todo)}>
                <VisibilityIcon /> {/* Eye icon for viewing details */}
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(todo)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(todo)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>

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

      {/* Show the TodoDetailsDialog */}
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
