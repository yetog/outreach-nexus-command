import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Edit, Trash2 } from 'lucide-react';

interface KnowledgeEntry {
  id: string;
  category: string;
  data: Record<string, any>;
}

interface PhoneScript {
  id: string;
  type: 'voicemail' | 'call';
  title: string;
  content: string;
}

export const KnowledgeManager = () => {
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([
    {
      id: '1',
      category: 'Product Features',
      data: {
        'Feature Name': 'AI Automation',
        'Description': 'Automated lead scoring and nurturing',
        'Benefits': 'Saves 10+ hours weekly',
        'Price Point': '$299/month'
      }
    }
  ]);

  const [phoneScripts, setPhoneScripts] = useState<PhoneScript[]>([
    {
      id: '1',
      type: 'call',
      title: 'Cold Outreach Script',
      content: 'Hi [Name], this is [Your Name] from [Company]. I noticed you\'re working on [specific challenge]. We help companies like yours [specific benefit]. Do you have 30 seconds for me to explain how?'
    },
    {
      id: '2',
      type: 'voicemail',
      title: 'Follow-up Voicemail',
      content: 'Hi [Name], [Your Name] calling from [Company]. I left you a voicemail yesterday about [topic]. I have a quick idea that could [specific benefit]. Call me back at [number] or I\'ll try you again tomorrow.'
    }
  ]);

  const [newEntry, setNewEntry] = useState({ category: '', key: '', value: '' });
  const [newScript, setNewScript] = useState({ type: 'call' as 'call' | 'voicemail', title: '', content: '' });

  const addKnowledgeEntry = () => {
    if (newEntry.category && newEntry.key && newEntry.value) {
      const entry = knowledgeEntries.find(e => e.category === newEntry.category);
      if (entry) {
        entry.data[newEntry.key] = newEntry.value;
        setKnowledgeEntries([...knowledgeEntries]);
      } else {
        setKnowledgeEntries([
          ...knowledgeEntries,
          {
            id: Date.now().toString(),
            category: newEntry.category,
            data: { [newEntry.key]: newEntry.value }
          }
        ]);
      }
      setNewEntry({ category: '', key: '', value: '' });
    }
  };

  const addPhoneScript = () => {
    if (newScript.title && newScript.content) {
      setPhoneScripts([
        ...phoneScripts,
        {
          id: Date.now().toString(),
          type: newScript.type,
          title: newScript.title,
          content: newScript.content
        }
      ]);
      setNewScript({ type: 'call', title: '', content: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage your product knowledge and phone scripts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="knowledge" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">Production Knowledge</TabsTrigger>
          <TabsTrigger value="scripts">Phone Scripts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Knowledge</CardTitle>
              <CardDescription>
                Excel-like data management for your product information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add new entry form */}
                <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                  <Input
                    placeholder="Category"
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  />
                  <Input
                    placeholder="Key"
                    value={newEntry.key}
                    onChange={(e) => setNewEntry({ ...newEntry, key: e.target.value })}
                  />
                  <Input
                    placeholder="Value"
                    value={newEntry.value}
                    onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                  />
                  <Button onClick={addKnowledgeEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Knowledge entries display */}
                {knowledgeEntries.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{entry.category}</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(entry.data).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              {key}
                            </Badge>
                            <p className="text-sm font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phone Scripts</CardTitle>
              <CardDescription>
                Manage your call and voicemail scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add new script form */}
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                  <div className="flex gap-4">
                    <select
                      value={newScript.type}
                      onChange={(e) => setNewScript({ ...newScript, type: e.target.value as 'call' | 'voicemail' })}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="call">Call Script</option>
                      <option value="voicemail">Voicemail Script</option>
                    </select>
                    <Input
                      placeholder="Script Title"
                      value={newScript.title}
                      onChange={(e) => setNewScript({ ...newScript, title: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                  <Textarea
                    placeholder="Script content..."
                    value={newScript.content}
                    onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
                    rows={3}
                  />
                  <Button onClick={addPhoneScript}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Script
                  </Button>
                </div>

                {/* Scripts display */}
                <div className="grid gap-4">
                  {phoneScripts.map((script) => (
                    <Card key={script.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={script.type === 'call' ? 'default' : 'secondary'}>
                              {script.type === 'call' ? 'Call' : 'Voicemail'}
                            </Badge>
                            <CardTitle className="text-lg">{script.title}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {script.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};