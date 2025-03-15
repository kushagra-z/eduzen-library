
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export const EmptyState = ({
  title,
  description,
  icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-[50vh]">
      <div className="rounded-full bg-muted p-4 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button asChild>
          <Link to={action.href}>
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};
