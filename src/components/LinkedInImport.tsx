import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { contactStorage, LinkedInProfileData } from '@/lib/contactStorage';
import { Upload, FileText, Users, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkedInImportProps {
  onImportComplete?: (count: number) => void;
}

export function LinkedInImport({ onImportComplete }: LinkedInImportProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleJsonImport = () => {
    setIsImporting(true);
    try {
      const profiles: LinkedInProfileData[] = JSON.parse(jsonInput);
      if (!Array.isArray(profiles)) {
        throw new Error('JSON must be an array of profiles');
      }

      const imported = contactStorage.importFromLinkedIn(profiles);
      toast({
        title: 'Import Successful',
        description: `Imported ${imported.length} new contacts from LinkedIn`,
      });
      setJsonInput('');
      onImportComplete?.(imported.length);
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Invalid JSON format',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;

    setIsImporting(true);
    try {
      const text = await csvFile.text();
      const imported = contactStorage.importFromCSV(text);
      
      toast({
        title: 'Import Successful',
        description: `Imported ${imported.length} new contacts from CSV`,
      });
      setCsvFile(null);
      onImportComplete?.(imported.length);
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to parse CSV',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    const csv = contactStorage.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Successful',
      description: 'Contacts exported to CSV',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          LinkedIn Import
        </CardTitle>
        <CardDescription>
          Import contacts from LinkedIn or export your existing contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">Paste LinkedIn Profile Data (JSON)</Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`[\n  {\n    "name": "John Doe",\n    "headline": "CEO at ACME Corp",\n    "profileUrl": "https://linkedin.com/in/johndoe",\n    "currentCompany": "ACME Corp",\n    "currentPosition": "CEO",\n    "email": "john@acme.com"\n  }\n]`}
                className="font-mono text-xs min-h-[200px]"
              />
            </div>
            <Button 
              onClick={handleJsonImport} 
              disabled={!jsonInput.trim() || isImporting}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? 'Importing...' : 'Import from JSON'}
            </Button>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                CSV should have columns: Name, Email, Company, Position, LinkedIn URL, Location
              </p>
            </div>
            <Button 
              onClick={handleCsvImport} 
              disabled={!csvFile || isImporting}
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isImporting ? 'Importing...' : 'Import from CSV'}
            </Button>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Export all your contacts to a CSV file for backup or use in other tools.
              </p>
            </div>
            <Button onClick={handleExport} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Contacts to CSV
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="text-sm font-semibold mb-2">💡 How to scrape LinkedIn profiles:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Use a LinkedIn scraper tool or browser extension</li>
            <li>Export profiles as JSON or CSV</li>
            <li>Paste the data here or upload the CSV file</li>
            <li>Contacts will be automatically deduplicated</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
