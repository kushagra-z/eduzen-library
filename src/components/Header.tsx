import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Learning Resources</h1>
      <nav>
        <Link to="/admin-login">
          <Button variant="outline" size="sm">
            Admin Area
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
