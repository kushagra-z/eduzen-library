
import React, { useEffect, useState } from 'react';
import { SubjectCard } from '@/components/SubjectCard';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Book, BookOpen, Calculator, Flask, Globe } from 'lucide-react';
import { dataService, Subject } from '@/services/dataService';

const HomePage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Map icons to subject IDs
  const getSubjectIcon = (subjectId: string) => {
    switch(subjectId) {
      case 'english':
        return <BookOpen className="h-6 w-6 text-white" />;
      case 'hindi':
        return <Book className="h-6 w-6 text-white" />;
      case 'mathematics':
        return <Calculator className="h-6 w-6 text-white" />;
      case 'science':
        return <Flask className="h-6 w-6 text-white" />;
      case 'social-studies':
        return <Globe className="h-6 w-6 text-white" />;
      default:
        return <Book className="h-6 w-6 text-white" />;
    }
  };

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      const allSubjects = dataService.getSubjects();
      setSubjects(allSubjects);
      setFilteredSubjects(allSubjects);
      setLoading(false);
    };

    loadSubjects();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = subjects.filter(subject => 
      subject.title.toLowerCase().includes(query)
    );
    
    setFilteredSubjects(filtered);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Class 10 Learning Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Access all your CBSE Class 10 textbooks, videos, notes, tests, and more in one place
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          className="pl-10"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading subjects...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              title={subject.title}
              description={subject.description}
              icon={getSubjectIcon(subject.id)}
              color={subject.color}
            />
          ))}
          
          {filteredSubjects.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-muted-foreground">No subjects found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
