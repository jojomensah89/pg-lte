import { useLiveQuery, useLiveIncrementalQuery, usePGlite } from "@electric-sql/pglite-react";

// Define Task interface
export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: number | null;
  due_date: string | null;
  duration: string | null;
  created_at: string;
  updated_at: string;
  user_id: number | null;
  priority_id: number | null;
}

// Define query result types
export interface QueryResult<T> {
  rows: T[];
  totalCount?: number | undefined;
}

// Define return types for hooks
export type TasksResult = QueryResult<Task> | undefined;
export type TaskResult = Task | undefined;

// Custom hook to get all tasks
export function useGetTasks(): TasksResult {
  return useLiveQuery<Task>(`
    SELECT * FROM tasks
    ORDER BY id
  `);
}

// Custom hook to get all tasks with incremental updates
export function useGetTasksIncremental(): TasksResult {
  return useLiveIncrementalQuery<Task>(`
    SELECT * FROM tasks
    ORDER BY id
  `, null, 'id');
}

// Custom hook to get a task by ID
export function useGetTaskById(id: number): TaskResult {
  return useLiveQuery<Task>(`
    SELECT * FROM tasks WHERE id = $1
  `, [id])?.rows?.[0];
}

// Custom hook to get tasks by user ID
export function useGetTasksByUserId(userId: number): TasksResult {
  return useLiveQuery<Task>(`
    SELECT * FROM tasks WHERE user_id = $1
    ORDER BY due_date, priority
  `, [userId]);
}

// Custom hook to get tasks by priority
export function useGetTasksByPriority(priority: number): TasksResult {
  return useLiveQuery<Task>(`
    SELECT * FROM tasks WHERE priority = $1
    ORDER BY due_date
  `, [priority]);
}

// Using SQL template literals for searching tasks
export function useSearchTasks(searchTerm: string): TasksResult {
  return useLiveQuery.sql<Task>`
    SELECT * FROM tasks 
    WHERE title ILIKE ${'%' + searchTerm + '%'} OR description ILIKE ${'%' + searchTerm + '%'}
    ORDER BY due_date, priority
  `;
}

// Define return types for mutation hooks
export type CreateTaskFn = (title: string, description?: string, priority?: number, 
                           due_date?: string, duration?: string, user_id?: number, 
                           priority_id?: number) => Promise<number | undefined>;
export type UpdateTaskFn = (id: number, title: string, description?: string, 
                           priority?: number, due_date?: string, duration?: string, 
                           user_id?: number, priority_id?: number) => Promise<void>;
export type DeleteTaskFn = (id: number) => Promise<void>;

// Custom hook for creating tasks
export function useCreateTask(): CreateTaskFn {
  const db = usePGlite();
  
  return async (title: string, description?: string, priority?: number, 
                due_date?: string, duration?: string, user_id?: number, 
                priority_id?: number) => {
    const result = await db.query(`
      INSERT INTO tasks (title, description, priority, due_date, duration, user_id, priority_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [title, description, priority, due_date, duration, user_id, priority_id]);
    
    return result.rows[0]?.id;
  };
}

// Custom hook for updating tasks
export function useUpdateTask(): UpdateTaskFn {
  const db = usePGlite();
  
  return async (id: number, title: string, description?: string, 
                priority?: number, due_date?: string, duration?: string, 
                user_id?: number, priority_id?: number) => {
    await db.query(`
      UPDATE tasks 
      SET title = $1, description = $2, priority = $3, due_date = $4, 
          duration = $5, user_id = $6, priority_id = $7, updated_at = now() 
      WHERE id = $8
    `, [title, description, priority, due_date, duration, user_id, priority_id, id]);
  };
}

// Custom hook for deleting tasks
export function useDeleteTask(): DeleteTaskFn {
  const db = usePGlite();
  
  return async (id: number) => {
    await db.query(`
      DELETE FROM tasks WHERE id = $1
    `, [id]);
  };
}

// Define return type for the main hook
export interface UseTasksReturn {
  tasks: TasksResult;
  getTaskById: (id: number) => TaskResult;
  getTasksByUserId: (userId: number) => TasksResult;
  getTasksByPriority: (priority: number) => TasksResult;
  searchTasks: (searchTerm: string) => TasksResult;
  createTask: CreateTaskFn;
  updateTask: UpdateTaskFn;
  deleteTask: DeleteTaskFn;
}

// Convenience hook that provides all task operations
export function useTasks(): UseTasksReturn {
  const tasks = useGetTasksIncremental();
  const getTaskById = useGetTaskById;
  const getTasksByUserId = useGetTasksByUserId;
  const getTasksByPriority = useGetTasksByPriority;
  const searchTasks = useSearchTasks;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return {
    tasks,
    getTaskById,
    getTasksByUserId,
    getTasksByPriority,
    searchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}