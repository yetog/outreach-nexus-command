import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Wand2, Loader2, PhoneCall, Clock, Save } from 'lucide-react';
import { ionosAI } from '@/lib/ionosAI';
import { callLogStorage, CallLog } from '@/lib/callLogStorage';
import { contactStorage, Contact } from '@/lib/contactStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const CallNotes: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [outcome, setOutcome] = useState<CallLog['outcome']>('answered');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setContacts(contactStorage.getAll());
    setRecentCalls(callLogStorage.getRecent(5));
  }, []);

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

  const saveCallLog = () => {
    const selectedContact = contacts.find(c => c.id === selectedContactId);
    
    callLogStorage.create({
      contactId: selectedContactId || undefined,
      contactName: selectedContact?.name,
      transcript: transcript || undefined,
      summary: summary || undefined,
      actionItems,
      outcome,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
    });

    toast({
      title: 'Call Logged',
      description: `Call saved${selectedContact ? ` for ${selectedContact.name}` : ''}. +15 XP`,
    });

    // Reset form
    setTranscript('');
    setSummary('');
    setActionItems([]);
    setSelectedContactId('');
    setOutcome('answered');
    setDuration('');
    setNotes('');
    
    // Refresh recent calls
    setRecentCalls(callLogStorage.getRecent(5));
  };

  const getOutcomeColor = (o: CallLog['outcome']) => {
    switch (o) {
      case 'answered': return 'bg-success/10 text-success';
      case 'voicemail': return 'bg-warning/10 text-warning';
      case 'no-answer': return 'bg-muted text-muted-foreground';
      case 'busy': return 'bg-destructive/10 text-destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log a Call</CardTitle>
              <CardDescription>Record call details, paste a transcript, and generate AI summaries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No contact selected</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} {contact.company && `(${contact.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="outcome">Call Outcome</Label>
                  <Select value={outcome} onValueChange={(v) => setOutcome(v as CallLog['outcome'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="voicemail">Voicemail</SelectItem>
                      <SelectItem value="no-answer">No Answer</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="max-w-[200px]"
                />
              </div>

              <div>
                <Label htmlFor="notes">Quick Notes</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder="Key points from the call..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Transcript (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file" 
                      accept=".txt,.md,.rtf" 
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      className="max-w-[200px]" 
                    />
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
                </div>
                <Textarea 
                  rows={6} 
                  placeholder="Paste transcript here..." 
                  value={transcript} 
                  onChange={(e) => setTranscript(e.target.value)} 
                />
              </div>
              
              {summary && (
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-muted">
                    <h4 className="font-semibold mb-2">AI Summary</h4>
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

              <Button onClick={saveCallLog} className="w-full">
                <Save className="h-4 w-4 mr-2" /> Save Call Log
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCalls.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No calls logged yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCalls.map((call) => (
                    <div key={call.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {call.contactName || 'Unknown'}
                          </span>
                        </div>
                        <Badge className={getOutcomeColor(call.outcome)}>
                          {call.outcome}
                        </Badge>
                      </div>
                      {call.summary && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {call.summary}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(call.createdAt), 'PPp')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
