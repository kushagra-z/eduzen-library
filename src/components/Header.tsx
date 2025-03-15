
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">
            Edu<span className="text-primary">Zen</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};
