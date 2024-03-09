import React, { useState, useEffect } from 'react';
import "./App.css";

function Card({ todo, onDelete, onUpdate, onToggleComplete }) {
  const [editable, setEditable] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const handleToggleEditMode = () => {
    setEditable(!editable);
  };

  const handleUpdateClick = () => {
    onUpdate(todo.id, updatedTitle);
    setEditable(false);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id, !todo.completed);
  };

  const handleChange = (e) => {
    setUpdatedTitle(e.target.value);
  };

  return (
    <div className="card">
      {editable ? (
        <input
          type="text"
          value={updatedTitle}
          onChange={handleChange}
        />
      ) : (
        <h2>{todo.title}</h2>
      )}
      <p>User ID: {todo.userId}</p>
      <p>ID: {todo.id}</p>
      <p>Status: {todo.completed ? "Completed" : "Not Completed"}</p>
      <div>
        {editable ? (
          <button onClick={handleUpdateClick}>Güncelle</button>
        ) : (
          <button onClick={handleToggleEditMode}>
            {editable ? "Düzenlemeyi Bitir" : "Düzenle"}
          </button>
        )}
        {editable ? null : (
          <button onClick={handleToggleComplete}>
            {todo.completed ? "Not Complete" : "Complete"}
          </button>
        )}
        <button onClick={() => onDelete(todo.id)}>Sil</button>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleAddTodo = () => {
    if (newTodoTitle.trim() !== "") {
      const newTodo = {
        userId: 1, 
        id: todos.length + 1, 
        title: newTodoTitle,
        completed: false 
      };

      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } else {
      alert("Lütfen bir görev girin.");
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleUpdateTodo = (id, updatedTitle) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, title: updatedTitle } : todo
    );
    setTodos(updatedTodos);
  };

  const handleToggleComplete = (id, completed) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="App">
      <div className="add-todo">
        <input
          type="text"
          placeholder="Yeni görev ekle"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button onClick={handleAddTodo}>Ekle</button>
      </div>
      {todos.map(todo => (
        <Card
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          onToggleComplete={handleToggleComplete}
        />
      ))}
    </div>
  );
}

export default App;
