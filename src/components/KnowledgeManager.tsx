import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { knowledgeStorage, KnowledgeEntry, PhoneScript } from '@/lib/knowledgeStorage';
import { useToast } from '@/hooks/use-toast';

export const KnowledgeManager = () => {
  const { toast } = useToast();
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [phoneScripts, setPhoneScripts] = useState<PhoneScript[]>([]);
  const [newEntry, setNewEntry] = useState({ category: '', key: '', value: '' });
  const [newScript, setNewScript] = useState({ type: 'call' as 'call' | 'voicemail', title: '', content: '' });

  useEffect(() => {
    setKnowledgeEntries(knowledgeStorage.getAllKnowledge());
    setPhoneScripts(knowledgeStorage.getAllScripts());
  }, []);

  const addKnowledgeEntry = () => {
    if (newEntry.category && newEntry.key && newEntry.value) {
      knowledgeStorage.createKnowledge({
        category: newEntry.category,
        data: { [newEntry.key]: newEntry.value },
      });
      
      setKnowledgeEntries(knowledgeStorage.getAllKnowledge());
      setNewEntry({ category: '', key: '', value: '' });
      
      toast({
        title: 'Knowledge added',
        description: 'Entry has been saved.',
      });
    }
  };

  const addPhoneScript = () => {
    if (newScript.title && newScript.content) {
      knowledgeStorage.createScript({
        type: newScript.type,
        title: newScript.title,
        content: newScript.content,
      });
      
      setPhoneScripts(knowledgeStorage.getAllScripts());
      setNewScript({ type: 'call', title: '', content: '' });
      
      toast({
        title: 'Script added',
        description: 'Phone script has been saved.',
      });
    }
  };

  const deleteKnowledge = (id: string) => {
    knowledgeStorage.deleteKnowledge(id);
    setKnowledgeEntries(knowledgeStorage.getAllKnowledge());
    toast({ title: 'Entry deleted' });
  };

  const deleteScript = (id: string) => {
    knowledgeStorage.deleteScript(id);
    setPhoneScripts(knowledgeStorage.getAllScripts());
    toast({ title: 'Script deleted' });
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
                {knowledgeEntries.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No knowledge entries yet. Add your first one above!
                  </div>
                ) : (
                  knowledgeEntries.map((entry) => (
                    <Card key={entry.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{entry.category}</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteKnowledge(entry.id)}>
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
                  ))
                )}
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
                      className="px-3 py-2 border rounded-md bg-background"
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
                {phoneScripts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No phone scripts yet. Add your first one above!
                  </div>
                ) : (
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
                              <Button variant="ghost" size="sm" onClick={() => deleteScript(script.id)}>
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
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
