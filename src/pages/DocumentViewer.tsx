
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
        
        // Check if the ID follows the custom format pattern (e.g., "english-pdf-1742375759451")
        const isCustomFormat = /^[a-z]+-[a-z]+-\d+$/i.test(documentId);
        console.log('Document ID appears to be in custom format:', isCustomFormat);
        
        // Try all possible sources regardless of ID format
        let documentData: ContentItem | undefined = undefined;
        
        // 1. Try getting subject content first (works better for direct links)
        if (subjectId) {
          console.log('Fetching all content for subject:', subjectId);
          const subjectContent = await dataService.getContentBySubject(subjectId);
          documentData = subjectContent.find(item => item.id === documentId);
          
          if (documentData) {
            console.log('Found document in subject content:', documentData);
          }
        }
        
        // 2. If not found, try Supabase for both UUID and custom format
        if (!documentData) {
          try {
            console.log('Attempting direct Supabase query for document ID:', documentId);
            
            // Try exact match first (works for both UUID and non-UUID if stored in Supabase)
            const { data: supabaseData, error } = await supabase
              .from('content')
              .select('*')
              .eq('id', documentId)
              .maybeSingle();
            
            if (error) {
              console.error('Supabase query error:', error);
            }
            
            if (supabaseData) {
              console.log('Document found in Supabase by direct ID match:', supabaseData);
              
              let fileUrl = supabaseData.file_url || supabaseData.external_link;
              
              if (supabaseData.storage_path) {
                console.log('Document has storage path, getting public URL:', supabaseData.storage_path);
                
                let storagePath = supabaseData.storage_path;
                if (storagePath.startsWith('documents/')) {
                  storagePath = storagePath.replace('documents/', '');
                }
                
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
                const timestamp = new Date().getTime();
                const separator = fileUrl.includes('?') ? '&' : '?';
                fileUrl = `${fileUrl}${separator}t=${timestamp}`;
              }
              
              documentData = {
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
            }
          } catch (supabaseError) {
            console.error('Error fetching from Supabase:', supabaseError);
          }
        }
        
        // 3. If still not found, try dataService as a last resort
        if (!documentData) {
          console.log('Trying dataService.getContentById as last resort');
          documentData = await dataService.getContentById(documentId);
          
          if (documentData) {
            console.log('Document found via dataService.getContentById:', documentData);
            
            // If URL is missing, try to retrieve it from storage
            if (!documentData.url || documentData.url === 'undefined' || documentData.url.trim() === '') {
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
                  }
                } catch (error) {
                  console.error('Error getting storage URL:', error);
                }
              }
            } else {
              // Add cache busting to existing URL
              const timestamp = new Date().getTime();
              const separator = documentData.url.includes('?') ? '&' : '?';
              documentData.url = `${documentData.url}${separator}t=${timestamp}`;
            }
          }
        }
        
        if (documentData) {
          console.log('Final document data to display:', documentData);
          setDocument(documentData);
        } else {
          console.error('Document not found in any data source');
          toast.error('Document not found in any data source');
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
