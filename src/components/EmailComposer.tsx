
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Eye, Plus, Mail, Wand2, Loader2 } from 'lucide-react';
import { ionosAI } from '@/lib/ionosAI';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tags: string[];
  createdAt: string;
}

export const EmailComposer = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    tags: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContext, setAiContext] = useState({ recipientName: '', company: '', goal: '' });

  const handleSaveTemplate = () => {
    if (currentTemplate.name && currentTemplate.subject && currentTemplate.body) {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: currentTemplate.name,
        subject: currentTemplate.subject,
        body: currentTemplate.body,
        tags: currentTemplate.tags || [],
        createdAt: new Date().toISOString()
      };
      
      setTemplates([...templates, newTemplate]);
      setCurrentTemplate({ name: '', subject: '', body: '', tags: [] });
      console.log('Template saved:', newTemplate);
    }
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleGenerateAI = async () => {
    if (!aiContext.goal.trim()) {
      toast({ title: 'Missing goal', description: 'Please specify the email goal.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await ionosAI.generateEmailCTA(aiContext);
      setCurrentTemplate({
        ...currentTemplate,
        subject: result.subject,
        body: result.body,
      });
      toast({ title: 'AI Email generated', description: 'Email created with IONOS AI.' });
    } catch (error) {
      console.error('Generate error:', error);
      toast({ 
        title: 'Generation failed', 
        description: 'Could not generate AI email. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Composer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Composer</CardTitle>
              <CardDescription>
                Create and customize email templates for your outreach campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Generator Section */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm flex items-center">
                  <Wand2 className="h-4 w-4 mr-2" /> AI Email Generator
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Recipient name"
                    value={aiContext.recipientName}
                    onChange={(e) => setAiContext({...aiContext, recipientName: e.target.value})}
                  />
                  <Input
                    placeholder="Company"
                    value={aiContext.company}
                    onChange={(e) => setAiContext({...aiContext, company: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="Email goal (e.g., book a demo, discuss partnership)"
                  value={aiContext.goal}
                  onChange={(e) => setAiContext({...aiContext, goal: e.target.value})}
                />
                <Button onClick={handleGenerateAI} disabled={isGenerating} size="sm" className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" /> Generate with AI
                    </>
                  )}
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <Input
                  placeholder="e.g., Cold Outreach - Tech Companies"
                  value={currentTemplate.name || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject Line</label>
                <Input
                  placeholder="Quick question about {{company}}"
                  value={currentTemplate.subject || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Body</label>
                <Textarea
                  placeholder="Hi {{name}},&#10;&#10;I noticed {{company}} is doing great work in...&#10;&#10;Best regards,&#10;Your name"
                  rows={12}
                  value={currentTemplate.body || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})}
                />
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Available variables:</strong> &#123;&#123;name&#125;&#125;, &#123;&#123;email&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;tag1&#125;&#125;, &#123;&#123;tag2&#125;&#125;
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveTemplate} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Template Library */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Your saved email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No templates yet</p>
                  <p className="text-xs">Create your first template</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLoadTemplate(template)}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                      <div className="flex gap-1 mt-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
