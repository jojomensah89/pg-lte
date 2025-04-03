import { PGlite } from "@electric-sql/pglite";
import { LiveNamespace } from "@electric-sql/pglite/live";

export async function runMigrations(db: PGlite & { live: LiveNamespace; }) {
  console.log("Migrating database...");
  
  await db?.exec(`
    -- Create tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id bigint primary key generated always as identity,
      title text not null,
      description text,
      priority int check (priority between 1 and 5),
      due_date date,
      duration interval,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create subtasks table
    CREATE TABLE IF NOT EXISTS subtasks (
      id bigint primary key generated always as identity,
      task_id bigint references tasks (id) on delete cascade,
      title text not null,
      description text,
      priority int check (priority between 1 and 5),
      due_date date,
      duration interval,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create comments table
    CREATE TABLE IF NOT EXISTS comments (
      id bigint primary key generated always as identity,
      task_id bigint references tasks (id) on delete cascade,
      subtask_id bigint references subtasks (id) on delete cascade,
      content text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id bigint primary key generated always as identity,
      name text not null,
      email text not null unique,
      image text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- Add user_id to tasks
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS user_id bigint references users (id) on delete cascade;

    -- Create task_priorities table
    CREATE TABLE IF NOT EXISTS task_priorities (
      id bigint primary key generated always as identity,
      user_id bigint references users (id) on delete cascade,
      name text not null,
      created_at timestamptz default now()
    );

    -- Add priority_id to tasks
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS priority_id bigint references task_priorities (id);
  `);

  console.log("Migrations Done!");
}
