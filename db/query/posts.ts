import { db } from "../db";
import { posts } from "../schema/posts";

export const getPosts = async () => {
  try {
    return await db.select().from(posts);
  } catch (error) {
    console.error("Database query error:", error);
    return []; // Return empty array on error
  }
};
