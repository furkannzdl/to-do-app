import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('title'); // Default to sorting by title
  const [sortOrder, setSortOrder] = useState<string>('asc'); // Default to ascending order
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/todos', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchQuery,
            status: filterStatus === 'All' ? '' : filterStatus,
            sortBy: sortOption,
            sortOrder: sortOrder,
          },
        });
        setTodos(res.data.todos);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Failed to fetch todos:', err);
      }
    };
  
    fetchTodos();
  }, [currentPage, searchQuery, filterStatus, sortOption, sortOrder]); // 👈 buraya dikkat
  
  
  


    
    

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', p: 3 }}>
      {/* Search Input */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Search by Title or Description"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Filter Options */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Order */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Create Task Button */}
      <Box textAlign="right" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Create Task
        </Button>
      </Box>

      {todos.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4, mb: 2 }}>
            No tasks found. Start by creating one!
        </Typography>
        ) : (
        <TodoList todos={todos} setTodos={setTodos} />
        )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            sx={{ mx: 1 }}
        >
            Previous
        </Button>

        {[...Array(totalPages)].map((_, index) => (
            <Button
            key={index}
            variant={currentPage === index + 1 ? 'contained' : 'outlined'}
            onClick={() => setCurrentPage(index + 1)}
            sx={{ mx: 0.5 }}
            >
            {index + 1}
            </Button>
        ))}

        <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            sx={{ mx: 1 }}
        >
            Next
        </Button>
        </Box>


      {/* Dialog for Create Task Form */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TodoForm
            onClose={() => setShowForm(false)}
            onAdd={(newTodo: any) => {
              setTodos((prev) => [...prev, newTodo]);
              setShowForm(false); // Close the form after adding the task
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
