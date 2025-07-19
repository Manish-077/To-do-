import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo, editTodo, toggleComplete } from './slice/todoSlice';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Box, Fade } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [open, setOpen] = useState(false);
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (input.trim() === '') return;
    dispatch(addTodo({ id: Date.now(), text: input }));
    setInput('');
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo({ id }));
  };

  const handleToggle = (id) => {
    dispatch(toggleComplete({ id }));
  };

  const handleEditOpen = (todo) => {
    setEditId(todo.id);
    setEditInput(todo.text);
    setOpen(true);
  };

  const handleEditSave = () => {
    if (editInput.trim() === '') return;
    dispatch(editTodo({ id: editId, text: editInput }));
    setOpen(false);
    setEditId(null);
    setEditInput('');
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxWidth="sm" sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" align="center" gutterBottom color="primary.dark" sx={{ fontFamily: 'Montserrat', mb: 4 }}>
          <span role="img" aria-label="sparkle">✨</span> To-Do App <span role="img" aria-label="sparkle">✨</span>
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={4}>
          <TextField
            label="Add a task"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            fullWidth
            sx={{ fontFamily: 'Montserrat' }}
          />
          <Button variant="contained" color="primary" onClick={handleAdd} sx={{ minWidth: 90, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>
            Add
          </Button>
        </Box>
        <List>
          {todos.length === 0 && (
            <Typography align="center" color="text.secondary" sx={{ fontFamily: 'Montserrat', mb: 2 }}>No tasks yet. Add one!</Typography>
          )}
          {todos.map((todo) => (
            <Fade in key={todo.id} timeout={500}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(todo)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </>
                }
                sx={{
                  bgcolor: todo.completed ? '#e0e0e0' : '#fff',
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: 1,
                  px: 2,
                  py: 1.5,
                  alignItems: 'center',
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <ListItemText
                  primary={
                    <span style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#888' : '#222',
                      fontWeight: 500,
                      fontSize: 18,
                      fontFamily: 'Montserrat',
                    }}>{todo.text}</span>
                  }
                />
              </ListItem>
            </Fade>
          ))}
        </List>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Task"
              variant="outlined"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              fullWidth
              sx={{ mb: 2, fontFamily: 'Montserrat' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary" sx={{ fontFamily: 'Montserrat' }}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary" sx={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App;
