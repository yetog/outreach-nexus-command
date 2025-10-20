import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Phone, Mail, Plus, Clock, AlertCircle } from "lucide-react";
import { taskStorage, Task, TaskType } from "@/lib/taskStorage";
import { format } from "date-fns";

const typeMeta: Record<TaskType, { label: string; icon: React.ReactNode; badge: string }> = {
  call: { label: "Call", icon: <Phone className="h-4 w-4" />, badge: "bg-primary/10 text-primary" },
  meeting: { label: "Meeting", icon: <Calendar className="h-4 w-4" />, badge: "bg-info/10 text-info" },
  email: { label: "Email", icon: <Mail className="h-4 w-4" />, badge: "bg-warning/10 text-warning" },
  "follow-up": { label: "Follow-up", icon: <Clock className="h-4 w-4" />, badge: "bg-success/10 text-success" },
};

export function Today() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newType, setNewType] = useState<TaskType>("call");
  const [newTitle, setNewTitle] = useState("");

  const loadTasks = () => {
    const today = taskStorage.getToday();
    const overdue = taskStorage.getOverdue();
    setTasks([...overdue, ...today]);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = () => {
    if (!newTitle.trim()) return;
    taskStorage.create({
      title: newTitle.trim(),
      type: newType,
      priority: "medium",
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      completed: false,
    });
    setNewTitle("");
    loadTasks();
  };

  const toggleDone = (id: string) => {
    taskStorage.toggleComplete(id);
    loadTasks();
  };

  const byType = useMemo(() => {
    return {
      all: tasks,
      call: tasks.filter((t) => t.type === "call"),
      meeting: tasks.filter((t) => t.type === "meeting"),
      email: tasks.filter((t) => t.type === "email"),
      "follow-up": tasks.filter((t) => t.type === "follow-up"),
    };
  }, [tasks]);

  const overdueTasks = useMemo(() => tasks.filter(t => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return !t.completed && t.dueDate < today;
  }), [tasks]);

  return (
    <div className="space-y-4">
      {overdueTasks.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              {overdueTasks.length} Overdue Task{overdueTasks.length !== 1 && 's'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList items={overdueTasks} onToggle={toggleDone} compact />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
          <CardDescription>Capture the most important actions for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={newType} onValueChange={(v) => setNewType(v as TaskType)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Call ACME about renewal at 2pm"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />
            <Button onClick={addTask} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-2">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="call">Calls</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
        </TabsList>

        {(["all", "call", "meeting", "email", "follow-up"] as const).map((key) => (
          <TabsContent key={key} value={key}>
            <TaskList items={byType[key as keyof typeof byType]} onToggle={toggleDone} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TaskList({ items, onToggle, compact }: { items: Task[]; onToggle: (id: string) => void; compact?: boolean }) {
  if (!items.length)
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No tasks here yet.</CardContent>
      </Card>
    );

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {items.map((t) => (
        <Card key={t.id} className="border-muted/50">
          <CardContent className={compact ? "py-2" : "py-3"}>
            <div className="flex items-center gap-3">
              <Checkbox checked={t.completed} onCheckedChange={() => onToggle(t.id)} />
              <Badge className={`${typeMeta[t.type].badge}`}>{typeMeta[t.type].label}</Badge>
              <div className={`flex-1 ${t.completed ? "line-through text-muted-foreground" : ""}`}>
                {t.title}
              </div>
              {t.dueTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t.dueTime}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
