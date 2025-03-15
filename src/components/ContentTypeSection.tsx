
import React from 'react';
import { ContentType, ContentCard } from './ContentCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  subjectId: string;
}

interface ContentTypeSectionProps {
  title: string;
  type: ContentType;
  items: ContentItem[];
  subjectId: string;
}

export const ContentTypeSection = ({ title, type, items, subjectId }: ContentTypeSectionProps) => {
  if (items.length === 0) return null;
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link 
          to={`/subjects/${subjectId}/${type}`} 
          className="flex items-center text-sm text-primary hover:underline"
        >
          View all <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 3).map((item) => (
          <ContentCard 
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            type={item.type}
            subjectId={subjectId}
          />
        ))}
      </div>
    </section>
  );
};
