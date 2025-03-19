
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
        
        // Always try to get content from Supabase first
        try {
          console.log('Attempting to fetch document from Supabase');
          
          const { data: supabaseData, error } = await supabase
            .from('content')
            .select('*')
            .eq('id', documentId)
            .maybeSingle();
          
          if (error) {
            console.error('Supabase query error:', error);
          }
          
          // If we found the document in Supabase
          if (supabaseData) {
            console.log('Document found in Supabase:', supabaseData);
            
            let fileUrl = supabaseData.file_url || supabaseData.external_link;
            
            // If the document has a storage path, get a fresh public URL
            if (supabaseData.storage_path) {
              console.log('Document has storage path, getting public URL:', supabaseData.storage_path);
              
              // Remove any bucket prefix to prevent path duplication
              let storagePath = supabaseData.storage_path;
              if (storagePath.startsWith('documents/')) {
                storagePath = storagePath.replace('documents/', '');
              }
              
              // Add timestamp to bust cache
              const timestamp = new Date().getTime();
              
              const { data: storageData } = await supabase
                .storage
                .from('documents')
                .getPublicUrl(storagePath);
              
              if (storageData && storageData.publicUrl) {
                fileUrl = `${storageData.publicUrl}?t=${timestamp}`;
                console.log('Retrieved public URL with cache busting:', fileUrl);
              }
            } else if (fileUrl) {
              // Add cache busting to existing URL
              const timestamp = new Date().getTime();
              const separator = fileUrl.includes('?') ? '&' : '?';
              fileUrl = `${fileUrl}${separator}t=${timestamp}`;
              console.log('Added cache busting to existing URL:', fileUrl);
            }
            
            // Create a ContentItem from the Supabase data
            const documentData: ContentItem = {
              id: supabaseData.id,
              title: supabaseData.title,
              description: supabaseData.description,
              type: supabaseData.content_type as any,
              subjectId: supabaseData.subject,
              url: fileUrl,
              storagePath: supabaseData.storage_path,
              createdAt: supabaseData.created_at,
              updatedAt: supabaseData.updated_at
            };
            
            setDocument(documentData);
            setLoading(false);
            return;
          }
        } catch (supabaseError) {
          console.error('Error fetching from Supabase:', supabaseError);
        }
        
        // Fallback to data service which will try both Supabase and local storage
        console.log('Falling back to data service getContentById');
        const documentData = await dataService.getContentById(documentId);
        
        if (documentData) {
          console.log('Document found via data service:', documentData);
          
          // If the document URL is missing or invalid, try to get a fresh URL
          if (!documentData.url || documentData.url.trim() === '' || documentData.url === 'undefined') {
            if (documentData.storagePath) {
              try {
                let storagePath = documentData.storagePath;
                if (storagePath.startsWith('documents/')) {
                  storagePath = storagePath.replace('documents/', '');
                }
                
                const timestamp = new Date().getTime();
                
                const { data: storageData } = await supabase
                  .storage
                  .from('documents')
                  .getPublicUrl(storagePath);
                
                if (storageData && storageData.publicUrl) {
                  documentData.url = `${storageData.publicUrl}?t=${timestamp}`;
                  console.log('Retrieved public URL with timestamp:', documentData.url);
                  
                  // Update the database record with the fresh URL
                  await dataService.updateContent(documentId, { url: documentData.url });
                }
              } catch (storageError) {
                console.error('Error getting public URL:', storageError);
              }
            }
          } else {
            // Add cache busting to existing URL
            const timestamp = new Date().getTime();
            const separator = documentData.url.includes('?') ? '&' : '?';
            documentData.url = `${documentData.url}${separator}t=${timestamp}`;
          }
          
          setDocument(documentData);
        } else {
          // If still not found, check local data by subject ID as last resort
          console.log('Document not found in Supabase or data service, checking local data by subject');
          if (subjectId) {
            const localDocuments = await dataService.getContentBySubject(subjectId);
            const localDoc = localDocuments.find(item => item.id === documentId);
            
            if (localDoc) {
              console.log('Found document in local subject data:', localDoc);
              setDocument(localDoc);
            } else {
              console.error('Document not found in any data source');
              toast.error('Document not found');
            }
          } else {
            console.error('No subject ID to try local lookup');
            toast.error('Document not found and no subject ID available');
          }
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
