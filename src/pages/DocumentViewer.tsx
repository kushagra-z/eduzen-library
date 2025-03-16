
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/PDFViewer';
import { EmptyState } from '@/components/EmptyState';
import { dataService, ContentItem } from '@/services/dataService';

// Placeholder PDF URL for demo purposes until file storage is implemented
const PLACEHOLDER_PDF = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

const DocumentViewer = () => {
  const { subjectId, documentId } = useParams<{ subjectId: string; documentId: string }>();
  const [document, setDocument] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      if (documentId) {
        const documentData = dataService.getContentById(documentId);
        if (documentData && ['pdf', 'notes', 'worksheet'].includes(documentData.type)) {
          setDocument(documentData);
        }
      }
      setLoading(false);
    };

    fetchDocument();
  }, [documentId]);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading document...</span>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container py-12">
        <EmptyState 
          title="Document Not Found"
          description="Sorry, we couldn't find the document you're looking for."
          action={{
            label: "Go Back",
            href: `/subjects/${subjectId}`
          }}
        />
      </div>
    );
  }

  // In a production app, this would use the document's actual URL from storage
  const documentUrl = document.url || PLACEHOLDER_PDF;

  return (
    <div className="container py-6 animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/subjects/${subjectId}`} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {subjectId}
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
        <p className="text-muted-foreground">{document.description}</p>
      </div>

      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <PDFViewer
          url={documentUrl}
          title={document.title}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
