import React from 'react';
export const Footer = () => {
  return <footer className="border-t bg-background">
      <div className="container py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduZen - CBSE Class 10 Learning Platform
          </div>
          <div className="text-sm text-muted-foreground">Created By Kushagra Kaushal

        </div>
        </div>
      </div>
    </footer>;
};