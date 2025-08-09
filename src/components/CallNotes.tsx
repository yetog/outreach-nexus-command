import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Wand2 } from 'lucide-react';

export const CallNotes: React.FC = () => {
  const [transcript, setTranscript] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const { toast } = useToast();

  const handleFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setTranscript(text);
    toast({ title: 'Transcript loaded', description: `${file.name} imported` });
  };

  const summarize = () => {
    if (!transcript.trim()) return;
    const sentences = transcript.split(/(?<=[.!?])\s+/).filter(Boolean);
    const first = sentences[0] || '';
    const last = sentences[sentences.length - 1] || '';
    const bullets = sentences.slice(1, 4).map((s, i) => `• ${s.trim()}`).join('\n');
    const s = `Summary:\n${first}\n...\n${last}\n\nAction Items:\n${bullets || '• Follow up with next steps.'}`;
    setSummary(s);
    toast({ title: 'Summary generated', description: 'Basic client-side summary created.' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Notes</CardTitle>
          <CardDescription>Paste or upload a transcript, then generate a quick summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input type="file" accept=".txt,.md,.rtf" onChange={(e) => handleFile(e.target.files?.[0])} />
            <Button variant="outline" onClick={() => summarize()}>
              <Wand2 className="h-4 w-4 mr-2" /> Summarize
            </Button>
          </div>
          <Textarea rows={10} placeholder="Paste transcript here..." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          {summary && (
            <div className="p-4 rounded-md bg-muted whitespace-pre-wrap">{summary}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
