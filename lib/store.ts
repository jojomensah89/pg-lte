import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: "low" | "medium" | "high" | null;
  createdAt: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type KanbanData = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
};

const initialData: KanbanData = {
  tasks: {},
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: [],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

type KanbanStore = {
  data: KanbanData;
  activeId: string | null;
  activeTask: Task | null;

  // Actions
  setActiveId: (id: string | null) => void;
  setActiveTask: (task: Task | null) => void;
  reorderColumns: (oldIndex: number, newIndex: number) => void;
  reorderTasksInColumn: (
    columnId: string,
    oldIndex: number,
    newIndex: number
  ) => void;
  moveTaskBetweenColumns: (
    sourceColumnId: string,
    targetColumnId: string,
    sourceIndex: number,
    targetIndex?: number
  ) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  addTask: (columnId: string, task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (taskId: string) => void;
  editTask: (
    taskId: string,
    updatedTask: Omit<Task, "id" | "createdAt">
  ) => void;
  resetBoard: () => void;
};

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set) => ({
      data: initialData,
      activeId: null,
      activeTask: null,

      setActiveId: (id) => set({ activeId: id }),
      setActiveTask: (task) => set({ activeTask: task }),

      reorderColumns: (oldIndex, newIndex) =>
        set((state) => {
          const newColumnOrder = [...state.data.columnOrder];
          const [removed] = newColumnOrder.splice(oldIndex, 1);
          newColumnOrder.splice(newIndex, 0, removed);

          return {
            data: {
              ...state.data,
              columnOrder: newColumnOrder,
            },
          };
        }),

      reorderTasksInColumn: (columnId, oldIndex, newIndex) =>
        set((state) => {
          const column = state.data.columns[columnId];
          const newTaskIds = [...column.taskIds];
          const [removed] = newTaskIds.splice(oldIndex, 1);
          newTaskIds.splice(newIndex, 0, removed);

          return {
            data: {
              ...state.data,
              columns: {
                ...state.data.columns,
                [columnId]: {
                  ...column,
                  taskIds: newTaskIds,
                },
              },
            },
          };
        }),

      moveTaskBetweenColumns: (
        sourceColumnId,
        targetColumnId,
        sourceIndex,
        targetIndex
      ) =>
        set((state) => {
          const sourceColumn = state.data.columns[sourceColumnId];
          const targetColumn = state.data.columns[targetColumnId];
          const sourceTaskIds = [...sourceColumn.taskIds];
          const targetTaskIds = [...targetColumn.taskIds];

          const [removed] = sourceTaskIds.splice(sourceIndex, 1);

          if (targetIndex !== undefined) {
            targetTaskIds.splice(targetIndex, 0, removed);
          } else {
            targetTaskIds.push(removed);
          }

          return {
            data: {
              ...state.data,
              columns: {
                ...state.data.columns,
                [sourceColumnId]: {
                  ...sourceColumn,
                  taskIds: sourceTaskIds,
                },
                [targetColumnId]: {
                  ...targetColumn,
                  taskIds: targetTaskIds,
                },
              },
            },
          };
        }),

      addColumn: (title) =>
        set((state) => {
          const newColumnId = `column-${Date.now()}`;

          return {
            data: {
              ...state.data,
              columns: {
                ...state.data.columns,
                [newColumnId]: {
                  id: newColumnId,
                  title,
                  taskIds: [],
                },
              },
              columnOrder: [...state.data.columnOrder, newColumnId],
            },
          };
        }),

      deleteColumn: (columnId) =>
        set((state) => {
          const taskIds = state.data.columns[columnId].taskIds;

          // Create new columns object without the deleted column
          const newColumns = { ...state.data.columns };
          delete newColumns[columnId];

          // Create new tasks object without the tasks from the deleted column
          const newTasks = { ...state.data.tasks };
          taskIds.forEach((taskId) => {
            delete newTasks[taskId];
          });

          // Create new columnOrder without the deleted column
          const newColumnOrder = state.data.columnOrder.filter(
            (id) => id !== columnId
          );

          return {
            data: {
              tasks: newTasks,
              columns: newColumns,
              columnOrder: newColumnOrder,
            },
          };
        }),

      addTask: (columnId, task) =>
        set((state) => {
          const newTaskId = `task-${Date.now()}`;
          const newTask: Task = {
            id: newTaskId,
            ...task,
            createdAt: new Date().toISOString(),
          };

          return {
            data: {
              ...state.data,
              tasks: {
                ...state.data.tasks,
                [newTaskId]: newTask,
              },
              columns: {
                ...state.data.columns,
                [columnId]: {
                  ...state.data.columns[columnId],
                  taskIds: [...state.data.columns[columnId].taskIds, newTaskId],
                },
              },
            },
          };
        }),

      deleteTask: (taskId) =>
        set((state) => {
          // Find which column contains the task
          let columnId = null;
          for (const colId in state.data.columns) {
            if (state.data.columns[colId].taskIds.includes(taskId)) {
              columnId = colId;
              break;
            }
          }

          if (!columnId) return state;

          // Remove task from column
          const column = state.data.columns[columnId];
          const newTaskIds = column.taskIds.filter((id) => id !== taskId);

          // Remove task from tasks
          const newTasks = { ...state.data.tasks };
          delete newTasks[taskId];

          return {
            data: {
              ...state.data,
              tasks: newTasks,
              columns: {
                ...state.data.columns,
                [columnId]: {
                  ...column,
                  taskIds: newTaskIds,
                },
              },
            },
          };
        }),

      editTask: (taskId, updatedTask) =>
        set((state) => {
          const task = state.data.tasks[taskId];

          return {
            data: {
              ...state.data,
              tasks: {
                ...state.data.tasks,
                [taskId]: {
                  ...task,
                  ...updatedTask,
                },
              },
            },
          };
        }),

      resetBoard: () => set({ data: initialData }),
    }),
    {
      name: "kanban-storage",
    }
  )
);
