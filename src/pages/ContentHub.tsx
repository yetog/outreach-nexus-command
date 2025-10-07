import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeManager } from '@/components/KnowledgeManager';
import { PitchLibrary } from '@/components/PitchLibrary';
import { QuoteGenerator } from '@/components/QuoteGenerator';

export default function ContentHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Content Hub</h2>
        <p className="text-muted-foreground">Manage your knowledge base, pitches, and quotes</p>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
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
    </div>
  );
}
