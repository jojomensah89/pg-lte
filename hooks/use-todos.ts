import { useLiveQuery, useLiveIncrementalQuery, usePGlite } from "@electric-sql/pglite-react";

// Custom hook to get all todos using useLiveQuery
export function useGetTodos() {
  return useLiveQuery(`
    SELECT * FROM todo
    ORDER BY id
  `);
}

// Custom hook to get all todos with incremental updates
export function useGetTodosIncremental() {
  return useLiveIncrementalQuery(`
    SELECT * FROM todo
    ORDER BY id
  `, null, 'id');
}

// Custom hook to get a todo by ID
export function useGetTodoById(id: number) {
  return useLiveQuery(`
    SELECT * FROM todo WHERE id = $1
  `, [id]);
}

// Custom hook to get todos by completion status
export function useGetTodosByStatus(done: boolean) {
  return useLiveQuery(`
    SELECT * FROM todo WHERE done = $1
    ORDER BY id
  `, [done]);
}

// Using SQL template literals for dynamic queries
export function useSearchTodos(searchTerm: string) {
  return useLiveQuery.sql`
    SELECT * FROM todo 
    WHERE task ILIKE ${'%' + searchTerm + '%'}
    ORDER BY id
  `;
}

// // Custom hook for creating todos
// export function useCreateTodo() {
//   const db = usePGlite();
  
//   return async (task: string, done: boolean = false) => {
//     await db.exec(`
//       INSERT INTO todo (task, done) VALUES ($1, $2)
//     `, { params: [task, done] });
//   };
// }

// // Custom hook for deleting todos
// export function useDeleteTodo() {
//   const db = usePGlite();
  
//   return async (id: number) => {
//     await db.exec(`
//       DELETE FROM todo WHERE id = $1
//     `, [id]);
//   };
// }

// // Custom hook for updating todos
// export function useUpdateTodo() {
//   const db = usePGlite();
  
//   return async (id: number, task: string, done: boolean) => {
//     await db.exec(`
//       UPDATE todo SET task = $1, done = $2 WHERE id = $3
//     `, [task, done, id]);
//   };
// }

// // Custom hook for toggling todo status
// export function useToggleTodoStatus() {
//   const db = usePGlite();
  
//   return async (id: number) => {
//     await db.exec(`
//       UPDATE todo SET done = NOT done WHERE id = $1
//     `, [id]);
//   };
// }

// Convenience hook that provides all todo operations
export function useTodos() {
  const todos = useGetTodosIncremental(); // Using incremental for better performance
  const getTodoById = useGetTodoById;
  const getTodosByStatus = useGetTodosByStatus;
  const searchTodos = useSearchTodos;
  // const createTodo = useCreateTodo();
  // const deleteTodo = useDeleteTodo();
  // const updateTodo = useUpdateTodo();
  // const toggleTodoStatus = useToggleTodoStatus();

  return {
    todos,
    getTodoById,
    getTodosByStatus,
    searchTodos,
    // createTodo,
    // deleteTodo,
    // updateTodo,
    // toggleTodoStatus
  };
}