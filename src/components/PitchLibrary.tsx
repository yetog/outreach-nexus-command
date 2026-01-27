import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { pitchStorage, Pitch } from '@/lib/pitchStorage';
import { useToast } from '@/hooks/use-toast';

export const PitchLibrary: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [draft, setDraft] = useState<{ title: string; tags: string[]; content: string }>({ 
    title: '', 
    tags: [], 
    content: '' 
  });

  useEffect(() => {
    setPitches(pitchStorage.getAll());
  }, []);

  const filtered = pitches.filter(p =>
    (p.title + ' ' + p.tags.join(' ') + ' ' + p.content).toLowerCase().includes(search.toLowerCase())
  );

  const addPitch = () => {
    if (!draft.title || !draft.content) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a title and content.',
        variant: 'destructive',
      });
      return;
    }
    
    pitchStorage.create({
      title: draft.title,
      tags: draft.tags,
      content: draft.content,
    });
    
    setPitches(pitchStorage.getAll());
    setDraft({ title: '', tags: [], content: '' });
    
    toast({
      title: 'Pitch added',
      description: 'Your pitch has been saved to the library.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pitch Library</CardTitle>
          <CardDescription>Store and search your best-performing pitches. (RAG coming soon)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Search pitches, tags, content..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {filtered.map((p) => (
                <div key={p.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{p.title}</div>
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map(t => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{p.content}</div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  {pitches.length === 0 ? 'No pitches yet. Add your first one!' : 'No matches found.'}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="font-medium">Add New Pitch</div>
              <Input 
                placeholder="Title" 
                value={draft.title} 
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} 
              />
              <Input 
                placeholder="Tags (comma separated)" 
                value={draft.tags.join(', ')} 
                onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
              />
              <Textarea 
                rows={8} 
                placeholder="Pitch content..." 
                value={draft.content} 
                onChange={(e) => setDraft({ ...draft, content: e.target.value })} 
              />
              <Button onClick={addPitch}>
                <Plus className="h-4 w-4 mr-2" /> Add Pitch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
