import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

type Todo = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string;
    createdAt: string;
    dueDate?: string;
  };
  

type TodoDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  todo: Todo;
};

const TodoDetailsDialog = ({ open, onClose, todo }: TodoDetailsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Todo Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{todo.title}</Typography>
        <Typography variant="body1" color="textSecondary">
          {todo.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {todo.status}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Priority: {todo.priority}
        </Typography>
        {todo.dueDate && (
          <Typography variant="body2" color="textSecondary">
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoDetailsDialog;
