import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function Settings() {
  const { backendUrl, setBackendUrl } = useAppSettings();
  const [url, setUrl] = useState(backendUrl);
  const { toast } = useToast();

  const handleSave = () => {
    setBackendUrl(url.trim());
    toast({
      title: 'Settings saved',
      description: 'Backend API URL has been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Configure your application settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Backend Configuration</CardTitle>
            <CardDescription>
              Configure the backend API endpoint for your Outreach Nexus instance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backendUrl">Backend API URL</Label>
              <Input
                id="backendUrl"
                placeholder="https://api.yourdomain.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The base URL for your FastAPI backend (IONOS VM deployment)
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IONOS AI Model Hub</CardTitle>
            <CardDescription>
              AI model configuration (managed via backend)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <p>Model: <span className="font-mono">meta-llama/llama-3.1-8b-instruct</span></p>
              <p className="mt-2">API credentials are configured on the backend via environment variables.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Configuration</CardTitle>
            <CardDescription>
              IONOS S3 storage settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              S3 credentials are managed via backend environment variables for secure file uploads and PDF generation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
