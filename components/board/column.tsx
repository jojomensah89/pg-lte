"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"
import TaskList from "./task-list"
import type { Column as ColumnType, Task } from "@/lib/store"

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onAddTask: () => void
  onDeleteColumn: () => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export default function Column({ column, tasks, onAddTask, onDeleteColumn, onDeleteTask, onEditTask }: ColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="w-full min-w-[20rem] h-full flex flex-col bg-card border-border shadow-primary"
    >
      <CardHeader className="p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab touch-none">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-base font-medium text-card-foreground">{column.title}</CardTitle>
            <div className="bg-muted text-muted-foreground text-xs font-medium rounded-full px-2 py-0.5">
              {tasks.length}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onAddTask} className="h-7 w-7">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteColumn}
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete column</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 flex-grow overflow-y-auto">
        <TaskList columnId={column.id} tasks={tasks} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-border rounded-md">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

