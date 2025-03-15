
import React from 'react';
import { Link } from 'react-router-dom';
import { SubjectCard } from '@/components/SubjectCard';
import { BookOpenText, FlaskConical, Languages, Calculator, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SUBJECTS = [
  {
    id: 'english',
    title: 'English',
    description: 'Literature, Grammar, Writing Skills',
    icon: <BookOpenText className="h-6 w-6 text-white" />,
    color: 'bg-blue-600'
  },
  {
    id: 'hindi',
    title: 'Hindi',
    description: 'व्याकरण, साहित्य, लेखन कौशल',
    icon: <Languages className="h-6 w-6 text-white" />,
    color: 'bg-red-600'
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Algebra, Geometry, Trigonometry, Statistics',
    icon: <Calculator className="h-6 w-6 text-white" />,
    color: 'bg-amber-600'
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Physics, Chemistry, Biology',
    icon: <FlaskConical className="h-6 w-6 text-white" />,
    color: 'bg-green-600'
  },
  {
    id: 'social-studies',
    title: 'Social Studies',
    description: 'History, Geography, Political Science, Economics',
    icon: <BookOpen className="h-6 w-6 text-white" />,
    color: 'bg-purple-600'
  }
];

const HomePage = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">
          CBSE Class 10 Learning Resources
        </h1>
        <p className="text-xl text-muted-foreground">
          Access comprehensive study materials, tests, and resources to excel in your Class 10 CBSE exams
        </p>
        <div className="mt-6">
          <Link to="/admin-login">
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Admin Area
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <SubjectCard 
            key={subject.id}
            id={subject.id}
            title={subject.title}
            description={subject.description}
            icon={subject.icon}
            color={subject.color}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
