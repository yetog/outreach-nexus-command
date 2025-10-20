import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Wand2, Loader2 } from 'lucide-react';
import { ionosAI } from '@/lib/ionosAI';

export const CallNotes: React.FC = () => {
  const [transcript, setTranscript] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [actionItems, setActionItems] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const handleFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setTranscript(text);
    toast({ title: 'Transcript loaded', description: `${file.name} imported` });
  };

  const summarize = async () => {
    if (!transcript.trim()) {
      toast({ title: 'No transcript', description: 'Please paste or upload a transcript first.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await ionosAI.summarizeCallTranscript(transcript);
      setSummary(result.summary);
      setActionItems(result.actionItems);
      toast({ title: 'AI Summary generated', description: 'Call analyzed with IONOS AI.' });
    } catch (error) {
      console.error('Summarize error:', error);
      toast({ 
        title: 'Generation failed', 
        description: 'Could not generate AI summary. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
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
            <Button variant="outline" onClick={summarize} disabled={isGenerating || !transcript.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" /> AI Summarize
                </>
              )}
            </Button>
          </div>
          <Textarea rows={10} placeholder="Paste transcript here..." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          
          {summary && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm">{summary}</p>
              </div>
              
              {actionItems.length > 0 && (
                <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold mb-2">Action Items</h4>
                  <ul className="space-y-1">
                    {actionItems.map((item, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
