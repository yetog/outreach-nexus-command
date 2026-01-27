import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, ExternalLink } from 'lucide-react';
import { Contact } from '@/lib/contactStorage';
import { format } from 'date-fns';

interface ContactTableProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

export function ContactTable({ contacts, onContactClick, onDeleteContact }: ContactTableProps) {
  const enrichmentColors = {
    pending: 'bg-warning/10 text-warning',
    completed: 'bg-success/10 text-success',
    failed: 'bg-destructive/10 text-destructive',
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No contacts found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            return (
              <TableRow
                key={contact.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onContactClick(contact)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.profilePhoto} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      {contact.position && (
                        <p className="text-xs text-muted-foreground">{contact.position}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{contact.company || '-'}</TableCell>
                <TableCell>
                  {contact.email ? (
                    <span className="text-sm">{contact.email}</span>
                  ) : '-'}
                </TableCell>
                <TableCell>{contact.phone || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {contact.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{contact.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={enrichmentColors[contact.enrichmentStatus]}>
                    {contact.enrichmentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {contact.linkedinUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(contact.linkedinUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContact(contact.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
