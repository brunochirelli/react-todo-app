import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  isHidden: boolean;
  handleUpdateTodo: (index: number, text: string) => void;
  handleCompleteChange: (index: number) => void;
  handleDelete: (index: number) => void;
};

function TodoItem({
  id,
  text,
  completed,
  isHidden,
  handleUpdateTodo,
  handleCompleteChange,
  handleDelete,
}: Todo) {
  const [newText, setNewText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    if (completed) return;
    setIsEditing(true);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateTodo(id, newText);
    setIsEditing(false);
  };
  const handleUpdateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };
  const handleComplete = () => {
    handleCompleteChange(id);
    setIsEditing(false);
  };
  const handleDeleteClick = () => {
    handleDelete(id);
  };

  if (isHidden) return null;

  return (
    <form onSubmit={handleSubmit}>
      <li style={{ textDecoration: completed ? "line-through" : "none" }}>
        {isEditing ? (
          <div>
            <input
              type="text"
              defaultValue={newText}
              onChange={handleUpdateText}
            />
            <button type="submit">confirm</button>
          </div>
        ) : (
          <label onClick={handleEditClick}>{text}</label>
        )}
      </li>
      <input
        type="checkbox"
        name="completed"
        checked={completed}
        onChange={handleComplete}
      />
      <button type="button" onClick={handleDeleteClick}>
        Delete
      </button>
    </form>
  );
}

export function TodoApp() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleUpdateTodo = (id: number, text: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>, text: string) => {
    e.preventDefault();
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: prevTodos.length + 1,
        text,
        completed: false,
        isHidden: false,
        handleUpdateTodo,
        handleCompleteChange,
        handleDelete,
      },
    ]);
    setNewTodo("");
  };

  const handleCompleteChange = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleFilterCompleted = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.completed) {
          return { ...todo, isHidden: !todo.isHidden };
        }
        return todo;
      }),
    );
  };

  return (
    <>
      <form onSubmit={(e) => handleAddTodo(e, newTodo)}>
        <input
          type="text"
          placeholder="add todo"
          value={newTodo}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
        <button type="button" onClick={handleFilterCompleted}>
          Filter completed
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={Math.floor(Math.random() * 10000)}
            {...todo}
            handleUpdateTodo={handleUpdateTodo}
            handleCompleteChange={handleCompleteChange}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </>
  );
}
