
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentTypeSection } from '@/components/ContentTypeSection';
import { ChevronLeft, FileText, PlayCircle, FileQuestion, Book, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentType } from '@/components/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { dataService, Subject, ContentItem } from '@/services/dataService';

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (subjectId) {
        // Get subject data
        const foundSubject = dataService.getSubjectById(subjectId);
        if (foundSubject) {
          setSubject(foundSubject);
          
          // Get content for this subject - properly await the Promise
          try {
            const subjectContent = await dataService.getContentBySubject(subjectId);
            setContent(subjectContent);
          } catch (error) {
            console.error("Error fetching content:", error);
            setContent([]);
          }
        }
      }
      setLoading(false);
    };

    loadData();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading subject data...</span>
      </div>
    );
  }

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
