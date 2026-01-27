import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, Phone, Building, MapPin, Linkedin, Tag, 
  Calendar, DollarSign, PhoneCall, Edit2, Save, X,
  Clock
} from 'lucide-react';
import { Contact, contactStorage } from '@/lib/contactStorage';
import { dealStorage, Deal } from '@/lib/dealStorage';
import { callLogStorage, CallLog } from '@/lib/callLogStorage';
import { taskStorage, Task } from '@/lib/taskStorage';
import { format } from 'date-fns';

interface ContactDetailProps {
  contactId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function ContactDetail({ contactId, open, onOpenChange, onUpdate }: ContactDetailProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Contact>>({});
  const [linkedDeals, setLinkedDeals] = useState<Deal[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (contactId && open) {
      const c = contactStorage.getById(contactId);
      setContact(c);
      setEditData(c || {});
      
      // Load linked data
      if (c) {
        const allDeals = dealStorage.getAll();
        setLinkedDeals(allDeals.filter(d => 
          d.contactId === contactId || 
          d.contactName.toLowerCase() === c.name.toLowerCase()
        ));
        
        setCallLogs(callLogStorage.getByContactId(contactId));
        
        const allTasks = taskStorage.getAll();
        setLinkedTasks(allTasks.filter(t => t.linkedContactId === contactId));
      }
    }
  }, [contactId, open]);

  const handleSave = () => {
    if (!contactId) return;
    contactStorage.update(contactId, editData);
    setContact(contactStorage.getById(contactId));
    setIsEditing(false);
    onUpdate?.();
  };

  const handleCancel = () => {
    setEditData(contact || {});
    setIsEditing(false);
  };

  if (!contact) return null;

  const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.profilePhoto} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl">{contact.name}</SheetTitle>
              {contact.headline && (
                <SheetDescription className="mt-1">{contact.headline}</SheetDescription>
              )}
              {contact.company && (
                <p className="text-sm text-muted-foreground mt-1">
                  {contact.position && `${contact.position} at `}{contact.company}
                </p>
              )}
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit2 className="h-4 w-4 mr-1" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            {isEditing && (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="deals">Deals ({linkedDeals.length})</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="details" className="mt-0 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editData.company || ''}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editData.position || ''}
                      onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editData.location || ''}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                  {contact.linkedinUrl && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-4 w-4 text-info" />
                      <a
                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                      {contact.connectionDegree && (
                        <Badge variant="outline">{contact.connectionDegree}</Badge>
                      )}
                    </div>
                  )}

                  {contact.tags.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {contact.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </>
                  )}

                  {contact.notes && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-muted-foreground">Notes</Label>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{contact.notes}</p>
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Added: {format(new Date(contact.createdAt), 'PPp')}</p>
                    <p>Updated: {format(new Date(contact.updatedAt), 'PPp')}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-0 space-y-4">
              {callLogs.length === 0 && linkedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PhoneCall className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No activity recorded yet</p>
                  <p className="text-sm">Log calls and create tasks to track interactions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {callLogs.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Call History</h4>
                      {callLogs.map((log) => (
                        <div key={log.id} className="border rounded-md p-3 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PhoneCall className="h-4 w-4 text-primary" />
                              <Badge variant="secondary">{log.outcome}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(log.createdAt), 'PPp')}
                            </span>
                          </div>
                          {log.summary && (
                            <p className="text-sm mt-2">{log.summary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {linkedTasks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tasks</h4>
                      {linkedTasks.map((task) => (
                        <div key={task.id} className="border rounded-md p-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                              {task.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(task.dueDate), 'PP')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deals" className="mt-0 space-y-4">
              {linkedDeals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No deals linked to this contact</p>
                  <p className="text-sm">Create a deal from the Deals page</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {linkedDeals.map((deal) => (
                    <div key={deal.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{deal.company}</span>
                        <Badge>{deal.stage}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <span>${deal.value.toLocaleString()}</span>
                        <span>{deal.lastActivity}</span>
                      </div>
                      {deal.nextStep && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          Next: {deal.nextStep}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
