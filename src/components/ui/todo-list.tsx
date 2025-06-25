"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { toast } from "sonner";
import API from "@/services";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  status?: string;
  priority?: string;
  dueDate?: string;
  tags?: string[];
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await API.todos.getAllTodos();
        setTodos(Array.isArray(response) ? response : []);
      } catch (error) {
        toast.error("Failed to fetch todos");
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const newTodo = await API.todos.createTodo({ text: input });
      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const updated = await API.todos.updateTodo(id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await API.todos.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="p-2 text-md">
        <CardTitle className="text-md">📝 My Todo List</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex space-x-2 mb-3">
          <Input
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ScrollArea className="w-full rounded-md border p-2">
          <ul className="space-y-2">
            {todos.length === 0 && (
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            )}
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-muted p-2 rounded-lg h-11"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                  />
                  <Label
                    className={
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {todo.text}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
