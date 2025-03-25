import { db } from "@/db/db";
import { users } from "@/db/schema/users";

// export const getUser = async (id: number) => {
//   const user = await db.select().from(users).where(users.id.eq(id));
//   return user;
// };

export const getUsers = async () => {
  return await db.select().from(users);
};
