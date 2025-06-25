"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear())

  // Generate years for dropdown (current year ± 10 years)
  const years = Array.from({ length: 21 }, (_, i) => selectedYear - 10 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  // Handle month/year change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(months.indexOf(month))
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year))
  }

  return (
    <div >
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={new Date(selectedYear, selectedMonth)}
        className={cn("p-3", className)}
        classNames={{
          months: " flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: " justify-center pt-2 relative items-center",
          caption_label: "hidden", // Hide default label for custom dropdown
          nav: "space-x-1  items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity duration-200"
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          table: "w-full border-collapse space-y-1",
          head_row: "",
          head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.9rem]",
          row: " w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            "[&:has([aria-selected])]:bg-blue-100 dark:[&:has([aria-selected])]:bg-blue-900/50",
            "[&:has([aria-selected].day-outside)]:bg-blue-50 dark:[&:has([aria-selected].day-outside)]:bg-blue-900/30",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-colors duration-150"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:bg-blue-600 focus:text-white",
          day_today: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
          day_outside:
            "day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-gray-500 dark:aria-selected:text-gray-400",
          day_disabled: "text-gray-300 dark:text-gray-600 opacity-50",
          day_range_middle:
            "aria-selected:bg-blue-100 dark:aria-selected:bg-blue-900/50 aria-selected:text-gray-900 dark:aria-selected:text-gray-100",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("h-5 w-5", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("h-5 w-5", className)} {...props} />
          ),
          Caption: () => (
            <div className="flex justify-center space-x-2 mb-2">
              <Select onValueChange={handleMonthChange} defaultValue={months[selectedMonth]}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleYearChange} defaultValue={selectedYear.toString()}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ),
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }