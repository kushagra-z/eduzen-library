
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const SubjectCard = ({ id, title, description, icon, color }: SubjectCardProps) => {
  return (
    <Link 
      to={`/subjects/${id}`}
      className="glass-card hover-card group rounded-lg p-6 flex flex-col h-full"
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm flex-1">{description}</p>
      <div className="mt-4 flex items-center text-primary text-sm font-medium">
        Explore 
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};
