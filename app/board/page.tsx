"use client"

import KanbanBoard from "@/components/board/kanban-board"
// import { Metadata } from "next"

// const metadata: Metadata = {
//   title: "Kanban Board | TaskQuest",
//   description: "Manage your tasks with our interactive Kanban board",
// }
export default function BoardPage() {
  return (
    <main className="">
      <KanbanBoard />
    </main>
  )
}