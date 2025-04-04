"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task } from "@/lib/store"
import TaskCard from "./task-card"

interface TaskListProps {
  columnId: string
  tasks: Task[]
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export default function TaskList({ tasks, onDeleteTask, onEditTask }: TaskListProps) {
  return (
    <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} onEdit={() => onEditTask(task)} />
        ))}
      </div>
    </SortableContext>
  )
}

