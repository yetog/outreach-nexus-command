import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap, Flame, Award, Target } from 'lucide-react';
import { gamificationStorage, Quest, Badge as GamBadge } from '@/lib/gamificationStorage';

export function GamificationCard() {
  const [profile, setProfile] = useState(gamificationStorage.getProfile());
  const [quests, setQuests] = useState<Quest[]>([]);
  const [badges, setBadges] = useState<GamBadge[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const p = gamificationStorage.getProfile();
      setProfile(p);
      setQuests(gamificationStorage.getQuests());
      setBadges(gamificationStorage.getBadges().filter(b => b.unlocked));
      setProgress(gamificationStorage.getProgressToNextLevel());
    };

    loadData();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    window.addEventListener('storage', loadData);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const xpToNext = gamificationStorage.getXPForNextLevel();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* XP & Level Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Level {profile.level}
          </CardTitle>
          <CardDescription>{profile.totalXP.toLocaleString()} Total XP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next Level</span>
              <span className="font-medium">{xpToNext} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            {profile.currentStreak} Day Streak
          </CardTitle>
          <CardDescription>Best: {profile.longestStreak} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-8 w-full rounded ${
                  i < profile.currentStreak % 7
                    ? 'bg-orange-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Badges
          </CardTitle>
          <CardDescription>{badges.length} unlocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 6).map(badge => (
              <div
                key={badge.id}
                className="text-2xl"
                title={badge.name}
              >
                {badge.icon}
              </div>
            ))}
            {badges.length > 6 && (
              <Badge variant="secondary">+{badges.length - 6}</Badge>
            )}
            {badges.length === 0 && (
              <span className="text-sm text-muted-foreground">No badges yet</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quests Card */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Active Quests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quests.map(quest => (
              <div key={quest.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{quest.title}</div>
                    <div className="text-xs text-muted-foreground">{quest.description}</div>
                  </div>
                  <Badge variant={quest.completed ? 'default' : 'secondary'} className="text-xs">
                    {quest.completed ? 'Done' : quest.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{quest.current} / {quest.target}</span>
                    <span className="text-primary">+{quest.xpReward} XP</span>
                  </div>
                  <Progress value={(quest.current / quest.target) * 100} className="h-1.5" />
                </div>
              </div>
            ))}
            {quests.length === 0 && (
              <div className="text-sm text-muted-foreground col-span-3 text-center py-4">
                No active quests. Complete tasks to unlock quests!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
