import { db } from "@/db/db";
import { posts } from "@/db/schema/posts";

// export const getUser = async (id: number) => {
//   const user = await db.select().from(users).where(users.id.eq(id));
//   return user;
// };

export const getPosts = async () => {
  return await db.select().from(posts);
};
