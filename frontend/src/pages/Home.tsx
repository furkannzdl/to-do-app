import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  IconButton,
  Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import Logo from '../assets/todoicon.png';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import { useAuth } from '../context/AuthContext';


const statusOptions = ['Pending', 'In Progress', 'Complete'];
const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Priority', value: 'priority' },
  { label: 'Due Date', value: 'dueDate' },
];

type HomeProps = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const Home = ({ isDarkMode, setIsDarkMode }: HomeProps) => {
  const { user, token, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/todos', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchQuery,
            status: filterStatus,
            sortBy: sortOption,
            sortOrder,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(res.data.todos);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Failed to fetch todos:', err);
      }
    };

    fetchTodos();
  }, [currentPage, searchQuery, filterStatus, sortOption, sortOrder]);

  const toggleStatus = (status: string) => {
    setFilterStatus(prev => (prev === status ? '' : status));
  };

  const toggleSort = (option: string) => {
    setSortOption(prev => (prev === option ? '' : option));
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          bgcolor: grey[900],
          color: '#fff',
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <img src={Logo} alt="logo" style={{ width: 32, height: 32 }} />
          <Typography variant="h6" fontWeight="bold">
            Todo App
          </Typography>
        </Box>

       

        <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem' }}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Typography>
        <Switch
        checked={isDarkMode}
        onChange={() => setIsDarkMode((prev) => !prev)}
        color="default"
        />
        
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'medium',
              fontSize: '1rem',
              bgcolor: grey[800],
              px: 2,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            {user?.email}
          </Typography>
          <Button variant="outlined" color="inherit" size="small" sx={{ textTransform: 'none' }} onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Sidebar Filters */}
        <Box sx={{ width: 180, pr: 1, mr: 10 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Filter</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {statusOptions.map(status => (
              <Chip
                key={status}
                label={status}
                variant={filterStatus === status ? 'filled' : 'outlined'}
                color={filterStatus === status ? 'primary' : 'default'}
                onClick={() => toggleStatus(status)}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>Sort by</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
            {sortOptions.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                variant={sortOption === option.value ? 'filled' : 'outlined'}
                color={sortOption === option.value ? 'secondary' : 'default'}
                onClick={() => toggleSort(option.value)}
              />
            ))}
          </Box>

          <Chip
            label={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            variant="outlined"
            onClick={toggleSortOrder}
          />
        </Box>

        {/* Main Section */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Search */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        {!showSearch ? (
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => setShowSearch(true)}
            sx={{ textTransform: 'none' }}
          >
            Search a task
          </Button>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: isDarkMode ? grey[800] : '#f5f5f5', // Dark mode'da daha koyu arka plan
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: 1,
              flexGrow: 1,
              maxWidth: 400,
            }}
          >
      <SearchIcon color="action" />
      <TextField
        variant="standard"
        placeholder="Search by Title or Description"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          disableUnderline: true,
          style: {
            color: isDarkMode ? '#fff' : '#000', // Dark mode'da yazı rengi beyaz, light mode'da siyah
          },
        }}
      />
      <Button
        size="small"
        onClick={() => {
          setShowSearch(false);
          setSearchQuery('');
        }}
        sx={{ textTransform: 'none' }}
      >
        Cancel
      </Button>
    </Box>
  )}

  <Button variant="contained" onClick={() => setShowForm(true)}>
    Create Task
  </Button>
</Box>


          {/* Todo List */}
          {todos.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ mt: 4, mb: 2 }}>
              No tasks found. Start by creating one!
            </Typography>
          ) : (
            <TodoList todos={todos} setTodos={setTodos} />
          )}

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
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
              onClick={() => setCurrentPage(prev => prev + 1)}
              sx={{ mx: 1 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Create Task Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TodoForm
            onClose={() => setShowForm(false)}
            onAdd={(newTodo: any) => {
              setTodos((prev) => [...prev, newTodo]);
              setShowForm(false);
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
