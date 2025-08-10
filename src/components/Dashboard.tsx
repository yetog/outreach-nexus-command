
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactManager } from './ContactManager';
import { EmailComposer } from './EmailComposer';
import { CampaignScheduler } from './CampaignScheduler';
import { StatusTracker } from './StatusTracker';
import { DealsManager } from './DealsManager';
import { GamificationCard } from './GamificationCard';
import { KnowledgeManager } from './KnowledgeManager';
import { ChatBot } from './ChatBot';
import { CallNotes } from './CallNotes';
import { QuoteGenerator } from './QuoteGenerator';
import { PitchLibrary } from './PitchLibrary';
import { SettingsDialog } from './SettingsDialog';
import { Today } from './Today';


export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
<div className="mb-8 flex items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-foreground">Outreach Nexus</h1>
    <p className="text-muted-foreground mt-2">Your complete sales automation and gamification hub</p>
  </div>
  <SettingsDialog />
</div>


        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          </TabsContent>

          <TabsContent value="sales">
            <Tabs defaultValue="deals" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
              </TabsList>
              <TabsContent value="deals">
                <DealsManager />
              </TabsContent>
              <TabsContent value="contacts">
                <ContactManager />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="outreach">
            <Tabs defaultValue="composer" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="composer">Composer</TabsTrigger>
                <TabsTrigger value="scheduler">Campaigns</TabsTrigger>
                <TabsTrigger value="call-notes">Call Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="composer">
                <EmailComposer />
              </TabsContent>
              <TabsContent value="scheduler">
                <CampaignScheduler />
              </TabsContent>
              <TabsContent value="call-notes">
                <CallNotes />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="content">
            <Tabs defaultValue="knowledge" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                <TabsTrigger value="pitches">Pitches</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>
              <TabsContent value="knowledge">
                <KnowledgeManager />
              </TabsContent>
              <TabsContent value="pitches">
                <PitchLibrary />
              </TabsContent>
              <TabsContent value="quotes">
                <QuoteGenerator />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="analytics">
            <StatusTracker />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating ChatBot */}
      <ChatBot 
        isOpen={isChatBotOpen} 
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
      />
    </div>
  );
};
