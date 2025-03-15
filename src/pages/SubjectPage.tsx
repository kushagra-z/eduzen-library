
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentTypeSection } from '@/components/ContentTypeSection';
import { ChevronLeft, FileText, PlayCircle, FileQuestion, Book, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentType } from '@/components/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';

// Mock data - this would be fetched from Supabase in a real implementation
const SUBJECTS = [
  { id: 'english', title: 'English', color: 'bg-blue-600' },
  { id: 'hindi', title: 'Hindi', color: 'bg-red-600' },
  { id: 'mathematics', title: 'Mathematics', color: 'bg-amber-600' },
  { id: 'science', title: 'Science', color: 'bg-green-600' },
  { id: 'social-studies', title: 'Social Studies', color: 'bg-purple-600' }
];

// Mock content data
const MOCK_CONTENT = {
  english: [
    { id: 'eng-pdf-1', title: 'First Flight Textbook', description: 'Complete NCERT textbook for Class 10 English', type: 'pdf' as ContentType, subjectId: 'english' },
    { id: 'eng-pdf-2', title: 'Footprints without Feet', description: 'Supplementary reader for Class 10 English', type: 'pdf' as ContentType, subjectId: 'english' },
    { id: 'eng-notes-1', title: 'Grammar Notes', description: 'Comprehensive notes on English grammar', type: 'notes' as ContentType, subjectId: 'english' },
    { id: 'eng-video-1', title: 'Poetry Explanation', description: 'Detailed explanation of all poems', type: 'video' as ContentType, subjectId: 'english' },
    { id: 'eng-test-1', title: 'Practice Test: Grammar', description: 'Test your understanding of grammar concepts', type: 'test' as ContentType, subjectId: 'english' },
    { id: 'eng-worksheet-1', title: 'Writing Skills Worksheet', description: 'Practice exercises for letter and essay writing', type: 'worksheet' as ContentType, subjectId: 'english' },
  ],
  mathematics: [
    { id: 'math-pdf-1', title: 'Mathematics NCERT', description: 'Complete mathematics textbook with all chapters', type: 'pdf' as ContentType, subjectId: 'mathematics' },
    { id: 'math-notes-1', title: 'Algebraic Expressions', description: 'Detailed notes on solving algebraic expressions', type: 'notes' as ContentType, subjectId: 'mathematics' },
    { id: 'math-notes-2', title: 'Trigonometry Formulas', description: 'All important formulas and identities', type: 'notes' as ContentType, subjectId: 'mathematics' },
    { id: 'math-worksheet-1', title: 'Geometry Practice Problems', description: 'Practice problems for coordinate geometry', type: 'worksheet' as ContentType, subjectId: 'mathematics' },
    { id: 'math-test-1', title: 'Chapter 1-3 Test', description: 'Test covering the first three chapters', type: 'test' as ContentType, subjectId: 'mathematics' },
    { id: 'math-video-1', title: 'Quadratic Equations Tutorial', description: 'Step-by-step tutorial on solving quadratic equations', type: 'video' as ContentType, subjectId: 'mathematics' },
  ],
  science: [
    { id: 'sci-pdf-1', title: 'Science NCERT', description: 'Official NCERT textbook for Class 10 Science', type: 'pdf' as ContentType, subjectId: 'science' },
    { id: 'sci-notes-1', title: 'Physics - Light', description: 'Comprehensive notes on reflection and refraction', type: 'notes' as ContentType, subjectId: 'science' },
    { id: 'sci-video-1', title: 'Chemical Reactions', description: 'Visual explanations of different types of chemical reactions', type: 'video' as ContentType, subjectId: 'science' },
    { id: 'sci-worksheet-1', title: 'Electricity Problems', description: 'Practice problems on electric circuits', type: 'worksheet' as ContentType, subjectId: 'science' },
    { id: 'sci-test-1', title: 'Biology MCQ Test', description: 'Multiple choice questions on life processes', type: 'test' as ContentType, subjectId: 'science' },
  ],
  hindi: [
    { id: 'hin-pdf-1', title: 'क्षितिज भाग-2', description: 'कक्षा 10 के लिए हिंदी पाठ्यपुस्तक', type: 'pdf' as ContentType, subjectId: 'hindi' },
    { id: 'hin-notes-1', title: 'व्याकरण नोट्स', description: 'हिंदी व्याकरण पर विस्तृत नोट्स', type: 'notes' as ContentType, subjectId: 'hindi' },
    { id: 'hin-test-1', title: 'अभ्यास प्रश्न', description: 'हिंदी विषय पर अभ्यास प्रश्न', type: 'test' as ContentType, subjectId: 'hindi' },
  ],
  'social-studies': [
    { id: 'sst-pdf-1', title: 'History - India and the Contemporary World II', description: 'NCERT textbook for Class 10 History', type: 'pdf' as ContentType, subjectId: 'social-studies' },
    { id: 'sst-pdf-2', title: 'Geography - Contemporary India II', description: 'NCERT textbook for Class 10 Geography', type: 'pdf' as ContentType, subjectId: 'social-studies' },
    { id: 'sst-notes-1', title: 'Political Science Notes', description: 'Comprehensive notes on democratic politics', type: 'notes' as ContentType, subjectId: 'social-studies' },
    { id: 'sst-worksheet-1', title: 'Map Work Practice', description: 'Practice identifying locations on maps', type: 'worksheet' as ContentType, subjectId: 'social-studies' },
    { id: 'sst-test-1', title: 'Economics Test', description: 'Test on economic development concepts', type: 'test' as ContentType, subjectId: 'social-studies' },
    { id: 'sst-video-1', title: 'Nationalism in India', description: 'Video lecture on nationalist movements', type: 'video' as ContentType, subjectId: 'social-studies' },
  ]
};

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<{ id: string; title: string; color: string } | null>(null);
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    if (subjectId) {
      const foundSubject = SUBJECTS.find(s => s.id === subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
        setContent(MOCK_CONTENT[subjectId as keyof typeof MOCK_CONTENT] || []);
      }
    }
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="container py-12">
        <EmptyState 
          title="Subject Not Found"
          description="Sorry, we couldn't find the subject you're looking for."
          action={{
            label: "Go to Homepage",
            href: "/"
          }}
        />
      </div>
    );
  }

  const pdfContent = content.filter(item => item.type === 'pdf');
  const notesContent = content.filter(item => item.type === 'notes');
  const videoContent = content.filter(item => item.type === 'video');
  const testContent = content.filter(item => item.type === 'test');
  const worksheetContent = content.filter(item => item.type === 'worksheet');

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
        <p className="text-muted-foreground">
          Explore all learning resources for Class 10 CBSE {subject.title}
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="textbooks">
            <FileText className="mr-2 h-4 w-4" />
            Textbooks
          </TabsTrigger>
          <TabsTrigger value="notes">
            <Book className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="videos">
            <PlayCircle className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="tests">
            <FileQuestion className="mr-2 h-4 w-4" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="worksheets">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Worksheets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ContentTypeSection 
            title="Textbooks & Reference Material" 
            type="pdf" 
            items={pdfContent} 
            subjectId={subject.id} 
          />
          <ContentTypeSection 
            title="Notes & Summaries" 
            type="notes" 
            items={notesContent} 
            subjectId={subject.id} 
          />
          <ContentTypeSection 
            title="Video Lectures" 
            type="video" 
            items={videoContent} 
            subjectId={subject.id} 
          />
          <ContentTypeSection 
            title="Practice Tests" 
            type="test" 
            items={testContent} 
            subjectId={subject.id} 
          />
          <ContentTypeSection 
            title="Worksheets" 
            type="worksheet" 
            items={worksheetContent} 
            subjectId={subject.id} 
          />
          
          {content.length === 0 && (
            <EmptyState 
              title="No Content Available"
              description="We're currently adding content for this subject. Please check back later."
            />
          )}
        </TabsContent>

        <TabsContent value="textbooks" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfContent.map(item => (
              <ContentTypeSection 
                key={item.id}
                title="Textbooks" 
                type="pdf" 
                items={pdfContent} 
                subjectId={subject.id} 
              />
            ))}
            {pdfContent.length === 0 && (
              <EmptyState 
                title="No Textbooks Available"
                description="We're currently adding textbooks for this subject. Please check back later."
                icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notesContent.map(item => (
              <ContentTypeSection 
                key={item.id}
                title="Notes" 
                type="notes" 
                items={notesContent} 
                subjectId={subject.id} 
              />
            ))}
            {notesContent.length === 0 && (
              <EmptyState 
                title="No Notes Available"
                description="We're currently adding notes for this subject. Please check back later."
                icon={<Book className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoContent.map(item => (
              <ContentTypeSection 
                key={item.id}
                title="Videos" 
                type="video" 
                items={videoContent} 
                subjectId={subject.id} 
              />
            ))}
            {videoContent.length === 0 && (
              <EmptyState 
                title="No Videos Available"
                description="We're currently adding video lectures for this subject. Please check back later."
                icon={<PlayCircle className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testContent.map(item => (
              <ContentTypeSection 
                key={item.id}
                title="Tests" 
                type="test" 
                items={testContent} 
                subjectId={subject.id} 
              />
            ))}
            {testContent.length === 0 && (
              <EmptyState 
                title="No Tests Available"
                description="We're currently adding practice tests for this subject. Please check back later."
                icon={<FileQuestion className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="worksheets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worksheetContent.map(item => (
              <ContentTypeSection 
                key={item.id}
                title="Worksheets" 
                type="worksheet" 
                items={worksheetContent} 
                subjectId={subject.id} 
              />
            ))}
            {worksheetContent.length === 0 && (
              <EmptyState 
                title="No Worksheets Available"
                description="We're currently adding worksheets for this subject. Please check back later."
                icon={<FileSpreadsheet className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectPage;
