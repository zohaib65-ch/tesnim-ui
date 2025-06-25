import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const API_URL = " http://localhost:8000/api/v1";

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task filter types
 */
export type TaskFilter = "all" | "today" | "upcoming" | "completed" | "overdue" | "high";

/**
 * Task data structure
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task statistics data
 */
interface TaskStats {
  completedToday: number;
  completedYesterday: number;
  completedThisWeek: number;
}

/**
 * Task API response for fetching tasks
 */
interface TasksResponse {
  tasks: Task[];
  stats?: TaskStats;
}

/**
 * Task state and actions
 */
interface TaskState {
  // State
  tasks: Task[];
  filteredTasks: Task[];
  tasksStats: TaskStats;
  loading: boolean;
  error: string | null;
  filter: TaskFilter;

  // Actions
  fetchTasks: () => Promise<TasksResponse>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<{ success: boolean }>;
  fetchTaskStats: () => Promise<TaskStats>;

  // Filters
  setFilter: (filter: TaskFilter) => void;
  applyFilter: (filter: TaskFilter) => void;
}

/**
 * Task store with persistence
 */
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      filteredTasks: [],
      tasksStats: {
        completedToday: 0,
        completedYesterday: 0,
        completedThisWeek: 0,
      },
      loading: false,
      error: null,
      filter: "all", // all, today, upcoming, completed

      // Fetch all tasks
      fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get<TasksResponse>(`${API_URL}/tasks`);
          set({
            tasks: response.data.tasks,
            tasksStats: response.data.stats || {
              completedToday: 0,
              completedYesterday: 0,
              completedThisWeek: 0,
            },
            loading: false,
          });
          get().applyFilter(get().filter);
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Create a new task
      createTask: async (taskData: Partial<Task>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post<Task>(`${API_URL}/tasks`, taskData);
          set((state) => ({
            tasks: [...state.tasks, response.data],
            loading: false,
          }));
          get().applyFilter(get().filter);
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create task";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Update an existing task
      updateTask: async (taskId: string, taskData: Partial<Task>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.put<Task>(`${API_URL}/tasks/${taskId}`, taskData);
          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...response.data } : task)),
            loading: false,
          }));
          get().applyFilter(get().filter);

          // If task was marked as completed, fetch updated stats
          if (taskData.completed !== undefined) {
            get().fetchTaskStats();
          }

          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update task";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Delete a task
      deleteTask: async (taskId: string) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${API_URL}/tasks/${taskId}`);
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            loading: false,
          }));
          get().applyFilter(get().filter);
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete task";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Fetch task statistics
      fetchTaskStats: async () => {
        try {
          const response = await axios.get<TaskStats>(`${API_URL}/tasks/stats`);
          set({
            tasksStats: response.data,
          });
          return response.data;
        } catch (error) {
          console.error("Failed to fetch task stats:", error);
          return get().tasksStats;
        }
      },

      // Set task filter
      setFilter: (filter: TaskFilter) => {
        set({ filter });
        get().applyFilter(filter);
      },

      // Apply filter to tasks
      applyFilter: (filter: TaskFilter) => {
        const { tasks } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let filtered: Task[];
        switch (filter) {
          case "today":
            filtered = tasks.filter((task) => {
              if (!task.dueDate) return false;
              const dueDate = new Date(task.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              return dueDate.getTime() === today.getTime();
            });
            break;
          case "upcoming":
            filtered = tasks.filter((task) => {
              if (!task.dueDate) return false;
              const dueDate = new Date(task.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              return dueDate.getTime() > today.getTime();
            });
            break;
          case "completed":
            filtered = tasks.filter((task) => task.completed);
            break;
          case "overdue":
            filtered = tasks.filter((task) => {
              if (!task.dueDate || task.completed) return false;
              const dueDate = new Date(task.dueDate);
              return dueDate < new Date();
            });
            break;
          case "high":
            filtered = tasks.filter((task) => task.priority === "high" && !task.completed);
            break;
          default:
            filtered = tasks;
        }

        set({ filteredTasks: filtered });
      },
    }),
    {
      name: "tesnim-tasks",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields to storage
        filter: state.filter,
      }),
    }
  )
);
