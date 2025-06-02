import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Plus, Filter, Users } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  tags: string[];
  status: 'active' | 'contacted' | 'replied' | 'unsubscribed';
  dateAdded: string;
}

export const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('CSV file selected:', file.name);
      // TODO: Implement CSV parsing logic
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || contact.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Management</CardTitle>
          <CardDescription>
            Import, organize, and manage your outreach contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <label htmlFor="csv-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </span>
                </Button>
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-medium text-sm border-b">
              <div>Name</div>
              <div>Email</div>
              <div>Company</div>
              <div>Tags</div>
              <div>Status</div>
            </div>
            
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No contacts yet</p>
                <p className="text-sm">Import a CSV file or add contacts manually to get started</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-gray-50">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-gray-600">{contact.email}</div>
                  <div className="text-gray-600">{contact.company || '-'}</div>
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Badge 
                      variant={contact.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {contact.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
