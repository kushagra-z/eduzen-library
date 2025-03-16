
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, FileQuestion, BookOpen, X, FileUp, Loader2, LogOut, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { FilePreview } from '@/components/FilePreview';
import { dataService, ContentItem, Test } from '@/services/dataService';

interface ContentFormState {
  title: string;
  description: string;
  subject: string;
  contentType: string;
  file: File | null;
  youtubeId?: string;
}

interface TestFormState {
  title: string;
  subject: string;
  description: string;
  instructions: string;
  questions: QuestionFormState[];
}

interface QuestionFormState {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const initialContentFormState: ContentFormState = {
  title: '',
  description: '',
  subject: 'english',
  contentType: 'pdf',
  file: null,
  youtubeId: ''
};

const initialTestFormState: TestFormState = {
  title: '',
  subject: 'english',
  description: '',
  instructions: '',
  questions: [
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 'a',
      explanation: ''
    }
  ]
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [contentForm, setContentForm] = useState<ContentFormState>(initialContentFormState);
  const [testForm, setTestForm] = useState<TestFormState>(initialTestFormState);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [contentFilter, setContentFilter] = useState({
    subject: 'all',
    type: 'all-types',
    search: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load content when the manage tab is selected
  useEffect(() => {
    if (selectedTab === 'manage') {
      loadContent();
    }
  }, [selectedTab]);

  // Apply filters to content
  useEffect(() => {
    let filtered = [...contentItems];
    
    if (contentFilter.subject !== 'all') {
      filtered = filtered.filter(item => item.subjectId === contentFilter.subject);
    }
    
    if (contentFilter.type !== 'all-types') {
      filtered = filtered.filter(item => item.type === contentFilter.type);
    }
    
    if (contentFilter.search) {
      const search = contentFilter.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search) || 
        item.description.toLowerCase().includes(search)
      );
    }
    
    setFilteredContent(filtered);
  }, [contentItems, contentFilter]);
  
  const loadContent = async () => {
    // This would be replaced with a fetch to Supabase in production
    const allSubjects = dataService.getSubjects();
    const allContent: ContentItem[] = [];
    
    allSubjects.forEach(subject => {
      const subjectContent = dataService.getContentBySubject(subject.id);
      allContent.push(...subjectContent);
    });
    
    setContentItems(allContent);
    setFilteredContent(allContent);
  };
  
  const handleContentFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContentForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setContentForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setContentForm(prev => ({ ...prev, file }));
  };
  
  const handleTestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTestForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuestionChange = (index: number, field: string, value: string) => {
    setTestForm(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { 
        ...updatedQuestions[index], 
        [field]: value 
      };
      return { ...prev, questions: updatedQuestions };
    });
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setTestForm(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = { 
        ...updatedQuestions[questionIndex], 
        options: updatedOptions 
      };
      return { ...prev, questions: updatedQuestions };
    });
  };
  
  const handleAddQuestion = () => {
    setTestForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 'a',
          explanation: ''
        }
      ]
    }));
  };
  
  const handleRemoveFile = () => {
    setContentForm(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (contentForm.contentType !== 'video' && !contentForm.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (contentForm.contentType === 'video' && !contentForm.youtubeId) {
      toast.error('Please enter a YouTube ID');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In production, this would upload the file to storage and save metadata to the database
      // For now, we'll just simulate the upload and save to our data service
      
      // Create a new content item
      const newContent = {
        title: contentForm.title,
        description: contentForm.description,
        subjectId: contentForm.subject,
        type: contentForm.contentType as any,
        youtubeId: contentForm.youtubeId
      };
      
      // Add to data service
      dataService.addContent(newContent);
      
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setContentForm(initialContentFormState);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success('Content uploaded successfully');
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload content. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(interval);
    }
  };
  
  const handleTestCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testForm.title.trim()) {
      toast.error('Please enter a test title');
      return;
    }
    
    if (!testForm.description.trim()) {
      toast.error('Please enter a test description');
      return;
    }
    
    const isValid = testForm.questions.every((question, index) => {
      if (!question.text.trim()) {
        toast.error(`Question ${index + 1} is missing text`);
        return false;
      }
      
      const hasAllOptions = question.options.every(option => option.trim() !== '');
      if (!hasAllOptions) {
        toast.error(`Question ${index + 1} is missing one or more options`);
        return false;
      }
      
      if (!question.explanation.trim()) {
        toast.error(`Question ${index + 1} is missing an explanation`);
        return false;
      }
      
      return true;
    });
    
    if (!isValid) return;
    
    try {
      // Transform the form data to match our data model
      const questions = testForm.questions.map((q, index) => ({
        id: `q${index + 1}`,
        text: q.text,
        options: q.options.map((text, i) => ({
          id: ['a', 'b', 'c', 'd'][i],
          text
        })),
        correctAnswerId: q.correctAnswer,
        explanation: q.explanation
      }));
      
      // Create the test object
      const newTest: Omit<Test, 'id' | 'createdAt' | 'updatedAt'> = {
        title: testForm.title,
        description: testForm.description,
        subject: testForm.subject,
        instructions: testForm.instructions,
        questions
      };
      
      // Add to data service
      dataService.addTest(newTest);
      
      toast.success('Test created successfully');
      setTestForm(initialTestFormState);
      
    } catch (error) {
      console.error('Test creation error:', error);
      toast.error('Failed to create test. Please try again.');
    }
  };

  const handleDeleteContent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      const success = dataService.deleteContent(id);
      if (success) {
        toast.success('Content deleted successfully');
        loadContent(); // Reload content list
      } else {
        toast.error('Failed to delete content');
      }
    }
  };

  const getAllowedFileTypes = () => {
    switch (contentForm.contentType) {
      case 'pdf':
        return '.pdf';
      case 'notes':
      case 'worksheet':
        return '.pdf,.doc,.docx';
      case 'video':
        return '';
      default:
        return '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setContentFilter(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Content
            </TabsTrigger>
            <TabsTrigger value="tests">
              <FileQuestion className="mr-2 h-4 w-4" />
              Create Tests
            </TabsTrigger>
            <TabsTrigger value="manage">
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload New Content</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={contentForm.title}
                    onChange={handleContentFormChange}
                    placeholder="Enter content title" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={contentForm.description}
                    onChange={handleContentFormChange}
                    placeholder="Enter content description" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={contentForm.subject}
                      onValueChange={(value) => handleSelectChange('subject', value)}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="social-studies">Social Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select 
                      value={contentForm.contentType}
                      onValueChange={(value) => handleSelectChange('contentType', value)}
                    >
                      <SelectTrigger id="content-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="video">Video URL</SelectItem>
                        <SelectItem value="worksheet">Worksheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {contentForm.contentType === 'video' ? (
                  <div className="space-y-2">
                    <Label htmlFor="youtubeId">YouTube Video ID</Label>
                    <Input 
                      id="youtubeId" 
                      name="youtubeId"
                      value={contentForm.youtubeId}
                      onChange={handleContentFormChange}
                      placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=dQw4w9WgXcQ)" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter only the ID part from a YouTube URL, not the full URL
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="file">File Upload</Label>
                    {!contentForm.file ? (
                      <div 
                        className="border-2 border-dashed border-muted rounded-md p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports PDF, DOCX, JPG, and PNG (Max 10MB)
                        </p>
                        <input 
                          id="file" 
                          ref={fileInputRef}
                          type="file"
                          accept={getAllowedFileTypes()}
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </div>
                    ) : (
                      <FilePreview file={contentForm.file} onRemove={handleRemoveFile} />
                    )}
                  </div>
                )}
                
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Content
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Test</h2>
              <form onSubmit={handleTestCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-title">Test Title</Label>
                  <Input 
                    id="test-title" 
                    name="title"
                    value={testForm.title}
                    onChange={handleTestFormChange}
                    placeholder="Enter test title" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-description">Description</Label>
                  <Textarea 
                    id="test-description" 
                    name="description"
                    value={testForm.description}
                    onChange={handleTestFormChange}
                    placeholder="Enter test description" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-subject">Subject</Label>
                  <Select 
                    value={testForm.subject}
                    onValueChange={(value) => setTestForm(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger id="test-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    name="instructions"
                    value={testForm.instructions}
                    onChange={handleTestFormChange}
                    placeholder="Enter test instructions" 
                  />
                </div>
                
                {testForm.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-medium">Question {questionIndex + 1}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`q${questionIndex}-text`}>Question Text</Label>
                      <Input 
                        id={`q${questionIndex}-text`} 
                        value={question.text}
                        onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                        placeholder="Enter question" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Options</Label>
                      {['A', 'B', 'C', 'D'].map((option, optionIndex) => (
                        <div key={option} className="flex gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {option}
                          </div>
                          <Input 
                            placeholder={`Option ${option}`} 
                            value={question.options[optionIndex]}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`correct-answer-${questionIndex}`}>Correct Answer</Label>
                      <Select 
                        value={question.correctAnswer}
                        onValueChange={(value) => handleQuestionChange(questionIndex, 'correctAnswer', value)}
                      >
                        <SelectTrigger id={`correct-answer-${questionIndex}`}>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Option A</SelectItem>
                          <SelectItem value="b">Option B</SelectItem>
                          <SelectItem value="c">Option C</SelectItem>
                          <SelectItem value="d">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`explanation-${questionIndex}`}>Explanation</Label>
                      <Textarea 
                        id={`explanation-${questionIndex}`} 
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                        placeholder="Explain the correct answer" 
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={handleAddQuestion}
                >
                  Add Another Question
                </Button>
                
                <Button type="submit" className="w-full">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Create Test
                </Button>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Content</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between mb-4">
                  <Select 
                    value={contentFilter.subject}
                    onValueChange={(value) => handleFilterChange('subject', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={contentFilter.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="pdf">PDF Documents</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="worksheet">Worksheets</SelectItem>
                      <SelectItem value="test">Tests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <Input 
                    placeholder="Search content..." 
                    className="pl-10"
                    value={contentFilter.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  {filteredContent.length > 0 ? (
                    <div className="divide-y">
                      {filteredContent.map((item, index) => (
                        <div key={item.id} className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span className="capitalize">{item.type}</span>
                              <span>•</span>
                              <span className="capitalize">{item.subjectId}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(item.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 px-4 text-sm font-medium bg-muted">
                      No content found. Upload some content first.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
