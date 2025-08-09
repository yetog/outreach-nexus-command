
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactManager } from './ContactManager';
import { EmailComposer } from './EmailComposer';
import { CampaignScheduler } from './CampaignScheduler';
import { StatusTracker } from './StatusTracker';
import { DealsManager } from './DealsManager';
import { GamificationCard } from './GamificationCard';
import { Users, Mail, Calendar, BarChart3, Target } from 'lucide-react';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('deals');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Outreach Nexus</h1>
          <p className="text-muted-foreground mt-2">Your complete sales automation and gamification hub</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Imported contacts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Running campaigns</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Average open rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            subtitle="New personal record!"
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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="deals">Deals Pipeline</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="composer">Composer</TabsTrigger>
            <TabsTrigger value="scheduler">Campaigns</TabsTrigger>
            <TabsTrigger value="tracker">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deals">
            <DealsManager />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactManager />
          </TabsContent>
          
          <TabsContent value="composer">
            <EmailComposer />
          </TabsContent>
          
          <TabsContent value="scheduler">
            <CampaignScheduler />
          </TabsContent>
          
          <TabsContent value="tracker">
            <StatusTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
