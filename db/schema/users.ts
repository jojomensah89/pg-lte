import { pgTable, integer, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { posts } from "./posts";

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

export const users = pgTable("users", {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  userName: varchar(),
  role: rolesEnum("user"),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
