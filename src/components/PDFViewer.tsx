import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Set workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Placeholder PDF for when no URL is provided
const PLACEHOLDER_PDF = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

interface PDFViewerProps {
  url?: string;
  title: string;
}

export const PDFViewer = ({ url, title }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);

  useEffect(() => {
    console.log('PDF URL received in PDFViewer:', url);
    
    const processPdfUrl = async () => {
      // Reset placeholder status
      setIsPlaceholder(false);
      
      if (!url || url === undefined || url === "undefined" || url.trim() === '') {
        console.log('No valid URL provided, using placeholder PDF');
        setPdfUrl(PLACEHOLDER_PDF);
        setIsPlaceholder(true);
        return;
      }
      
      try {
        // Add a timestamp to bust cache if not already present
        let finalUrl = url;
        if (!url.includes('t=')) {
          const timestamp = new Date().getTime();
          const separator = url.includes('?') ? '&' : '?';
          finalUrl = `${url}${separator}t=${timestamp}`;
          console.log('Added cache busting to URL:', finalUrl);
        }
        
        // Check if URL is a storage path
        if (url.includes('supabase.co/storage') || url.startsWith('/storage/')) {
          console.log('Processing Supabase storage URL:', url);
          
          // Extract the path from the URL if it's a full Supabase URL
          let storagePath = url;
          
          // If it's a full URL with /object/public/ in it, extract the path properly
          if (url.includes('/object/public/')) {
            const parts = url.split('/object/public/');
            if (parts.length > 1) {
              storagePath = parts[1];
              console.log('Extracted storage path:', storagePath);
            }
          }
          
          // If it's not a full URL but just a path like "/storage/v1/..."
          if (storagePath.startsWith('/storage/v1/object/public/')) {
            storagePath = storagePath.replace('/storage/v1/object/public/', '');
            console.log('Adjusted storage path:', storagePath);
          }
          
          // Remove any bucket prefix from the path
          if (storagePath.startsWith('documents/')) {
            storagePath = storagePath.replace('documents/', '');
            console.log('Removed bucket prefix from path:', storagePath);
          }
          
          // Get a fresh public URL with cache-busting timestamp
          try {
            console.log('Attempting to get fresh URL for storage path:', storagePath);
            
            const { data: storageData } = await supabase
              .storage
              .from('documents')
              .getPublicUrl(storagePath);
            
            if (storageData && storageData.publicUrl) {
              // Add cache-busting parameter
              const timestamp = new Date().getTime();
              finalUrl = `${storageData.publicUrl}?t=${timestamp}`;
              console.log('Fresh public URL with cache-busting:', finalUrl);
            } else {
              console.error('No public URL returned from Supabase');
              // Still try the original URL if we couldn't get a fresh one
            }
          } catch (err) {
            console.error('Error processing storage URL:', err);
            // Fallback to original URL
          }
        }
        
        console.log('Final PDF URL to use:', finalUrl);
        setPdfUrl(finalUrl);
      } catch (e) {
        console.error('Invalid URL format:', url, e);
        toast.error('Invalid document URL format');
        setPdfUrl(PLACEHOLDER_PDF);
        setIsPlaceholder(true);
      }
    };
    
    processPdfUrl();
  }, [url, retryCount]);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setLoading(false);
    setError(`Failed to load PDF: ${err.message}`);
    
    // Only show toast if not using placeholder already
    if (!isPlaceholder) {
      toast.error(`Failed to load PDF: ${err.message}`);
    }
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const retryLoading = () => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-destructive mb-2">No document URL provided</p>
        <p className="text-sm text-muted-foreground">Please provide a valid PDF URL</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-secondary p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-medium truncate">
          {title}
          {isPlaceholder && <span className="text-destructive ml-2">(Placeholder)</span>}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {pageNumber} / {numPages || '?'}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => goToPrevPage()}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => goToNextPage()}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => zoomOut()}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => zoomIn()}
            disabled={scale >= 2.5}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-background rounded-b-lg flex justify-center">
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        )}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-destructive mb-2">{error || 'Failed to load PDF'}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {!url ? 'No document URL provided.' : 'The document may be invalid or inaccessible.'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.open(pdfUrl, '_blank')}>
                  Open in new tab
                </Button>
                <Button variant="secondary" onClick={() => {
                  setError(null);
                  setLoading(true);
                  setRetryCount(prev => prev + 1);
                }}>
                  Retry
                </Button>
              </div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="pdf-page shadow-md"
            scale={scale}
            width={Math.min(window.innerWidth - 40, 800)}
          />
        </Document>
      </div>
    </div>
  );
};
