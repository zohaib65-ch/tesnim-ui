"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { Progress } from "@radix-ui/react-progress"
import { Button } from "../ui/button"

export function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const totalTime = 25 * 60 // Total time for progress calculation

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, time])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const progress = ((totalTime - time) / totalTime) * 100

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-[#2f286e] text-white w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Focus Mode</h2>
          <p className="text-xs sm:text-sm opacity-70">Lancer Session</p>
        </div>
        <Select defaultValue="light">
          <SelectTrigger className="w-full sm:w-[120px] bg-gray-800 text-white border-none text-sm">
            <SelectValue placeholder="Light Focus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light Focus</SelectItem>
            <SelectItem value="deep">Deep Focus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-4xl sm:text-5xl font-bold text-center mb-4">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      <Progress value={progress} className="mb-4" />
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="text-white border-white/30">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
          </svg>
        </Button>
        <Button onClick={() => setIsRunning(!isRunning)} className="bg-transparent hover:bg-blue-600">
          {isRunning ? "Pause" : "Start"}
        </Button>
      </div>
    </div>
  )
}
