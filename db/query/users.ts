import { db } from "../db";
import { users } from "../schema/users";

export const getUsers = async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Database query error:", error);
    return []; // Return empty array on error
  }
};
