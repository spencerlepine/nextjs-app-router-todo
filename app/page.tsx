"use client";

import { useEffect, useState } from "react";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch("/api/users/user123/todos");
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  const { todoItems } = await response.json();
  return todoItems || [];
}

async function addTodo(title: string): Promise<TodoItem> {
  const response = await fetch("/api/users/user123/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error("Failed to add todo");
  }
  return response.json();
}

async function updateTodo(
  id: string,
  updates: Partial<TodoItem>
): Promise<TodoItem> {
  const response = await fetch(`/api/users/user123/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
  return response.json();
}

async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`/api/users/user123/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const fetchedTodos: TodoItem[] = await fetchTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Failed to load todos:", error);
    }
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newTodo = await addTodo(newTodoTitle);
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    try {
      await updateTodo(id, { completed: !completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={handleAddTodo} className="mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter new todo"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Todo
        </button>
      </form>
      {todos.length === 0 ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="w-full max-w-md">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between mb-2"
            >
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
              <div>
                <button
                  onClick={() => handleToggleComplete(todo.id, todo.completed)}
                  className="bg-green-500 text-white p-1 rounded mr-2"
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
