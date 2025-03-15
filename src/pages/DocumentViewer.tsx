
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/PDFViewer';
import { EmptyState } from '@/components/EmptyState';

// Mock data - In a real app, this would be fetched from Supabase
const MOCK_DOCUMENTS = {
  'eng-pdf-1': {
    title: 'First Flight Textbook',
    description: 'Complete NCERT textbook for Class 10 English',
    url: 'https://ncert.nic.in/textbook/pdf/jeff1dd.zip', // Example URL
    subject: 'english'
  },
  'eng-pdf-2': {
    title: 'Footprints without Feet',
    description: 'Supplementary reader for Class 10 English',
    url: 'https://ncert.nic.in/textbook/pdf/jefp1dd.zip', // Example URL
    subject: 'english'
  },
  'eng-notes-1': {
    title: 'Grammar Notes',
    description: 'Comprehensive notes on English grammar',
    url: 'https://www.exampleurl.com/documents/grammar-notes.pdf', // Placeholder
    subject: 'english'
  },
  'math-pdf-1': {
    title: 'Mathematics NCERT',
    description: 'Complete mathematics textbook with all chapters',
    url: 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip', // Example URL
    subject: 'mathematics'
  },
  'math-notes-1': {
    title: 'Algebraic Expressions',
    description: 'Detailed notes on solving algebraic expressions',
    url: 'https://www.exampleurl.com/documents/algebra-notes.pdf', // Placeholder
    subject: 'mathematics'
  },
  'math-notes-2': {
    title: 'Trigonometry Formulas',
    description: 'All important formulas and identities',
    url: 'https://www.exampleurl.com/documents/trig-formulas.pdf', // Placeholder
    subject: 'mathematics'
  },
};

// Placeholder PDF URL for demo purposes
const PLACEHOLDER_PDF = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

const DocumentViewer = () => {
  const { subjectId, documentId } = useParams<{ subjectId: string; documentId: string }>();
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching document from backend
    setTimeout(() => {
      if (documentId && MOCK_DOCUMENTS[documentId as keyof typeof MOCK_DOCUMENTS]) {
        setDocument(MOCK_DOCUMENTS[documentId as keyof typeof MOCK_DOCUMENTS]);
      }
      setLoading(false);
    }, 1000);
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
          url={PLACEHOLDER_PDF} // Using placeholder for demo
          title={document.title}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
