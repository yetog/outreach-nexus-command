import { format, parseISO, isToday, isPast, isFuture } from 'date-fns';

export type TaskType = 'call' | 'meeting' | 'email' | 'follow-up';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  dueTime?: string; // e.g., "14:30"
  completed: boolean;
  linkedContactId?: string;
  linkedDealId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'onx.tasks';

export const taskStorage = {
  getAll(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  getByDate(date: Date): Task[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.getAll().filter(task => task.dueDate === dateStr);
  },

  getOverdue(): Task[] {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.getAll().filter(task => !task.completed && task.dueDate < today);
  },

  getToday(): Task[] {
    return this.getByDate(new Date());
  },

  getUpcoming(): Task[] {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.getAll().filter(task => !task.completed && task.dueDate > today);
  },

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const tasks = this.getAll();
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  },

  update(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  delete(id: string): boolean {
    const tasks = this.getAll();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  toggleComplete(id: string): Task | null {
    const task = this.getAll().find(t => t.id === id);
    if (!task) return null;
    return this.update(id, { completed: !task.completed });
  },

  getTasksForMonth(year: number, month: number): Map<number, number> {
    const tasks = this.getAll();
    const counts = new Map<number, number>();
    
    tasks.forEach(task => {
      try {
        const taskDate = parseISO(task.dueDate);
        if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
          const day = taskDate.getDate();
          counts.set(day, (counts.get(day) || 0) + 1);
        }
      } catch {}
    });
    
    return counts;
  }
};
