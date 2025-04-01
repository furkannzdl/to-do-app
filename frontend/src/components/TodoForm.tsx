import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

type TodoFormProps = {
  onClose: () => void;
  onAdd: (newTodo: any) => void;
};

const statusOptions = ['Pending', 'In Progress', 'Complete'];
const priorityOptions = ['Low', 'Medium', 'High'];

const TodoForm = ({ onClose, onAdd }: TodoFormProps) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5001/api/todos',
        {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: isMobile ? 2 : 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant={isMobile ? 'h6' : 'h5'} textAlign="center">
        Create New Task
      </Typography>

      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
        <TextField
          label="Status"
          select
          fullWidth
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
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </LocalizationProvider>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

export default TodoForm;
