import React, { useState, useEffect, useRef } from 'react';
import './TodoApp.css';

// Main TodoApp Component
const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error("Error parsing todos from localStorage", error);
        setTodos([]);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to localStorage", error);
      }
    }
  }, [todos]);

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString(),
      className: 'add-animation' // New animation class
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInputValue('');
    inputRef.current.focus();
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    // First, add delete animation
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, className: 'delete-animation' } : todo
    );
    
    setTodos(updatedTodos);

    // Actually remove the todo after animation completes
    setTimeout(() => {
      const finalTodos = todos.filter(todo => todo.id !== id);
      setTodos(finalTodos);
      
      // Update localStorage
      localStorage.setItem('todos', JSON.stringify(finalTodos));
    }, 600); // Match the CSS animation duration
  };

  // Delete all todos
  const clearAllTodos = () => {
    // Add a dramatic clear animation
    setTodos(todos.map(todo => ({ ...todo, className: 'delete-animation' })));

    // Actually clear todos after animation
    setTimeout(() => {
      setTodos([]);
      localStorage.removeItem('todos');
    }, 600);
  };

  return (
    <div className="todo-container">
      <h1>My Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.length > 0 && (
        <button
          onClick={clearAllTodos}
          className="clear-all-btn"
        >
          Clear All Todos
        </button>
      )}

      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div
      className={`todo-item 
        ${todo.completed ? 'completed' : ''} 
        ${todo.className || ''}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <span className="todo-date">{todo.createdAt}</span>
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-btn"
      >
        ✕
      </button>
    </div>
  );
};

export default TodoApp;