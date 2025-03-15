
import React from 'react';
import { X, FileText, Image, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  const isDocument = file.type.includes('document') || file.type.includes('msword');
  
  // Format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  // Get icon based on file type
  const getFileIcon = () => {
    if (isImage) return <Image className="h-10 w-10 text-blue-500" />;
    if (isPdf) return <FileText className="h-10 w-10 text-red-500" />;
    if (isDocument) return <FileText className="h-10 w-10 text-blue-500" />;
    return <FileUp className="h-10 w-10 text-gray-500" />;
  };
  
  // Get background color based on file type
  const getBackgroundColor = (): string => {
    if (isImage) return 'bg-blue-50 dark:bg-blue-900/20';
    if (isPdf) return 'bg-red-50 dark:bg-red-900/20';
    if (isDocument) return 'bg-blue-50 dark:bg-blue-900/20';
    return 'bg-gray-50 dark:bg-gray-800';
  };
  
  return (
    <div className={cn('rounded-md p-3 flex items-start gap-3', getBackgroundColor())}>
      {isImage ? (
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="w-full h-full object-cover" 
          />
        </div>
      ) : (
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(file.size)}
            </p>
          </div>
          
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 flex-shrink-0"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
