import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sparkles, Upload, Rocket } from 'lucide-react';

interface OnboardingChoiceProps {
  open: boolean;
  onChoice: (choice: 'demo' | 'fresh') => void;
}

export function OnboardingChoice({ open, onChoice }: OnboardingChoiceProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Welcome to Outreach Nexus</DialogTitle>
          <DialogDescription className="text-base">
            Your AI-powered CRM for personal outreach. How would you like to get started?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onChoice('demo')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Explore with Demo Data</CardTitle>
                  <CardDescription>
                    See the CRM in action with sample contacts and deals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 8 sample contacts with company info</li>
                <li>• 5 deals in various pipeline stages</li>
                <li>• Email templates and pitches ready to use</li>
                <li>• You can always clear this data later</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onChoice('fresh')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  <Upload className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Start Fresh</CardTitle>
                  <CardDescription>
                    Begin with a clean slate and import your own data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Empty CRM ready for your contacts</li>
                <li>• Import from CSV or LinkedIn exports</li>
                <li>• Build your pipeline from scratch</li>
                <li>• Demo data available in Settings if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          All data is stored locally in your browser. No account required.
        </p>
      </DialogContent>
    </Dialog>
  );
}
