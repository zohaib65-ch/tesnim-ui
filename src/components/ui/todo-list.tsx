import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, Save } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import API from "@/services";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  createdAt?: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("high");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await API.todos.getAllTodos();
        setTodos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Failed to fetch todos");
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;

    const postData = {
      title: input,
      description: "Prepare slides for the meeting",
      status: "pending",
      dueDate: "2025-07-01T00:00:00.000Z",
      priority: priority,
      tags: ["work", "presentation"],
    };

    try {
      const response = await API.todos.createTodo(postData);
      const newTodo = response.data;
      setTodos((prev) => [newTodo, ...prev]);
      setInput("");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await API.todos.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await API.todos.updateTodo(id, { title: editTitle });
      const updatedTodo = response.data;

      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, title: updatedTodo.title } : t)));

      setEditId(null);
      setEditTitle("");
      toast.success("Title updated");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="p-2 text-md">
        <CardTitle className="text-md">📝 My Todo List</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="flex space-x-2 mb-3">
          <Input placeholder="Add a new task..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} />
          <Select value={priority} onValueChange={(val) => setPriority(val)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button className="p-2 h-9" onClick={addTodo}>
            Add
          </Button>
        </div>
        <ScrollArea className="w-full rounded-md border p-2">
          <ul className="space-y-2">
            {todos.length === 0 && <p className="text-sm text-muted-foreground">No tasks yet.</p>}
            {todos.map((todo) => (
              <li key={todo._id} className="flex items-center justify-between bg-muted p-1.5 rounded-lg h-auto">
                {editId === todo._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => saveEdit(todo._id)}>
                      <Save className="h-4 text-green-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <Label className="text-sm">{todo.title || "Untitled"}</Label>
                      <span
                        className={`text-[11px] mt-1 ${
                          todo.priority === "high" ? "text-red-500" : todo.priority === "medium" ? "text-yellow-500" : todo.priority === "low" ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {todo.priority?.toUpperCase() || "NO PRIORITY"}
                      </span>
                    </div>
                    <div className="flex items-center w-13">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(todo)}>
                        <Pencil className="h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo._id)}>
                        <Trash2 className="h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
