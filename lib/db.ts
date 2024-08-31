// TODO - implement real database queries (with an ORM)

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

// Temporary: In-memory storage for todo items
let todoItems: { [userId: string]: TodoItem[] } = {
  'user123': [
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Finish project', completed: false },
    { id: '3', title: 'Go for a run', completed: true },
  ],
};
export const todoItemDb = {
  getAll: (userId: string): TodoItem[] => {
    return todoItems[userId] || [];
  },
  createOne: (userId: string, title: string) => {
    if (!todoItems[userId]) {
      todoItems[userId] = [];
    }
    const newTodoItem = { id: (todoItems[userId].length + 1).toString(), title: title, completed: false };
    todoItems[userId].push(newTodoItem);
    return newTodoItem;
  },
  
  updateOne: (userId: string, itemId: string, updatedTodoItem: Partial<TodoItem>) => {
    const userTodos = todoItems[userId];
    if (userTodos) {
      const index = userTodos.findIndex(item => item.id === itemId);
      if (index !== -1) {
        todoItems[userId][index] = { ...todoItems[userId][index], ...updatedTodoItem };
        return todoItems[userId][index]
      }
    }
  },
  
  deleteOne: (userId: string, itemId: string) => {
    const userTodos = todoItems[userId];
    if (userTodos) {
      todoItems[userId] = userTodos.filter(item => item.id !== itemId);
    }
  },
};
