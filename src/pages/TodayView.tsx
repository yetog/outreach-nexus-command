import React from 'react';
import { GamificationCard } from '@/components/GamificationCard';
import { Today } from '@/components/Today';

export default function TodayView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Today</h2>
        <p className="text-muted-foreground">Your daily focus and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GamificationCard
          type="xp"
          title="Today's XP"
          value="47"
          progress={47}
          maxValue={100}
          subtitle="Daily target: 100 XP"
        />
        <GamificationCard
          type="streak"
          title="Pipeline Streak"
          value="12 days"
          progress={12}
          maxValue={30}
          subtitle="Keep it going!"
        />
        <GamificationCard
          type="quests"
          title="Weekly Quests"
          value="2/3"
          items={[
            { id: '1', title: 'Re-ignite 5 stalled deals', progress: 60, completed: false },
            { id: '2', title: 'Book 2 meetings from cold accounts', progress: 100, completed: true },
            { id: '3', title: 'Create 3 objection-specific CTAs', progress: 33, completed: false },
          ]}
        />
      </div>

      <Today />
    </div>
  );
}
