import { useState, useEffect } from "react";
import { Stats } from "@/components/dashboard/stats";
import { useAuthStore } from "@/store/auth-store";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useTimerStore } from "@/store/timer-store";
import { Loader2 } from "lucide-react";
import ProjectCardList from "@/components/dashboard/project-card";
import { toast } from "sonner";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const { fetchEvents } = useCalendarStore();
  const { fetchTimerStats } = useTimerStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchEvents(), fetchTimerStats()]);
      } catch (error) {
        toast.error("Error loading dashboard data:");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id, fetchTasks, fetchEvents, fetchTimerStats]);

  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "there";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}, {name}!
        </h1>
        <p className="text-muted-foreground">Here's an overview of your productivity today.</p>
      </div>
      <Stats />
      <ProjectCardList />
    </div>
  );
}
