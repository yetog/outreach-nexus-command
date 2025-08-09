import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Trophy, Flame } from 'lucide-react';

interface GamificationCardProps {
  type: 'xp' | 'streak' | 'quests';
  title: string;
  value: string | number;
  progress?: number;
  maxValue?: number;
  subtitle?: string;
  items?: Array<{ id: string; title: string; progress: number; completed?: boolean }>;
}

export const GamificationCard = ({ type, title, value, progress, maxValue, subtitle, items }: GamificationCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'xp':
        return <Zap className="h-4 w-4 text-xp-primary" />;
      case 'streak':
        return <Flame className="h-4 w-4 text-warning" />;
      case 'quests':
        return <Target className="h-4 w-4 text-info" />;
      default:
        return <Trophy className="h-4 w-4 text-primary" />;
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'xp':
        return 'bg-xp-primary';
      case 'streak':
        return 'bg-warning';
      case 'quests':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {type === 'xp' && (
        <div className="absolute inset-0 bg-gradient-to-br from-xp-primary/5 to-xp-secondary/5" />
      )}
      {type === 'streak' && progress && progress > 7 && (
        <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-orange-500/5" />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        
        {progress !== undefined && maxValue && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}/{maxValue}</span>
            </div>
            <Progress 
              value={(progress / maxValue) * 100} 
              className="h-2"
            />
          </div>
        )}

        {items && (
          <div className="mt-3 space-y-2">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className={`truncate ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                </span>
                <div className="flex items-center gap-2 ml-2">
                  {item.completed ? (
                    <Badge variant="secondary" className="text-xs">
                      Complete
                    </Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {item.progress}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};