import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Priority = {
  id: number;
  text: string;
};

export function DailyPriorities() {
  const [priorities, setPriorities] = useState<Priority[]>([
    { id: 1, text: "Finalize project planning" },
    { id: 2, text: "Prepare for project meeting" },
  ]);
  const [newPriority, setNewPriority] = useState<string>("");

  const addPriority = () => {
    if (newPriority.trim()) {
      setPriorities([...priorities, { id: priorities.length + 1, text: newPriority }]);
      setNewPriority("");
    }
  };

  return (
    <Card className="w-full border border-gradient-to-r from-blue-500 to-purple-500 p-2">
      <CardHeader className="p-1">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">✨</span>
          <CardTitle className="text-md">Daily Priorities</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <ul className="space-y-2">
          {priorities.map((priority) => (
            <li key={priority.id} className="flex items-center space-x-2 h-8  p-2 rounded bg-muted">
              <span className="w-6 h-3 flex items-center justify-center bg-muted rounded-full">{priority.id}</span>
              <span>{priority.text}</span>
            </li>
          ))}
          <li className="flex items-center h-10  space-x-2 p-2 rounded bg-muted">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPriority()}
              className="flex-1 bg-transparent border-none focus:outline-none text-foreground"
              placeholder="New priority..."
              autoFocus
            />
            <Button size="sm" onClick={addPriority} className="whitespace-nowrap h-7 ">
              Add
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
