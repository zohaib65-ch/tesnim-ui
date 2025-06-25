import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare, ListTodo, Clock, Calendar } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useTimerStore } from "@/store/timer-store";
import { PomodoroPreview } from "./pomodoro-preview";
import MoodCheck from "./mood-check";

export function Stats() {
  const { tasks, tasksStats } = useTaskStore();
  const { events } = useCalendarStore();
  const { timerStats } = useTimerStore();

  const completedTasksToday = tasksStats?.completedToday || 0;
  const completedYesterday = tasksStats?.completedYesterday || 0;
  const completedDiff = completedTasksToday - completedYesterday;
  const inProgressCount = tasks?.filter((task) => !task.completed).length || 0;
  const dueTodayCount =
    tasks?.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate.toDateString() === today.toDateString();
    }).length || 0;

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const focusTimeToday = timerStats?.focusTimeToday || 0;
  const focusTimeYesterday = timerStats?.focusTimeYesterday || 0;
  const focusTimeDiff = focusTimeToday - focusTimeYesterday;

  interface Event {
    startTime: string;
    title?: string;
  }

  const now = new Date();
  const upcomingEvents: Event[] = Array.isArray(events)
    ? events
        .filter((event: Event) => new Date(event.startTime) > now)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
    : [];

  const nextEvent = upcomingEvents[0];
  const nextEventTime = nextEvent
    ? new Date(nextEvent.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          {
            title: "Tasks Completed",
            value: completedTasksToday,
            icon: <CheckSquare className="h-3 w-3 text-muted-foreground" />,
            subtext: `${completedDiff > 0 ? `+${completedDiff}` : completedDiff} from yesterday`,
          },
          {
            title: "In Progress",
            value: inProgressCount,
            icon: <ListTodo className="h-3 w-3 text-muted-foreground" />,
            subtext: `${dueTodayCount} due today`,
          },
          {
            title: "Focus Time",
            value: formatFocusTime(focusTimeToday),
            icon: <Clock className="h-3 w-3 text-muted-foreground" />,
            subtext: focusTimeDiff >= 0 ? `+${formatFocusTime(focusTimeDiff)} from yesterday` : `-${formatFocusTime(Math.abs(focusTimeDiff))} from yesterday`,
          },
          {
            title: "Upcoming Events",
            value: upcomingEvents.length,
            icon: <Calendar className="h-3 w-3 text-muted-foreground" />,
            subtext: nextEvent ? `Next: ${nextEvent.title} (${nextEventTime})` : "No upcoming events",
          },
        ].map((card, index) => (
          <Card key={index} className="p-2">
            <CardHeader className="flex-row items-center justify-between p-1 pb-1">
              <CardTitle className="text-xs font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent className="p-1">
              <div className="text-lg font-bold">{card.value}</div>
              <p className="text-[10px] text-muted-foreground">{card.subtext}</p>
            </CardContent>
          </Card>
        ))}
      <div className="flex items-stretch">
        <PomodoroPreview />
      </div>
      <div className="flex items-stretch">
        <MoodCheck />
      </div>
    </div>
  );
}