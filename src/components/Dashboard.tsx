
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
            <div className="mb-6">
              <GamificationCard />
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
