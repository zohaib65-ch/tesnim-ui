import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useState } from "react";
import { toast } from "sonner";

export function TasksOverview() {
  const { tasks, updateTask, loading } = useTaskStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = async (taskId: any, completed: any) => {
    setIsUpdating(true);
    try {
      await updateTask(taskId, { completed });
    } catch (error) {
      toast.error("Error updating task:");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDueDate = (dueDate: any) => {
    if (!dueDate) return "No due date";

    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date < today) {
      return `Overdue: ${date.toLocaleDateString()}`;
    } else {
      return (
        date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }) + `, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      );
    }
  };

  type Priority = "high" | "medium" | "low";

  interface Task {
    completed: boolean;
    dueDate?: string;
    priority: Priority;
  }

  const isOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    const now = new Date();
    return new Date(dueDate) < now;
  };

  const priorityOrder: Record<Priority, number> = {
    high: 1,
    medium: 2,
    low: 3,
  };

  const sortedTasks = [...(tasks || [])].sort((a: Task, b: Task) => {
    // 1. Sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. Sort by overdue status
    const aOverdue = isOverdue(a.dueDate);
    const bOverdue = isOverdue(b.dueDate);
    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1;
    }

    // 3. Sort by priority
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // 4. Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    return a.dueDate ? -1 : b.dueDate ? 1 : 0;
  });

  return (
    <Card>
      <CardHeader className="p-2">
        <CardTitle className="flex items-center justify-between text-md">
          <span>Tasks</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedTasks} of {totalTasks} completed
          </span>
        </CardTitle>
        <CardDescription className="p-4">
          <div className="w-full h-2 bg-muted rounded-full mt-1">
            <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        {loading ? (
          <div className="flex justify-center ">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : tasks?.length === 0 ? (
          <div className="text-center  text-muted-foreground">
            <p>No tasks yet. Add some to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-2 rounded-md ${isUpdating ? "opacity-70" : ""} ${
                  task.completed ? "bg-muted/50" : isOverdue(task.dueDate) ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30" : "hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id, !task.completed)}
                    disabled={isUpdating}
                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  >
                    {task.completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  <div>
                    <span className={`${task.completed ? "line-through text-muted-foreground" : ""} ${task.priority === "high" && !task.completed ? "font-medium" : ""}`}>{task.title}</span>
                    {task.priority === "high" && !task.completed && <span className="ml-2 px-1.5 py-0.5 text-xs rounded-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">High</span>}
                  </div>
                </div>
                <div className={`flex items-center text-xs ${isOverdue(task.dueDate) && !task.completed ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                  {isOverdue(task.dueDate) && !task.completed ? <AlertTriangle className="h-3.5 w-3.5 mr-1" /> : <Clock className="h-3.5 w-3.5 mr-1" />}
                  {formatDueDate(task.dueDate)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
