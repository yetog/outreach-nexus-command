import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Plus } from 'lucide-react';
import jsPDF from 'jspdf';

interface LineItem { description: string; price: string; }

export const QuoteGenerator: React.FC = () => {
  const [template, setTemplate] = React.useState<'recap' | 'formal'>('recap');
  const [customer, setCustomer] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [items, setItems] = React.useState<LineItem[]>([{ description: '', price: '' }]);
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  const addItem = () => setItems((arr) => [...arr, { description: '', price: '' }]);
  const updateItem = (i: number, key: keyof LineItem, val: string) => setItems(arr => arr.map((it, idx) => idx === i ? { ...it, [key]: val } : it));

  const generatePdf = () => {
    const doc = new jsPDF();
    const total = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0), 0);

    doc.setFontSize(16);
    doc.text('Quote', 20, 20);
    doc.setFontSize(11);
    doc.text(`Template: ${template === 'recap' ? 'Discovery Recap' : 'Formal Quote'}`, 20, 30);
    doc.text(`Customer: ${customer}`, 20, 38);
    doc.text(`Company: ${company}`, 20, 46);

    let y = 60;
    doc.text('Items:', 20, y); y += 8;
    items.forEach((it, idx) => {
      doc.text(`${idx + 1}. ${it.description} — $${it.price || '0.00'}`, 26, y);
      y += 8;
    });

    y += 4;
    doc.text(`Notes: ${notes}`, 20, y); y += 12;
    doc.text(`Total: $${total.toFixed(2)}`, 20, y);

    doc.save(`quote_${company || 'client'}.pdf`);
    toast({ title: 'PDF generated', description: 'Your quote has been downloaded.' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote Generator</CardTitle>
          <CardDescription>Create a quick quote PDF from a template.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Template</label>
              <Select value={template} onValueChange={(v) => setTemplate(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recap">Discovery Recap</SelectItem>
                  <SelectItem value="formal">Formal Quote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Customer</label>
              <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Line Items</span>
              <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <Input className="col-span-3" placeholder="Description" value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
                  <Input className="col-span-1" type="number" placeholder="Price" value={it.price} onChange={(e) => updateItem(i, 'price', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes / Terms</label>
            <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, delivery timeline, etc." />
          </div>

          <Button onClick={generatePdf}><FileDown className="h-4 w-4 mr-2" /> Generate PDF</Button>
        </CardContent>
      </Card>
    </div>
  );
};
