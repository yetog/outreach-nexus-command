import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MousePointer, UserMinus, TrendingUp, Calendar, Phone, CheckCircle } from 'lucide-react';
import { dealStorage } from '@/lib/dealStorage';
import { taskStorage } from '@/lib/taskStorage';
import { contactStorage } from '@/lib/contactStorage';
import { campaignStorage } from '@/lib/campaignStorage';
import { gamificationStorage } from '@/lib/gamificationStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const StatusTracker = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    pipelineValue: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    activeCampaigns: 0,
    emailsSent: 0,
  });

  const [dealsByStage, setDealsByStage] = useState<{ name: string; value: number; color: string }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ date: string; tasks: number; calls: number; emails: number }[]>([]);

  useEffect(() => {
    const contacts = contactStorage.getAll();
    const deals = dealStorage.getAll();
    const tasks = taskStorage.getAll();
    const campaigns = campaignStorage.getAll();
    const profile = gamificationStorage.getProfile();

    // Calculate stats
    const pipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
    const emailsSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);

    setStats({
      totalContacts: contacts.length,
      totalDeals: deals.length,
      pipelineValue,
      tasksCompleted: profile.stats.tasksCompleted,
      totalTasks: tasks.length,
      activeCampaigns,
      emailsSent,
    });

    // Deals by stage
    const stageColors: Record<string, string> = {
      discovery: '#3b82f6',
      proposal: '#f59e0b',
      negotiation: '#f97316',
      closing: '#8b5cf6',
      won: '#22c55e',
      lost: '#ef4444',
    };

    const stageCounts = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setDealsByStage(
      Object.entries(stageCounts).map(([stage, count]) => ({
        name: stage.charAt(0).toUpperCase() + stage.slice(1),
        value: count,
        color: stageColors[stage] || '#6b7280',
      }))
    );

    // Generate demo activity data for the past 7 days
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      activityData.push({
        date: dayName,
        tasks: Math.floor(Math.random() * 8) + 2,
        calls: Math.floor(Math.random() * 5) + 1,
        emails: Math.floor(Math.random() * 10) + 3,
      });
    }
    setRecentActivity(activityData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.emailsSent}</p>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(stats.pipelineValue / 1000).toFixed(0)}k</p>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Tasks, calls, and emails over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }} 
                  />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" name="Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calls" fill="#22c55e" name="Calls" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="emails" fill="#f59e0b" name="Emails" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
            <CardDescription>Deals by stage ({stats.totalDeals} total)</CardDescription>
          </CardHeader>
          <CardContent>
            {dealsByStage.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No deals yet</p>
                  <p className="text-sm">Create deals to see pipeline stats</p>
                </div>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dealsByStage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {dealsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your CRM at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.totalContacts}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.totalDeals}</p>
              <p className="text-sm text-muted-foreground">Total Deals</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.totalTasks}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.activeCampaigns}</p>
              <p className="text-sm text-muted-foreground">Campaigns Running</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
