import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ConfirmDialog from './ConfirmDialog';

type EditTodoDialogProps = {
  open: boolean;
  onClose: () => void;
  todo: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string;
    dueDate?: string;
  };
  onSave: (updated: any) => void;
};

const statusOptions = ['Pending', 'In Progress', 'Complete'];
const priorityOptions = ['Low', 'Medium', 'High'];

const EditTodoDialog = ({ open, onClose, todo, onSave }: EditTodoDialogProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [priority, setPriority] = useState(todo.priority || 'Medium');
  const [dueDate, setDueDate] = useState<Dayjs | null>(
    todo.dueDate ? dayjs(todo.dueDate) : null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    onSave({
      id: todo.id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
    setConfirmOpen(false);
    onClose();
  };

  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description);
    setStatus(todo.status);
    setPriority(todo.priority || 'Medium');
    setDueDate(todo.dueDate ? dayjs(todo.dueDate) : null);
  }, [todo]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Todo</DialogTitle>

        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            label="Status"
            select
            fullWidth
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Priority"
            select
            fullWidth
            margin="normal"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newDate) => setDueDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save changes to this task?"
      />
    </>
  );
};

export default EditTodoDialog;
