import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, DollarSign, Calendar, User, Building, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Deal {
  id: string;
  contactName: string;
  company: string;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  value: number;
  priority: 'low' | 'medium' | 'high';
  nextStep: string;
  lastActivity: string;
  createdAt: string;
}

const DEAL_STAGES = [
  { value: 'discovery', label: 'Discovery', color: 'bg-info' },
  { value: 'proposal', label: 'Proposal', color: 'bg-warning' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { value: 'closing', label: 'Closing', color: 'bg-xp-primary' },
  { value: 'won', label: 'Won', color: 'bg-success' },
  { value: 'lost', label: 'Lost', color: 'bg-destructive' },
] as const;

const PRIORITY_COLORS = {
  low: 'secondary' as const,
  medium: 'secondary' as const,
  high: 'destructive' as const,
};

export const DealsManager = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      contactName: 'John Smith',
      company: 'Acme Corp',
      stage: 'proposal',
      value: 25000,
      priority: 'high',
      nextStep: 'Follow up on proposal feedback',
      lastActivity: '2 days ago',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      contactName: 'Sarah Johnson',
      company: 'TechStart Inc',
      stage: 'discovery',
      value: 15000,
      priority: 'medium',
      nextStep: 'Schedule demo call',
      lastActivity: '1 day ago',
      createdAt: '2024-01-18',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<{
    contactName: string;
    company: string;
    stage: Deal['stage'];
    value: string;
    priority: Deal['priority'];
    nextStep: string;
  }>({
    contactName: '',
    company: '',
    stage: 'discovery',
    value: '',
    priority: 'medium',
    nextStep: '',
  });

  const handleCreateDeal = () => {
    if (!newDeal.contactName || !newDeal.company || !newDeal.value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const deal: Deal = {
      id: Date.now().toString(),
      contactName: newDeal.contactName,
      company: newDeal.company,
      stage: newDeal.stage,
      value: parseFloat(newDeal.value),
      priority: newDeal.priority,
      nextStep: newDeal.nextStep,
      lastActivity: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDeals([...deals, deal]);
    setNewDeal({
      contactName: '',
      company: '',
      stage: 'discovery',
      value: '',
      priority: 'medium',
      nextStep: '',
    });
    setIsDialogOpen(false);

    toast({
      title: "Deal Created",
      description: `New deal for ${deal.company} created successfully.`,
    });
  };

  const handleStageChange = (dealId: string, newStage: Deal['stage']) => {
    setDeals(deals.map(deal => 
      deal.id === dealId 
        ? { ...deal, stage: newStage, lastActivity: 'Just now' }
        : deal
    ));

    toast({
      title: "Stage Updated",
      description: `Deal stage moved to ${DEAL_STAGES.find(s => s.value === newStage)?.label}.`,
    });
  };

  const getStageBadgeColor = (stage: Deal['stage']) => {
    return DEAL_STAGES.find(s => s.value === stage)?.color || 'bg-secondary';
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = deals.filter(deal => !['won', 'lost'].includes(deal.stage));
  const wonDeals = deals.filter(deal => deal.stage === 'won');

  return (
    <div className="space-y-6">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {activeDeals.length} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
            <ArrowRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              ${wonDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${deals.length > 0 ? Math.round(totalValue / deals.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {deals.length} deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {wonDeals.length} of {deals.length} deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deal Pipeline</CardTitle>
              <CardDescription>
                Manage your sales opportunities and track progress
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Deal</DialogTitle>
                  <DialogDescription>
                    Add a new deal to your pipeline.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactName" className="text-right">
                      Contact *
                    </Label>
                    <Input
                      id="contactName"
                      value={newDeal.contactName}
                      onChange={(e) => setNewDeal({...newDeal, contactName: e.target.value})}
                      className="col-span-3"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company *
                    </Label>
                    <Input
                      id="company"
                      value={newDeal.company}
                      onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                      className="col-span-3"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value *
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                      className="col-span-3"
                      placeholder="25000"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stage" className="text-right">
                      Stage
                    </Label>
                    <Select value={newDeal.stage} onValueChange={(value) => setNewDeal({...newDeal, stage: value as Deal['stage']})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEAL_STAGES.filter(stage => !['won', 'lost'].includes(stage.value)).map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select value={newDeal.priority} onValueChange={(value) => setNewDeal({...newDeal, priority: value as Deal['priority']})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nextStep" className="text-right">
                      Next Step
                    </Label>
                    <Textarea
                      id="nextStep"
                      value={newDeal.nextStep}
                      onChange={(e) => setNewDeal({...newDeal, nextStep: e.target.value})}
                      className="col-span-3"
                      placeholder="Follow up with proposal"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateDeal}>Create Deal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Next Step</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {deal.contactName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {deal.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={deal.stage} onValueChange={(value) => handleStageChange(deal.id, value as Deal['stage'])}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEAL_STAGES.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>${deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={PRIORITY_COLORS[deal.priority]}>
                      {deal.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {deal.nextStep || 'No next step defined'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {deal.lastActivity}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};