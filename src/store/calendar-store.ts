import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const API_URL = " http://localhost:8000/api/v1";

/**
 * Event data structure
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

/**
 * Parameters for fetching events
 */
interface FetchEventsParams {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Calendar state and actions
 */
interface CalendarState {
  // State
  events: Event[];
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  view: "day" | "week" | "month";

  // Actions
  fetchEvents: (params?: FetchEventsParams) => Promise<Event[]>;
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean }>;
  syncWithGoogleCalendar: () => Promise<Event[]>;

  // View management
  setSelectedDate: (date: Date) => void;
  setView: (view: "day" | "week" | "month") => void;

  // Filters
  getEventsForDate: (date: Date) => Event[];
  getEventsForCurrentWeek: () => Event[];
  getEventsForCurrentMonth: () => Event[];
}

/**
 * Calendar store with persistence
 */
export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      loading: false,
      error: null,
      selectedDate: new Date(),
      view: "day", // day, week, month

      // Fetch all events
      fetchEvents: async (params: FetchEventsParams = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();

          if (params.startDate) {
            queryParams.append("startDate", params.startDate.toISOString());
          }

          if (params.endDate) {
            queryParams.append("endDate", params.endDate.toISOString());
          }

          const url = `${API_URL}/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
          const response = await axios.get<Event[]>(url);

          set({
            events: response.data,
            loading: false,
          });
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch events";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Create a new event
      createEvent: async (eventData: Partial<Event>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post<Event>(`${API_URL}/events`, eventData);
          set((state) => ({
            events: [...state.events, response.data],
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create event";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Update an existing event
      updateEvent: async (eventId: string, eventData: Partial<Event>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.put<Event>(`${API_URL}/events/${eventId}`, eventData);
          set((state) => ({
            events: state.events.map((event) => (event.id === eventId ? { ...event, ...response.data } : event)),
            loading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update event";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Delete an event
      deleteEvent: async (eventId: string) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${API_URL}/events/${eventId}`);
          set((state) => ({
            events: state.events.filter((event) => event.id !== eventId),
            loading: false,
          }));
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete event";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Try to synchronize with Google Calendar
      syncWithGoogleCalendar: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post<Event[]>(`${API_URL}/events/sync-google`);
          set({
            events: response.data,
            loading: false,
          });
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to sync with Google Calendar";

          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      // Set selected date
      setSelectedDate: (date: Date) => {
        set({ selectedDate: date });
      },

      // Set view mode (day, week, month)
      setView: (view: "day" | "week" | "month") => {
        set({ view });
      },

      // Get events for a specific date
      getEventsForDate: (date: Date) => {
        const { events } = get();
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return events.filter((event) => {
          const eventDate = new Date(event.startTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === targetDate.getTime();
        });
      },

      // Get events for the current week
      getEventsForCurrentWeek: () => {
        const { events, selectedDate } = get();
        const currentDate = new Date(selectedDate);
        const day = currentDate.getDay();

        // Set to the first day of the week (Sunday)
        const firstDay = new Date(currentDate);
        firstDay.setDate(currentDate.getDate() - day);
        firstDay.setHours(0, 0, 0, 0);

        // Set to the last day of the week (Saturday)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const eventDate = new Date(event.startTime);
          return eventDate >= firstDay && eventDate <= lastDay;
        });
      },

      // Get events for the current month
      getEventsForCurrentMonth: () => {
        const { events, selectedDate } = get();
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        firstDay.setHours(0, 0, 0, 0);

        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        lastDay.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const eventDate = new Date(event.startTime);
          return eventDate >= firstDay && eventDate <= lastDay;
        });
      },
    }),
    {
      name: "tesnim-calendar",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields to storage
        events: state.events,
        selectedDate: state.selectedDate,
        view: state.view,
      }),
    }
  )
);
