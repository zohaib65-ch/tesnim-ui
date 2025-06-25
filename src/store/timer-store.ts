import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const API_URL = " http://localhost:8000/api/v1";

/**
 * Timer settings configuration
 */
interface TimerSettings {
  focusTime: number; // Focus duration in seconds
  shortBreakTime: number; // Short break duration in seconds
  longBreakTime: number; // Long break duration in seconds
  longBreakInterval: number; // Number of focus sessions before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
}

/**
 * Timer statistics data
 */
interface TimerStats {
  focusTimeToday: number;
  focusTimeYesterday: number;
  focusTimeThisWeek: number;
  completedSessionsToday: number;
  completedSessionsThisWeek: number;
  streak: number;
}

/**
 * Session data for the current pomodoro/break
 */
interface CurrentSession {
  isActive: boolean;
  isBreak: boolean;
  startTime: Date | null;
  timeRemaining: number;
  sessionCount: number;
}

/**
 * Session data to save to the backend
 */
interface SessionData {
  duration: number;
  timestamp: string;
  completed: boolean;
}

/**
 * Timer state and actions
 */
interface TimerState {
  // State
  timerSettings: TimerSettings;
  timerStats: TimerStats;
  currentSession: CurrentSession;
  loading: boolean;
  error: string | null;

  // Timer controls
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;

  // Settings and data management
  updateTimerSettings: (newSettings: Partial<TimerSettings>) => Promise<void>;
  fetchTimerSettings: () => Promise<void>;
  saveSession: (sessionData: SessionData) => Promise<void>;
  fetchTimerStats: () => Promise<TimerStats>;
}

/**
 * Timer store with persistence
 */
export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timerSettings: {
        focusTime: 25 * 60, // 25 minutes in seconds
        shortBreakTime: 5 * 60, // 5 minutes in seconds
        longBreakTime: 15 * 60, // 15 minutes in seconds
        longBreakInterval: 4, // After how many focus sessions to take a long break
        autoStartBreaks: false,
        autoStartPomodoros: false,
        soundEnabled: true,
        soundVolume: 0.7,
      },
      timerStats: {
        focusTimeToday: 0,
        focusTimeYesterday: 0,
        focusTimeThisWeek: 0,
        completedSessionsToday: 0,
        completedSessionsThisWeek: 0,
        streak: 0,
      },
      currentSession: {
        isActive: false,
        isBreak: false,
        startTime: null,
        timeRemaining: 25 * 60, // Default to focusTime
        sessionCount: 0,
      },
      loading: false,
      error: null,

      // Start timer session
      startTimer: () => {
        const { currentSession } = get();
        const startTime = currentSession.startTime || new Date();

        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: true,
            startTime: startTime,
          },
        }));
      },

      // Pause timer session
      pauseTimer: () => {
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: false,
          },
        }));
      },

      // Reset timer session
      resetTimer: () => {
        const { timerSettings, currentSession } = get();
        const timeRemaining = currentSession.isBreak
          ? currentSession.sessionCount % timerSettings.longBreakInterval === 0
            ? timerSettings.longBreakTime
            : timerSettings.shortBreakTime
          : timerSettings.focusTime;

        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: false,
            startTime: null,
            timeRemaining,
          },
        }));
      },

      // Complete current focus/break session
      completeSession: () => {
        const { currentSession, timerSettings } = get();
        const wasBreak = currentSession.isBreak;
        const sessionCount = wasBreak ? currentSession.sessionCount : currentSession.sessionCount + 1;
        const isLongBreakNext = !wasBreak && sessionCount % timerSettings.longBreakInterval === 0;

        if (!wasBreak) {
          // Save completed focus session
          get().saveSession({
            duration: timerSettings.focusTime,
            timestamp: new Date().toISOString(),
            completed: true,
          });
        }

        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: timerSettings.autoStartBreaks || timerSettings.autoStartPomodoros,
            isBreak: !wasBreak,
            sessionCount,
            timeRemaining: wasBreak ? timerSettings.focusTime : isLongBreakNext ? timerSettings.longBreakTime : timerSettings.shortBreakTime,
            startTime: null,
          },
        }));
      },

      // Update timer settings
      updateTimerSettings: async (newSettings: Partial<TimerSettings>) => {
        set((state) => ({
          timerSettings: {
            ...state.timerSettings,
            ...newSettings,
          },
        }));

        // If this is a logged-in user, save settings to backend
        try {
          await axios.put(`${API_URL}/users/timer-settings`, {
            settings: { ...get().timerSettings, ...newSettings },
          });
          return Promise.resolve();
        } catch (error) {
          console.error("Failed to save timer settings:", error);
          return Promise.resolve();
        }
      },

      // Fetch timer settings from server for logged-in users
      fetchTimerSettings: async () => {
        try {
          const response = await axios.get<TimerSettings>(`${API_URL}/users/timer-settings`);
          if (response.data) {
            set({ timerSettings: response.data });
          }
          return Promise.resolve();
        } catch (error) {
          console.error("Failed to fetch timer settings:", error);
          return Promise.resolve();
        }
      },

      // Save completed pomodoro session
      saveSession: async (sessionData: SessionData) => {
        try {
          await axios.post(`${API_URL}/timer/sessions`, sessionData);
          get().fetchTimerStats();
          return Promise.resolve();
        } catch (error) {
          console.error("Failed to save timer session:", error);
          return Promise.resolve();
        }
      },

      // Fetch timer statistics
      fetchTimerStats: async () => {
        try {
          const response = await axios.get<TimerStats>(`${API_URL}/timer/stats`);
          set({ timerStats: response.data });
          return response.data;
        } catch (error) {
          console.error("Failed to fetch timer stats:", error);
          return get().timerStats;
        }
      },
    }),
    {
      name: "tesnim-timer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        timerSettings: state.timerSettings,
        currentSession: {
          isBreak: state.currentSession.isBreak,
          sessionCount: state.currentSession.sessionCount,
        },
      }),
    }
  )
);
