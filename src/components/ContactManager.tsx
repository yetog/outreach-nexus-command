import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, Building, Linkedin, MapPin, Tag, Trash2 } from 'lucide-react';
import { contactStorage, Contact } from '@/lib/contactStorage';
import { LinkedInImport } from './LinkedInImport';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    linkedinUrl: '',
    notes: '',
  });

  const loadContacts = () => {
    setContacts(contactStorage.getAll());
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    
    contactStorage.create({
      ...newContact,
      tags: [],
      enrichmentStatus: 'pending',
    });
    
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      linkedinUrl: '',
      notes: '',
    });
    setIsAddDialogOpen(false);
    loadContacts();
  };

  const handleDeleteContact = (id: string) => {
    contactStorage.delete(id);
    loadContacts();
  };

  const filteredContacts = searchQuery
    ? contactStorage.search(searchQuery)
    : contacts;

  const enrichmentColors = {
    pending: 'bg-warning/10 text-warning',
    completed: 'bg-success/10 text-success',
    failed: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contacts</h2>
          <p className="text-muted-foreground">{contacts.length} contacts in your CRM</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Add a contact manually to your CRM</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  placeholder="ACME Corp"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newContact.position}
                  onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                  placeholder="CEO"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={newContact.linkedinUrl}
                  onChange={(e) => setNewContact({ ...newContact, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddContact} className="w-full" disabled={!newContact.name.trim()}>
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <LinkedInImport onImportComplete={loadContacts} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>Search and manage your contacts</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="border-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.profilePhoto} />
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{contact.name}</h4>
                            {contact.headline && (
                              <p className="text-sm text-muted-foreground">{contact.headline}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={enrichmentColors[contact.enrichmentStatus]}>
                              {contact.enrichmentStatus}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                          {contact.company && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="h-3 w-3" />
                              <span>{contact.company}</span>
                              {contact.position && <span>• {contact.position}</span>}
                            </div>
                          )}
                          {contact.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{contact.location}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.linkedinUrl && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="h-3 w-3 text-info" />
                              <a
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-info hover:underline"
                              >
                                View Profile
                              </a>
                              {contact.connectionDegree && (
                                <Badge variant="outline" className="text-xs">
                                  {contact.connectionDegree}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {contact.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            {contact.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
