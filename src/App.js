import './App.css';
import { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, editTodo, toggleComplete } from './slice/todoSlice';
import { v4 as uuid } from 'uuid';

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

const TodoItem = memo(function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleEdit = () => setEditing(true);
  const handleEditChange = (e) => setEditText(e.target.value);
  const handleEditBlur = () => {
    setEditing(false);
    if (editText.trim() && editText !== todo.todo) {
      onEdit(todo.id, editText);
    } else {
      setEditText(todo.todo);
    }
  };
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleEditBlur();
    if (e.key === 'Escape') {
      setEditing(false);
      setEditText(todo.todo);
    }
  };

  return (
    <div className={`todo-card${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <input
          className="todo-edit-input"
          value={editText}
          onChange={handleEditChange}
          onBlur={handleEditBlur}
          onKeyDown={handleEditKeyDown}
          autoFocus
        />
      ) : (
        <span className="todo-text" onDoubleClick={handleEdit}>{todo.todo}</span>
      )}
      <button className="edit-btn" onClick={handleEdit} title="Edit">✏️</button>
      <button className="delete-btn" onClick={() => onDelete(todo.id)} title="Delete">&times;</button>
    </div>
  );
});

function App() {
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);

  // Persist todos to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, loading]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach(todo => dispatch(addTodo(todo)));
      } catch {}
    }
    setTimeout(() => setLoading(false), 600); // Simulate loading
  }, [dispatch]);

  const onAddClick = useCallback(() => {
    if (!inputText.trim()) return;
    dispatch(addTodo({
      id: uuid(),
      todo: inputText,
    }));
    setInputText('');
  }, [inputText, dispatch]);

  const onDeleteClick = useCallback((id) => {
    dispatch(deleteTodo(id));
  }, [dispatch]);

  const onToggleComplete = useCallback((id) => {
    dispatch(toggleComplete({ id }));
  }, [dispatch]);

  const onEditTodo = useCallback((id, text) => {
    dispatch(editTodo({ id, text }));
  }, [dispatch]);

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.ACTIVE) return !todo.completed;
    if (filter === FILTERS.COMPLETED) return todo.completed;
    return true;
  });

  return (
    <div className="app-bg">
      <div className="todo-container">
        <header className="todo-header">
          <span className="todo-icon">📝</span>
          <h1>ToDo App</h1>
        </header>
        <div className="todo-input-row">
          <input
            className="todo-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a new todo..."
            onKeyDown={e => e.key === 'Enter' && onAddClick()}
          />
          <button className="add-btn" onClick={onAddClick}>Add</button>
        </div>
        <div className="filter-bar">
          {Object.values(FILTERS).map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="todo-list">
          {loading ? (
            <div className="skeleton-list">
              {[1,2,3].map(i => <div className="skeleton-card" key={i}></div>)}
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✨</span>
              <p>No todos yet. Add your first task!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDeleteClick}
                onToggle={onToggleComplete}
                onEdit={onEditTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
