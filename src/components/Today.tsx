import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

import { Calendar, Phone, Mail, Plus } from "lucide-react";

export type TaskType = "call" | "meeting" | "email";

interface TaskItem {
  id: string;
  type: TaskType;
  title: string;
  due?: string; // e.g., "10:30 AM"
  done: boolean;
}

const STORAGE_KEY = "onx.tasks.today";

const typeMeta: Record<TaskType, { label: string; icon: React.ReactNode; badge: string }> = {
  call: { label: "Call", icon: <Phone className="h-4 w-4" />, badge: "bg-primary/10 text-primary" },
  meeting: { label: "Meeting", icon: <Calendar className="h-4 w-4" />, badge: "bg-info/10 text-info" },
  email: { label: "Email", icon: <Mail className="h-4 w-4" />, badge: "bg-warning/10 text-warning" },
};

export function Today() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newType, setNewType] = useState<TaskType>("call");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const t: TaskItem = {
      id: crypto.randomUUID(),
      type: newType,
      title: newTitle.trim(),
      done: false,
    };
    setTasks((prev) => [t, ...prev]);
    setNewTitle("");
  };

  const toggleDone = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const byType = useMemo(() => {
    return {
      all: tasks,
      call: tasks.filter((t) => t.type === "call"),
      meeting: tasks.filter((t) => t.type === "meeting"),
      email: tasks.filter((t) => t.type === "email"),
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
          <CardDescription>Capture the 3-7 most important actions for today.</CardDescription>
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
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="call">Calls</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
        </TabsList>

        {(["all", "call", "meeting", "email"] as const).map((key) => (
          <TabsContent key={key} value={key}>
            <TaskList items={byType[key as keyof typeof byType]} onToggle={toggleDone} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TaskList({ items, onToggle }: { items: TaskItem[]; onToggle: (id: string) => void }) {
  if (!items.length)
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No tasks here yet.</CardContent>
      </Card>
    );

  return (
    <div className="space-y-2">
      {items.map((t) => (
        <Card key={t.id} className="border-muted/50">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <Checkbox checked={t.done} onCheckedChange={() => onToggle(t.id)} />
              <Badge className={`${typeMeta[t.type].badge}`}>{typeMeta[t.type].label}</Badge>
              <div className={`flex-1 ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
