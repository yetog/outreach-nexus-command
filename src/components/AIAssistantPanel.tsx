import React, { useState } from 'react';
import { Bot, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const location = useLocation();

  const getContextPrompt = () => {
    const path = location.pathname;
    if (path === '/') return 'Today View - Focus on daily tasks';
    if (path === '/composer') return 'Email Composer - Help with writing';
    if (path === '/contacts') return 'Contacts - CRM insights';
    if (path === '/deals') return 'Deals - Pipeline analysis';
    return 'General assistance';
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: 'AI assistant integration coming soon with IONOS AI Model Hub (Llama 3.1). This will provide context-aware suggestions, email generation, and deal insights.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-50"
        size="icon"
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed right-0 top-0 h-screen w-[400px] rounded-none border-l shadow-lg flex flex-col">
      <CardHeader className="border-b flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Assistant</CardTitle>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <div className="px-4 py-2 border-b bg-muted/50">
        <Badge variant="outline" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          {getContextPrompt()}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>Ask me anything about your outreach or CRM data</p>
              <p className="text-xs mt-2">Powered by IONOS AI Model Hub</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI assistant..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Bot className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
