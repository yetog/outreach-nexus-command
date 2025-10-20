import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, TrendingUp } from 'lucide-react';
import { ionosAI } from '@/lib/ionosAI';
import { useToast } from '@/hooks/use-toast';
import { taskStorage } from '@/lib/taskStorage';
import { contactStorage } from '@/lib/contactStorage';

export const InsightsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const tasks = taskStorage.getAll();
      const contacts = contactStorage.getAll();
      const todayTasks = taskStorage.getToday();
      const overdueTasks = taskStorage.getOverdue();

      const recentActivity = `
- Total contacts: ${contacts.length}
- Total tasks: ${tasks.length}
- Tasks today: ${todayTasks.length}
- Overdue tasks: ${overdueTasks.length}
- Completed tasks: ${tasks.filter(t => t.completed).length}
- Contact tags: ${[...new Set(contacts.flatMap(c => c.tags))].join(', ') || 'none'}
      `.trim();

      const goals = `
- Increase outreach efficiency
- Improve task completion rate
- Maintain consistent follow-up
      `.trim();

      const result = await ionosAI.generateInsights({ recentActivity, goals });
      setInsights(result);
      toast({ title: 'Insights generated', description: 'AI-powered nudges ready.' });
    } catch (error) {
      console.error('Insights error:', error);
      toast({ 
        title: 'Generation failed', 
        description: 'Could not generate insights. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          AI Insights & Nudges
        </CardTitle>
        <CardDescription>
          Get AI-powered recommendations based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateInsights} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" /> Generate Insights
            </>
          )}
        </Button>

        {insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start">
                  <span className="font-semibold text-primary mr-2">{i + 1}.</span>
                  <p className="text-sm">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {insights.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Click "Generate Insights" to get AI-powered recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
