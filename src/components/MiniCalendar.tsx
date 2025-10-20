import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { taskStorage } from '@/lib/taskStorage';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const taskCounts = useMemo(() => {
    return taskStorage.getTasksForMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    );
  }, [currentMonth]);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {days.map((day, i) => {
            const dayOfMonth = day.getDate();
            const taskCount = taskCounts.get(dayOfMonth) || 0;
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={i}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'relative h-8 w-8 rounded-md text-xs font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                  isCurrentDay && !isSelected && 'bg-accent text-accent-foreground font-bold'
                )}
              >
                {dayOfMonth}
                {taskCount > 0 && isCurrentMonth && (
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full',
                      isSelected ? 'bg-primary-foreground' : 'bg-primary'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
