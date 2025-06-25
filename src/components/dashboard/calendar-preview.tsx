"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { CustomButton } from "@/components/shared/button";
import { CustomCard } from "@/components/shared/card";
import { CardContent } from "../ui/card";

export function CalendarPreview() {
  const { events, loading } = useCalendarStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayEvents, setDisplayEvents] = useState<any[]>([]);

  const weekday = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const date = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  useEffect(() => {
    if (!events || !Array.isArray(events)) {
      setDisplayEvents([]);
      return;
    }

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.getFullYear() === selectedDate.getFullYear() && eventDate.getMonth() === selectedDate.getMonth() && eventDate.getDate() === selectedDate.getDate();
    });

    const sorted = [...filtered].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    setDisplayEvents(sorted);
  }, [events, selectedDate]);

  const formatEventTime = (startTime: any, endTime: any) => {
    if (!startTime) return "";

    const start = new Date(startTime);
    const startFormatted = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!endTime) return startFormatted;

    const end = new Date(endTime);
    const endFormatted = end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const getEventTypeColor = (type: any) => {
    switch (type?.toLowerCase()) {
      case "class":
        return "var(--primary)";
      case "meeting":
        return "var(--accent)";
      case "study":
        return "var(--secondary)";
      case "personal":
        return "var(--orange)";
      case "assignment":
        return "var(--red)";
      case "exam":
        return "var(--destructive)";
      default:
        return "var(--muted)";
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  return (
    <CustomCard showHeader={false} contentClassName="p-0" className="overflow-hidden">
      <div className="px-1 sm:px-2 pt-4 sm:pt-2 pb-2 sm:pb-2 flex items-center justify-between">
        <CustomButton variant="ghost" size="icon" icon={<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />} onClick={goToPreviousDay} aria-label="Previous day" />

        <div className="text-center my-1">
          <div className="text-md sm:text-md font-semibold">{isToday(selectedDate) ? "Today" : weekday}</div>
          <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
            {date}
            {!isToday(selectedDate) && <CustomButton variant="link" size="sm" label="Go to today" className="p-0 h-auto text-xs" onClick={goToToday} />}
          </div>
        </div>

        <CustomButton variant="ghost" size="icon" icon={<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />} onClick={goToNextDay} aria-label="Next day" />
      </div>

      <div className="p-2">
        {loading ? (
          <div className="flex justify-center items-center py-6 sm:py-8">
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary mr-2" />
            <span className="text-sm sm:text-base">Loading events...</span>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="py-1  text-center text-muted-foreground text-sm sm:text-base">
            <p>No events scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayEvents.map((event: any) => (
              <div key={event.id} className="flex gap-2 sm:gap-3 items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: getEventTypeColor(event.type) }} />
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">{event.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{formatEventTime(event.startTime, event.endTime)}</p>
                  {event.location && <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>}
                </div>
                <CustomButton variant="ghost" size="sm" label="Details" className="text-xs sm:text-sm" onClick={() => alert(`Details for ${event.title}`)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <CardContent className="grid gap-4 p-2">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">Due: May 25, 2025</p>
            <p className="text-sm font-medium leading-none">Website Redesign</p>
            <p className="text-sm text-muted-foreground">Revamp the company website </p>
          </div>
        </div>
      </CardContent>
    </CustomCard>
  );
}
