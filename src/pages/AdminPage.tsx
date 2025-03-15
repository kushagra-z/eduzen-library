import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, FileQuestion, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast.success('File uploaded successfully');
    }, 2000);
  };
  
  const handleTestCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate creation process
    setTimeout(() => {
      toast.success('Test created successfully');
    }, 1000);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
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
                  <Input id="title" placeholder="Enter content title" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter content description" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select defaultValue="english">
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
                    <Select defaultValue="pdf">
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
                
                <div className="space-y-2">
                  <Label htmlFor="file">File Upload</Label>
                  <div className="border-2 border-dashed border-muted rounded-md p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOCX, JPG, and PNG (Max 10MB)
                    </p>
                    <input id="file" type="file" className="hidden" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>Uploading...</>
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
                  <Input id="test-title" placeholder="Enter test title" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-subject">Subject</Label>
                  <Select defaultValue="english">
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
                  <Textarea id="instructions" placeholder="Enter test instructions" />
                </div>
                
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">Question 1</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="q1-text">Question Text</Label>
                    <Input id="q1-text" placeholder="Enter question" required />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Options</Label>
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option} className="flex gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {option}
                        </div>
                        <Input placeholder={`Option ${option}`} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Select defaultValue="a">
                      <SelectTrigger id="correct-answer">
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
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea id="explanation" placeholder="Explain the correct answer" />
                  </div>
                </div>
                
                <Button variant="outline" type="button" className="w-full">
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
              <p className="text-center text-muted-foreground py-8">
                Content management features will be added in a future update.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
