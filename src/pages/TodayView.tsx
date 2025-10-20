import React, { useState, useEffect } from 'react';
import { GamificationCard } from '@/components/GamificationCard';
import { Today } from '@/components/Today';
import { taskStorage } from '@/lib/taskStorage';
import { format } from 'date-fns';

export default function TodayView() {
  const [selectedDate] = useState(new Date());
  const [stats, setStats] = useState({ today: 0, overdue: 0 });

  useEffect(() => {
    const updateStats = () => {
      const todayTasks = taskStorage.getToday();
      const overdueTasks = taskStorage.getOverdue();
      setStats({
        today: todayTasks.filter(t => !t.completed).length,
        overdue: overdueTasks.length
      });
    };
    
    updateStats();
    window.addEventListener('storage', updateStats);
    const interval = setInterval(updateStats, 5000);
    
    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h2>
        <p className="text-muted-foreground">
          {stats.today} tasks today • {stats.overdue > 0 && `${stats.overdue} overdue`}
        </p>
      </div>

      <div className="mb-6">
        <GamificationCard />
      </div>

      <Today />
    </div>
  );
}
