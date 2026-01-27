import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactStorage } from '@/lib/contactStorage';
import { useToast } from '@/hooks/use-toast';

interface QuickImportProps {
  onImportComplete?: () => void;
  className?: string;
}

export function QuickImport({ onImportComplete, className }: QuickImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setImportedCount(null);

    try {
      const text = await file.text();
      let imported: any[] = [];

      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        const profiles = Array.isArray(data) ? data : [data];
        imported = contactStorage.importFromLinkedIn(profiles);
      } else if (file.name.endsWith('.csv')) {
        imported = contactStorage.importFromCSV(text);
      } else {
        toast({
          title: 'Unsupported file type',
          description: 'Please upload a CSV or JSON file.',
          variant: 'destructive',
        });
        return;
      }

      setImportedCount(imported.length);
      toast({
        title: 'Import Successful',
        description: `${imported.length} contact${imported.length !== 1 ? 's' : ''} imported. +${imported.length * 12} XP`,
      });
      onImportComplete?.();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: 'Could not parse the file. Please check the format.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        isProcessing && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center text-center gap-3">
        {importedCount !== null ? (
          <>
            <CheckCircle2 className="h-10 w-10 text-success" />
            <div>
              <p className="font-medium text-foreground">
                {importedCount} contact{importedCount !== 1 ? 's' : ''} imported!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drop another file or click to import more
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              {isDragging ? (
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragging ? 'Drop your file here' : 'Import Contacts'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop a CSV or JSON file, or click to browse
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
