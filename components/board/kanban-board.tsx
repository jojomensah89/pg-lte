"use client"

import { useState } from "react"
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import ColumnComponent from "./column"
import TaskCard from "./task-card"
import AddColumnDialog from "@/components/add-column-dialog"
import AddTaskDialog from "@/components/add-task-dialog"
import EditTaskDialog from "@/components/edit-task-dialog"
import { toast } from "sonner"
import { useKanbanStore, type Task } from "@/lib/store"

export default function KanbanBoard() {
  // Local UI state
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  // Zustand store state and actions
  const {
    data,
    activeId,
    activeTask,
    setActiveId,
    setActiveTask,
    reorderColumns,
    reorderTasksInColumn,
    moveTaskBetweenColumns,
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    editTask,
    resetBoard,
  } = useKanbanStore()

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Handle drag start
  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)

    // If dragging a task, set the active task
    if (active.id.toString().startsWith("task-")) {
      setActiveTask(data.tasks[active.id])
    }
  }

  // Handle drag end
  const handleDragEnd = (event: any
  ) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveTask(null)
      return
    }

    // Handle column reordering
    if (active.id.toString().startsWith("column-") && over.id.toString().startsWith("column-")) {
      if (active.id !== over.id) {
        const oldIndex = data.columnOrder.indexOf(active.id)
        const newIndex = data.columnOrder.indexOf(over.id)
        reorderColumns(oldIndex, newIndex)
      }
    }

    // Handle task reordering within the same column
    else if (active.id.toString().startsWith("task-") && over.id.toString().startsWith("task-")) {
      // Find which column contains the active task
      let sourceColumnId = null
      for (const columnId in data.columns) {
        if (data.columns[columnId].taskIds.includes(active.id)) {
          sourceColumnId = columnId
          break
        }
      }

      // Find which column contains the target task
      let targetColumnId = null
      for (const columnId in data.columns) {
        if (data.columns[columnId].taskIds.includes(over.id)) {
          targetColumnId = columnId
          break
        }
      }

      if (sourceColumnId && targetColumnId) {
        // If same column, reorder tasks
        if (sourceColumnId === targetColumnId) {
          const column = data.columns[sourceColumnId]
          const oldIndex = column.taskIds.indexOf(active.id)
          const newIndex = column.taskIds.indexOf(over.id)

          if (oldIndex !== newIndex) {
            reorderTasksInColumn(sourceColumnId, oldIndex, newIndex)
          }
        }
        // If different columns, move task between columns
        else {
          const sourceColumn = data.columns[sourceColumnId]
          const targetColumn = data.columns[targetColumnId]
          const sourceIndex = sourceColumn.taskIds.indexOf(active.id)
          const targetIndex = targetColumn.taskIds.indexOf(over.id)

          moveTaskBetweenColumns(sourceColumnId, targetColumnId, sourceIndex, targetIndex)
        }
      }
    }

    // Handle task moving to a column
    else if (active.id.toString().startsWith("task-") && over.id.toString().startsWith("column-")) {
      // Find which column contains the active task
      let sourceColumnId = null
      for (const columnId in data.columns) {
        if (data.columns[columnId].taskIds.includes(active.id)) {
          sourceColumnId = columnId
          break
        }
      }

      const targetColumnId = over.id

      if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
        const sourceColumn = data.columns[sourceColumnId]
        const sourceIndex = sourceColumn.taskIds.indexOf(active.id)

        moveTaskBetweenColumns(sourceColumnId, targetColumnId, sourceIndex)
      }
    }

    setActiveId(null)
    setActiveTask(null)
  }

  // Handle adding a column with toast notification
  const handleAddColumn = (title: string) => {
    addColumn(title)
    toast.success("Column added", {
      description: `Column "${title}" has been added`,
    })
  }

  // Handle deleting a column with toast notification
  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(columnId)
    toast.success("Column deleted", {
      description: `Column and all its tasks have been deleted`,
    })
  }

  // Handle adding a task with toast notification
  const handleAddTask = (columnId: string, task: Omit<Task, "id" | "createdAt">) => {
    addTask(columnId, task)
    toast.success("Task added", {
      description: `Task "${task.title}" has been added`,
    })
  }

  // Handle deleting a task with toast notification
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    toast.success("Task deleted", {
      description: `Task has been deleted`,
    })
  }

  // Handle editing a task with toast notification
  const handleEditTask = (taskId: string, updatedTask: Omit<Task, "id" | "createdAt">) => {
    editTask(taskId, updatedTask)
    toast.success("Task updated", {
      description: `Task "${updatedTask.title}" has been updated`,
    })
  }

  // Handle resetting the board with toast notification
  const handleResetBoard = () => {
    resetBoard()
    toast.success("Board reset", {
      description: "The board has been reset to its initial state",
    })
  }

  // Open add task dialog
  const openAddTaskDialog = (columnId: string) => {
    setCurrentColumnId(columnId)
    setIsAddTaskOpen(true)
  }

  // Open edit task dialog
  const openEditTaskDialog = (task: Task) => {
    setCurrentTask(task)
    setIsEditTaskOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddColumnOpen(true)}
            className="flex items-center gap-1 shadow-primary"
          >
            <Plus className="h-4 w-4" /> Add Column
          </Button>
          <Button variant="outline" onClick={handleResetBoard} className="flex items-center gap-1 shadow-primary">
            <RefreshCw className="h-4 w-4" /> Reset Board
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-4 min-h-[calc(100vh-12rem)] w-full overflow-x-auto">
          <SortableContext items={data.columnOrder} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-4 w-full">
              {data.columnOrder.map((columnId) => {
                const column = data.columns[columnId]
                const tasks = column.taskIds.map((taskId) => data.tasks[taskId])

                return (
                  <div key={column.id} className="flex-1 min-w-[20rem]">
                    <ColumnComponent
                      column={column}
                      tasks={tasks}
                      onAddTask={() => openAddTaskDialog(column.id)}
                      onDeleteColumn={() => handleDeleteColumn(column.id)}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={openEditTaskDialog}
                    />
                  </div>
                )
              })}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId && activeId.toString().startsWith("task-") && activeTask && (
            <TaskCard task={activeTask} onDelete={() => {}} onEdit={() => {}} isDragging={true} />
          )}
        </DragOverlay>
      </DndContext>

      <AddColumnDialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen} onAddColumn={handleAddColumn} />

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={(task) => {
          if (currentColumnId) {
            handleAddTask(currentColumnId, task)
          }
        }}
      />

      <EditTaskDialog
        open={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        task={currentTask}
        onEditTask={(updatedTask) => {
          if (currentTask) {
            handleEditTask(currentTask.id, updatedTask)
          }
        }}
      />
    </div>
  )
}

