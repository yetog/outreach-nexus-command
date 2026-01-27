import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Calendar, Clock, Users, Mail } from 'lucide-react';
import { campaignStorage, Campaign } from '@/lib/campaignStorage';
import { useToast } from '@/hooks/use-toast';

export const CampaignScheduler = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaign, setNewCampaign] = useState<{
    name: string;
    template: string;
    scheduleType: 'immediate' | 'scheduled' | 'drip';
    scheduledDate: string;
    dailyLimit: number;
    targetCount: number;
  }>({
    name: '',
    template: '',
    scheduleType: 'immediate',
    scheduledDate: '',
    dailyLimit: 50,
    targetCount: 0
  });

  useEffect(() => {
    setCampaigns(campaignStorage.getAll());
  }, []);

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.template) {
      campaignStorage.create({
        name: newCampaign.name,
        template: newCampaign.template,
        status: 'draft',
        targetCount: newCampaign.targetCount || 50,
        scheduleType: newCampaign.scheduleType,
        scheduledDate: newCampaign.scheduledDate,
        dailyLimit: newCampaign.dailyLimit,
      });
      
      setCampaigns(campaignStorage.getAll());
      setNewCampaign({
        name: '',
        template: '',
        scheduleType: 'immediate',
        scheduledDate: '',
        dailyLimit: 50,
        targetCount: 0
      });
      
      toast({
        title: 'Campaign Created',
        description: `Campaign "${newCampaign.name}" has been created.`,
      });
    }
  };

  const handleStartCampaign = (id: string) => {
    campaignStorage.send(id);
    setCampaigns(campaignStorage.getAll());
    toast({
      title: 'Campaign Started',
      description: 'Campaign is now running. +8 XP',
    });
  };

  const handlePauseCampaign = (id: string) => {
    campaignStorage.update(id, { status: 'paused' });
    setCampaigns(campaignStorage.getAll());
    toast({
      title: 'Campaign Paused',
      description: 'Campaign has been paused.',
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Campaign */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>
            Set up automated email campaigns with scheduling and rate limiting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name</label>
              <Input
                placeholder="Q1 2024 Tech Outreach"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Template</label>
              <Select value={newCampaign.template} onValueChange={(value) => setNewCampaign({...newCampaign, template: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold-outreach">Cold Outreach Template</SelectItem>
                  <SelectItem value="follow-up">Follow-up Template</SelectItem>
                  <SelectItem value="introduction">Introduction Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Schedule Type</label>
              <Select value={newCampaign.scheduleType} onValueChange={(value: 'immediate' | 'scheduled' | 'drip') => setNewCampaign({...newCampaign, scheduleType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Send Immediately</SelectItem>
                  <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  <SelectItem value="drip">Drip Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Daily Limit</label>
              <Input
                type="number"
                placeholder="50"
                value={newCampaign.dailyLimit}
                onChange={(e) => setNewCampaign({...newCampaign, dailyLimit: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          
          {newCampaign.scheduleType === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium mb-2">Scheduled Date & Time</label>
              <Input
                type="datetime-local"
                value={newCampaign.scheduledDate}
                onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
              />
            </div>
          )}
          
          <Button onClick={handleCreateCampaign} className="w-full md:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            Monitor and control your active email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No campaigns yet</p>
              <p className="text-sm">Create your first campaign to start sending emails</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">Template: {campaign.template}</p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {campaign.sentCount}/{campaign.targetCount} sent
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{campaign.dailyLimit}/day limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{campaign.scheduleType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" onClick={() => handleStartCampaign(campaign.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Campaign
                      </Button>
                    )}
                    {campaign.status === 'running' && (
                      <Button size="sm" variant="outline" onClick={() => handlePauseCampaign(campaign.id)}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button size="sm" onClick={() => handleStartCampaign(campaign.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
