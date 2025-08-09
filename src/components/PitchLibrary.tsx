import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface Pitch { id: string; title: string; tags: string[]; content: string; }

export const PitchLibrary: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [pitches, setPitches] = React.useState<Pitch[]>([
    { id: '1', title: 'Value Prop - SMB SaaS', tags: ['value', 'smb', 'saas'], content: 'We help SMB SaaS teams automate outreach and increase conversion by 22%...' },
    { id: '2', title: 'Objection - Budget', tags: ['objection', 'budget'], content: 'Totally understand budget caution. Teams like Acme started small with our lite plan and funded the rollout from early wins...' }
  ]);
  const [draft, setDraft] = React.useState<Partial<Pitch>>({ title: '', tags: [], content: '' });

  const filtered = pitches.filter(p =>
    (p.title + ' ' + p.tags.join(' ') + ' ' + p.content).toLowerCase().includes(search.toLowerCase())
  );

  const addPitch = () => {
    if (!draft.title || !draft.content) return;
    const tags = (draft.tags as string[] | undefined) || [];
    setPitches(prev => [...prev, { id: Date.now().toString(), title: draft.title!, tags, content: draft.content! }]);
    setDraft({ title: '', tags: [], content: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pitch Library</CardTitle>
          <CardDescription>Store and search your best-performing pitches. (RAG coming soon)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search pitches, tags, content..." value={search} onChange={(e) => setSearch(e.target.value)} />

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
                <div className="text-sm text-muted-foreground">No matches.</div>
              )}
            </div>
            <div className="space-y-3">
              <div className="font-medium">Add New Pitch</div>
              <Input placeholder="Title" value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              <Input placeholder="Tags (comma separated)" value={(draft.tags as string[] | undefined)?.join(', ') || ''} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              <Textarea rows={8} placeholder="Pitch content..." value={draft.content || ''} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
              <Button onClick={addPitch}><Plus className="h-4 w-4 mr-2" /> Add Pitch</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
