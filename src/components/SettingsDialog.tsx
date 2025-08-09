import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

export const SettingsDialog: React.FC = () => {
  const { backendUrl, setBackendUrl } = useAppSettings();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState(backendUrl);
  const { toast } = useToast();

  React.useEffect(() => setUrl(backendUrl), [backendUrl]);

  const handleSave = () => {
    setBackendUrl(url.trim());
    toast({ title: 'Settings saved', description: 'Backend API URL updated.' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open settings">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Application Settings</DialogTitle>
          <DialogDescription>Configure your backend connection.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backendUrl" className="text-right">Backend API URL</Label>
            <Input id="backendUrl" className="col-span-3" placeholder="https://api.yourdomain.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
