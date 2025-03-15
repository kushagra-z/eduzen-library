
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlayCircle, FileQuestion, Book, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContentType = 'pdf' | 'video' | 'test' | 'notes' | 'worksheet';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  subjectId: string;
}

export const ContentCard = ({ id, title, description, type, subjectId }: ContentCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <PlayCircle className="h-5 w-5" />;
      case 'test':
        return <FileQuestion className="h-5 w-5" />;
      case 'notes':
        return <Book className="h-5 w-5" />;
      case 'worksheet':
        return <FileSpreadsheet className="h-5 w-5" />;
    }
  };

  const getLink = () => {
    switch (type) {
      case 'pdf':
      case 'notes':
      case 'worksheet':
        return `/subjects/${subjectId}/document/${id}`;
      case 'video':
        return `/subjects/${subjectId}/video/${id}`;
      case 'test':
        return `/subjects/${subjectId}/test/${id}`;
    }
  };

  const getTypeColors = () => {
    switch (type) {
      case 'pdf':
        return 'bg-red-500/10 text-red-500';
      case 'video':
        return 'bg-purple-500/10 text-purple-500';
      case 'test':
        return 'bg-amber-500/10 text-amber-500';
      case 'notes':
        return 'bg-green-500/10 text-green-500';
      case 'worksheet':
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <Link 
      to={getLink()}
      className="glass-card hover-card group rounded-lg p-4 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2 rounded-md", getTypeColors())}>
          {getIcon()}
        </div>
        <span className="text-xs uppercase font-semibold text-muted-foreground">
          {type}
        </span>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Link>
  );
};
