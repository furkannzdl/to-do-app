import { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5001/api/todos', {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
        });
        console.log('Created Todo:', response.data);
        onAdd(response.data); // ✅ Update parent state
        onClose(); // ✅ Close form
      } catch (error) {
        console.error('Failed to create todo:', error);
      }
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Create New Todo</Typography>
  
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
          {['Pending', 'In Progress', 'Complete'].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
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
          {['Low', 'Medium', 'High'].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
  
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
              },
            }}
          />
        </LocalizationProvider>
  
        <Button type="submit" variant="contained" color="primary">
          Add Todo
        </Button>
      </Box>
    );
  };
  
export default TodoForm;
