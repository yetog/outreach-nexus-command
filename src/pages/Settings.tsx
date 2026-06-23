import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, AlertTriangle, Trash2, LogOut, Cloud, RefreshCw } from 'lucide-react';
import { resetDemoData, clearAllData } from '@/lib/demoData';
import { useAuth } from '@/context/AuthContext';
import { cloudSync } from '@/lib/cloudSync';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { backendUrl, setBackendUrl } = useAppSettings();
  const [url, setUrl] = useState(backendUrl);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const handleSave = () => {
    setBackendUrl(url.trim());
    toast({ title: 'Settings saved', description: 'Backend API URL has been updated.' });
  };

  const handleResetDemo = async () => {
    resetDemoData();
    await cloudSync.pushAll();
    toast({ title: 'Demo Reset Complete', description: 'All data has been reset to demo defaults.' });
    window.location.reload();
  };

  const handleClearAll = async () => {
    clearAllData();
    await cloudSync.clearCloud();
    toast({ title: 'Data Cleared', description: 'All data has been removed. Start fresh!' });
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await cloudSync.pushAll();
      toast({ title: 'Synced', description: 'All local data pushed to the cloud.' });
    } finally {
      setSyncing(false);
    }
  };

  const handlePullSync = async () => {
    setSyncing(true);
    try {
      await cloudSync.pullAll();
      toast({ title: 'Pulled', description: 'Latest cloud data loaded.' });
      window.location.reload();
    } finally {
      setSyncing(false);
    }
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
            <CardTitle>Account</CardTitle>
            <CardDescription>You are signed in to Outreach Nexus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Cloud Sync
            </CardTitle>
            <CardDescription>
              Your data lives in the cloud and is mirrored locally for speed. Every change syncs automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleForceSync} disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Push local → cloud
              </Button>
              <Button variant="outline" onClick={handlePullSync} disabled={syncing}>
                <Cloud className="h-4 w-4 mr-2" />
                Pull cloud → local
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use these if you switched devices and want to force a sync, or if something looks out of date.
            </p>
          </CardContent>
        </Card>

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

        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-warning" />
              Demo Mode
            </CardTitle>
            <CardDescription>
              Reset to demo data for showcasing features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will clear all your current data and replace it with sample demo data (contacts, deals, tasks, templates). 
              Useful for demos or exploring features.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Load Demo Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Load Demo Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will replace all your current data with sample demo data. 
                    Your existing contacts, deals, and other data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetDemo}>
                    Yes, Load Demo Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All Data
            </CardTitle>
            <CardDescription>
              Start fresh with an empty CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your data including contacts, deals, tasks, campaigns, and gamification progress. 
              You'll start with a completely empty CRM. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL your data:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All contacts and their history</li>
                      <li>All deals and pipeline data</li>
                      <li>All tasks and schedules</li>
                      <li>All campaigns and templates</li>
                      <li>All gamification progress (XP, badges, quests)</li>
                    </ul>
                    <p className="mt-2 font-medium">This cannot be undone.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAll} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
