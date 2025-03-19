
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/PDFViewer';
import { EmptyState } from '@/components/EmptyState';
import { dataService, ContentItem } from '@/services/dataService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DocumentViewer = () => {
  const { subjectId, documentId } = useParams<{ subjectId: string; documentId: string }>();
  const [document, setDocument] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        if (!documentId) {
          toast.error('No document ID provided');
          setLoading(false);
          return;
        }
        
        console.log('Fetching document with ID:', documentId);
        
        // Check if the ID looks like a UUID or our custom format
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId);
        
        if (!isUuid) {
          console.log('Document ID is not a UUID, using local data source');
          // For custom IDs, use local data source
          const localDocuments = await dataService.getContentBySubject(subjectId || '');
          const localDoc = localDocuments.find(item => item.id === documentId);
          
          if (localDoc) {
            setDocument(localDoc);
          } else {
            toast.error('Document not found in local data');
          }
          setLoading(false);
          return;
        }
        
        // Try to get content from Supabase directly
        let documentData = await dataService.getContentById(documentId);
        
        console.log('Document data fetched:', documentData);
        
        if (documentData && ['pdf', 'notes', 'worksheet'].includes(documentData.type)) {
          console.log('Document URL from database:', documentData.url);
          
          if (!documentData.url || documentData.url.trim() === '') {
            console.log('Document has no URL in database');
            
            // If the document has a storage path but no URL, attempt to get a public URL
            if (documentData.storagePath) {
              console.log('Document has storage path, attempting to get public URL:', documentData.storagePath);
              try {
                // Remove any bucket prefix to prevent path duplication
                let storagePath = documentData.storagePath;
                if (storagePath.startsWith('documents/')) {
                  storagePath = storagePath.replace('documents/', '');
                  console.log('Removed bucket prefix from path:', storagePath);
                }
                
                const { data: storageData } = await supabase
                  .storage
                  .from('documents')
                  .getPublicUrl(storagePath);
                
                if (storageData && storageData.publicUrl) {
                  console.log('Retrieved public URL:', storageData.publicUrl);
                  documentData.url = storageData.publicUrl;
                } else {
                  console.error('No public URL returned from storage');
                  toast.error('Could not retrieve document URL from storage');
                }
              } catch (storageError) {
                console.error('Error getting public URL:', storageError);
                toast.error('Could not retrieve document URL from storage');
              }
            } else {
              console.error('Document has no URL or storage path');
              toast.error('Document has no URL or storage path');
            }
          }
          
          setDocument(documentData);
        } else {
          console.error('Document not found or not of correct type');
          toast.error('Document not found or has an invalid format');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, subjectId]);

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

  // Log the document URL for debugging
  console.log('Rendering document with URL:', document?.url);

  return (
    <div className="container py-6 animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/subjects/${subjectId}`} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {subjectId}
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{document?.title}</h1>
        <p className="text-muted-foreground">{document?.description}</p>
      </div>

      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <PDFViewer
          url={document?.url}
          title={document?.title || 'Document'}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
