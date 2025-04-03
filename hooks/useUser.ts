import { useLiveQuery, useLiveIncrementalQuery, usePGlite } from "@electric-sql/pglite-react";

// Define User interface
export interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Define query result types
export interface QueryResult<T> {
  rows: T[];
  totalCount?: number | undefined;
}

// Define return types for hooks
export type UsersResult = QueryResult<User> | undefined;
export type UserResult = User | undefined;

// Custom hook to get all users
export function useGetUsers(): UsersResult {
  return useLiveQuery<User>(`
    SELECT * FROM users
    ORDER BY id
  `);
}

// Custom hook to get all users with incremental updates
export function useGetUsersIncremental(): UsersResult {
  return useLiveIncrementalQuery<User>(`
    SELECT * FROM users
    ORDER BY id
  `, null, 'id');
}

// Custom hook to get a user by ID
export function useGetUserById(id: number): UserResult {
  return useLiveQuery<User>(`
    SELECT * FROM users WHERE id = $1
  `, [id])?.rows?.[0];
}

// Custom hook to get a user by email
export function useGetUserByEmail(email: string): UserResult {
  return useLiveQuery<User>(`
    SELECT * FROM users WHERE email = $1
  `, [email])?.rows?.[0];
}

// Using SQL template literals for searching users
export function useSearchUsers(searchTerm: string): UsersResult {
  return useLiveQuery.sql<User>`
    SELECT * FROM users 
    WHERE name ILIKE ${'%' + searchTerm + '%'} OR email ILIKE ${'%' + searchTerm + '%'}
    ORDER BY id
  `;
}

// Define return types for mutation hooks
export type CreateUserFn = (name: string, email: string, image?: string) => Promise<[] | undefined>;
export type UpdateUserFn = (id: number, name: string, email: string, image?: string) => Promise<void>;
export type DeleteUserFn = (id: number) => Promise<void>;

// Custom hook for creating users
export function useCreateUser(): CreateUserFn {
  const db = usePGlite();
  
  return async (name: string, email: string, image?: string) => {
    const result = await db.query(`
      INSERT INTO users (name, email, image) 
      VALUES ($1, $2, $3)
      RETURNING id
    `, [name, email, image]);
    
    return result.rows[0]
  };
}

// Custom hook for updating users
export function useUpdateUser(): UpdateUserFn {
  const db = usePGlite();
  
  return async (id: number, name: string, email: string, image?: string) => {
    await db.query(`
      UPDATE users 
      SET name = $1, email = $2, image = $3, updated_at = now() 
      WHERE id = $4
    `, [name, email, image, id]);
  };
}

// Custom hook for deleting users
export function useDeleteUser(): DeleteUserFn {
  const db = usePGlite();
  
  return async (id: number) => {
    await db.query(`
      DELETE FROM users WHERE id = $1
    `, [id]);
  };
}

// Define return type for the main hook
export interface UseUsersReturn {
  users: UsersResult;
  getUserById: (id: number) => UserResult;
  getUserByEmail: (email: string) => UserResult;
  searchUsers: (searchTerm: string) => UsersResult;
  createUser: CreateUserFn;
  updateUser: UpdateUserFn;
  deleteUser: DeleteUserFn;
}

// Convenience hook that provides all user operations
export function useUsers(): UseUsersReturn {
  const users = useGetUsersIncremental();
  const getUserById = useGetUserById;
  const getUserByEmail = useGetUserByEmail;
  const searchUsers = useSearchUsers;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  return {
    users,
    getUserById,
    getUserByEmail,
    searchUsers,
    createUser,
    updateUser,
    deleteUser
  };
}