import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTimerStore } from "@/store/timer-store";
import { toast } from "sonner";

export function PomodoroPreview() {
  const { startTimer, pauseTimer, resetTimer, saveSession, timerSettings } = useTimerStore((state) => state);

  const [timeLeft, setTimeLeft] = useState<number>(timerSettings?.focusTime || 25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedFocuses, setCompletedFocuses] = useState(0);

  const intervalRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer-end.mp3");

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch((e) => {
                toast.error("Error playing audio:", e);
              });
            }

            toast(isBreak ? "Break finished!" : "Focus session completed!", {
              description: isBreak ? "Time to focus again!" : "Take a well-deserved break!",
              duration: 5000,
            });

            if (!isBreak) {
              saveSession({
                duration: timerSettings?.focusTime || 25 * 60,
                timestamp: new Date().toISOString(),
                completed: true,
              });
              setCompletedFocuses((prev) => prev + 1);
            }

            const nextIsBreak = !isBreak;
            setIsBreak(nextIsBreak);

            let nextDuration = nextIsBreak
              ? (completedFocuses + 1) % 4 === 0
                ? timerSettings?.longBreakTime || 15 * 60
                : timerSettings?.shortBreakTime || 5 * 60
              : timerSettings?.focusTime || 25 * 60;

            setTimeLeft(nextDuration);
            setIsActive(false);
            return 0;
          }

          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isBreak, completedFocuses, timerSettings, saveSession]);

  useEffect(() => {
    if (!isActive) {
      const newTime = isBreak ? (completedFocuses % 4 === 0 ? timerSettings?.longBreakTime || 15 * 60 : timerSettings?.shortBreakTime || 5 * 60) : timerSettings?.focusTime || 25 * 60;
      setTimeLeft(newTime);
    }
  }, [timerSettings, isActive, isBreak, completedFocuses]);

  const toggleTimer = () => {
    setIsActive((prev) => {
      if (!prev) startTimer();
      else pauseTimer();
      return !prev;
    });
  };

  const handleResetTimer = () => {
    setIsActive(false);
    resetTimer();

    const resetTime = isBreak ? (completedFocuses % 4 === 0 ? timerSettings?.longBreakTime || 15 * 60 : timerSettings?.shortBreakTime || 5 * 60) : timerSettings?.focusTime || 25 * 60;

    setTimeLeft(resetTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  return (
    <Card className="p-2 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
        <CardTitle className="text-sm font-medium">Pomodoro Timer</CardTitle>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isBreak ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {isBreak ? "Break" : "Focus"}
        </span>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        <div className="relative flex justify-center items-center mb-4">
          <div className="absolute text-xl font-bold">{formatTime(timeLeft)}</div>
        </div>

        <div className="flex justify-between gap-2">
          <Button size="sm" variant="outline" onClick={toggleTimer}>
            {isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleResetTimer}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
