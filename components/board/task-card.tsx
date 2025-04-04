"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trash2, Edit2, GripVertical } from "lucide-react"
import type { Task } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onEdit: () => void
  isDragging?: boolean
}

export default function TaskCard({ task, onDelete, onEdit, isDragging = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: {
      type: "task",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null
  const createdAtFormatted = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })

  // Priority styles
  const priorityStyles = {
    low: "bg-green-100 text-green-800 hover:bg-green-100",
    medium: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    high: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-card border-border shadow-primary ${isDragging ? "opacity-50" : ""}`}
    >
      <CardContent className="p-2">
        <div className="flex items-start gap-2">
          <div {...attributes} {...listeners} className="mt-0.5 cursor-grab touch-none">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-xs text-card-foreground">{task.title}</h3>
            {task.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</p>}
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground mt-1">
              {formattedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px]">{formattedDate}</span>
                </div>
              )}
              <span className="text-[10px] text-muted-foreground/70">{createdAtFormatted}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {task.priority && (
              <Badge 
                variant="outline" 
                className={`text-[10px] px-1.5 py-0 h-4 font-normal ${priorityStyles[task.priority as keyof typeof priorityStyles] || ""}`}
              >
                {task.priority}
              </Badge>
            )}
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-5 w-5 p-0">
                <Edit2 className="h-3 w-3" />
                <span className="sr-only">Edit task</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-5 w-5 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

