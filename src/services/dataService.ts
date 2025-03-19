// This service will handle all data fetching and management
// It now integrates with Supabase for persistent storage

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types to represent our data model
export interface Subject {
  id: string;
  title: string;
  description: string;
  color: string;
  icon?: React.ReactNode; // Added icon property as optional in the interface
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'test' | 'notes' | 'worksheet';
  subjectId: string;
  url?: string;
  youtubeId?: string;
  file?: File;
  storagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructions: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

class DataService {
  private subjects: Subject[] = [];
  private content: ContentItem[] = [];
  private tests: Test[] = [];
  private initialized = false;

  constructor() {
    // Keep local storage for now as fallback, but we'll primarily use Supabase
    this.loadFromLocalStorage();
    
    // Initialize with default subjects if none exist
    if (!this.initialized) {
      this.initializeDefaultData();
      this.saveToLocalStorage();
      this.initialized = true;
    }
  }

  private loadFromLocalStorage() {
    try {
      const subjectsData = localStorage.getItem('subjects');
      const contentData = localStorage.getItem('content');
      const testsData = localStorage.getItem('tests');

      if (subjectsData) {
        this.subjects = JSON.parse(subjectsData);
      }

      if (contentData) {
        this.content = JSON.parse(contentData);
      }

      if (testsData) {
        this.tests = JSON.parse(testsData);
      }

      if (subjectsData || contentData || testsData) {
        this.initialized = true;
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('subjects', JSON.stringify(this.subjects));
      localStorage.setItem('content', JSON.stringify(this.content));
      localStorage.setItem('tests', JSON.stringify(this.tests));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  private initializeDefaultData() {
    // Initialize with default subjects
    this.subjects = [
      { 
        id: 'english', 
        title: 'English', 
        description: 'Improve your language skills with CBSE English curriculum',
        color: 'bg-blue-600'
      },
      { 
        id: 'hindi', 
        title: 'Hindi', 
        description: 'Enhance your Hindi reading, writing and comprehension',
        color: 'bg-red-600'
      },
      { 
        id: 'mathematics', 
        title: 'Mathematics', 
        description: 'Master key mathematical concepts and problem-solving',
        color: 'bg-amber-600'
      },
      { 
        id: 'science', 
        title: 'Science', 
        description: 'Explore physics, chemistry and biology fundamentals',
        color: 'bg-green-600'
      },
      { 
        id: 'social-studies', 
        title: 'Social Studies', 
        description: 'Learn about history, geography, economics and civics',
        color: 'bg-purple-600'
      }
    ];
  }

  // Subject methods
  public getSubjects(): Subject[] {
    return [...this.subjects];
  }

  public getSubjectById(id: string): Subject | undefined {
    return this.subjects.find(subject => subject.id === id);
  }

  // Content methods - now with Supabase integration
  public async getContentBySubject(subjectId: string): Promise<ContentItem[]> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('subject', subjectId);
      
      if (error) {
        console.error('Supabase error fetching content:', error);
        // Fallback to local data
        return this.content.filter(item => item.subjectId === subjectId);
      }
      
      if (data && data.length > 0) {
        // Transform Supabase data to our ContentItem format
        return data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.content_type as any,
          subjectId: item.subject,
          url: item.file_url || item.external_link,
          youtubeId: item.external_link?.includes('youtube') ? this.extractYoutubeId(item.external_link) : undefined,
          storagePath: item.storage_path,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
      
      // If no data in Supabase, return local data
      return this.content.filter(item => item.subjectId === subjectId);
    } catch (error) {
      console.error('Error fetching content:', error);
      return this.content.filter(item => item.subjectId === subjectId);
    }
  }

  private extractYoutubeId(url?: string): string | undefined {
    if (!url) return undefined;
    
    // Extract YouTube ID from URL (different formats possible)
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : undefined;
  }

  public async getContentByType(subjectId: string, type: string): Promise<ContentItem[]> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('subject', subjectId)
        .eq('content_type', type);
      
      if (error) {
        console.error('Supabase error fetching content by type:', error);
        // Fallback to local data
        return this.content.filter(item => item.subjectId === subjectId && item.type === type);
      }
      
      if (data && data.length > 0) {
        // Transform Supabase data
        return data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.content_type as any,
          subjectId: item.subject,
          url: item.file_url || item.external_link,
          youtubeId: item.external_link?.includes('youtube') ? this.extractYoutubeId(item.external_link) : undefined,
          storagePath: item.storage_path,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
      
      // If no data in Supabase, return local data
      return this.content.filter(item => item.subjectId === subjectId && item.type === type);
    } catch (error) {
      console.error('Error fetching content by type:', error);
      return this.content.filter(item => item.subjectId === subjectId && item.type === type);
    }
  }

  public async getContentById(id: string): Promise<ContentItem | undefined> {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Supabase error fetching content by id:', error);
        // Fallback to local data
        return this.content.find(item => item.id === id);
      }
      
      if (data) {
        // If the content has a file in storage, get a public URL
        let url = data.file_url || data.external_link;
        
        if (data.storage_path) {
          // Important: Remove 'documents/' prefix if it exists
          let storagePath = data.storage_path;
          if (storagePath.startsWith('documents/')) {
            storagePath = storagePath.replace('documents/', '');
            console.log('Removed bucket prefix from path:', storagePath);
          }
          
          const { data: storageData } = await supabase
            .storage
            .from('documents')
            .getPublicUrl(storagePath);
          
          if (storageData && storageData.publicUrl) {
            url = storageData.publicUrl;
          }
        }
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.content_type as any,
          subjectId: data.subject,
          url,
          youtubeId: data.external_link?.includes('youtube') ? this.extractYoutubeId(data.external_link) : undefined,
          storagePath: data.storage_path,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      // If no data in Supabase, return local data
      return this.content.find(item => item.id === id);
    } catch (error) {
      console.error('Error fetching content by id:', error);
      return this.content.find(item => item.id === id);
    }
  }

  public async addContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    let storagePath = '';
    let fileUrl = item.url;
    
    // Upload file to Supabase Storage if available
    if (item.file && ['pdf', 'notes', 'worksheet'].includes(item.type)) {
      try {
        // Create storage path WITHOUT the bucket name prefix
        // This is critical - do not include 'documents/' in the path
        storagePath = `${item.subjectId}/${item.type}/${Date.now()}_${item.file.name}`;
        
        console.log('Uploading file to storage path:', storagePath);
        
        const { data, error } = await supabase
          .storage
          .from('documents')
          .upload(storagePath, item.file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading file to storage:', error);
          toast.error(`Upload error: ${error.message}`);
        } else if (data) {
          console.log('File uploaded successfully:', data.path);
          
          // Get the public URL
          const { data: urlData } = await supabase
            .storage
            .from('documents')
            .getPublicUrl(storagePath);
          
          if (urlData) {
            fileUrl = urlData.publicUrl;
            console.log('Public URL:', fileUrl);
          }
        }
      } catch (error) {
        console.error('File upload error:', error);
        if (error instanceof Error) {
          toast.error(`File upload error: ${error.message}`);
        }
      }
    }
    
    // Add to Supabase database
    try {
      const { data, error } = await supabase
        .from('content')
        .insert([{
          title: item.title,
          description: item.description,
          subject: item.subjectId,
          content_type: item.type,
          external_link: item.type === 'video' ? item.youtubeId : null,
          file_url: fileUrl,
          storage_path: storagePath || null
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding content to Supabase:', error);
        toast.error(`Database error: ${error.message}`);
      } else if (data) {
        console.log('Content added to Supabase:', data);
        
        // Create the complete content item with the ID from Supabase
        const newItem: ContentItem = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.content_type as any,
          subjectId: data.subject,
          url: fileUrl || data.external_link,
          youtubeId: item.youtubeId,
          storagePath: data.storage_path,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        // Also add to local data for redundancy
        this.content.push(newItem);
        this.saveToLocalStorage();
        
        return newItem;
      }
    } catch (error) {
      console.error('Error in Supabase operation:', error);
      if (error instanceof Error) {
        toast.error(`Database error: ${error.message}`);
      }
    }
    
    // Fallback to local storage if Supabase fails
    const localItem = {
      ...item,
      id: `${item.subjectId}-${item.type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: fileUrl,
      storagePath
    };
    
    this.content.push(localItem);
    this.saveToLocalStorage();
    return localItem;
  }

  public async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem | undefined> {
    try {
      // Handle file upload for updates if needed
      let storagePath = updates.storagePath;
      let fileUrl = updates.url;
      
      if (updates.file && ['pdf', 'notes', 'worksheet'].includes(updates.type || '')) {
        // Create a unique path for the file
        storagePath = `${updates.subjectId}/${updates.type}/${Date.now()}_${updates.file.name}`;
        
        const { data, error } = await supabase
          .storage
          .from('documents')
          .upload(storagePath, updates.file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading updated file to storage:', error);
        } else if (data) {
          // Get the public URL
          const { data: urlData } = await supabase
            .storage
            .from('documents')
            .getPublicUrl(storagePath);
          
          if (urlData) {
            fileUrl = urlData.publicUrl;
          }
        }
      }
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('content')
        .update({
          title: updates.title,
          description: updates.description,
          subject: updates.subjectId,
          content_type: updates.type,
          external_link: updates.type === 'video' ? updates.youtubeId : null,
          file_url: fileUrl,
          storage_path: storagePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating content in Supabase:', error);
      } else if (data) {
        // Also update local cache
        const index = this.content.findIndex(item => item.id === id);
        if (index !== -1) {
          this.content[index] = {
            ...this.content[index],
            ...updates,
            url: fileUrl || data.file_url || data.external_link,
            storagePath: storagePath || data.storage_path,
            updatedAt: data.updated_at
          };
          this.saveToLocalStorage();
        }
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.content_type as any,
          subjectId: data.subject,
          url: fileUrl || data.file_url || data.external_link,
          youtubeId: updates.youtubeId,
          storagePath: data.storage_path,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    } catch (error) {
      console.error('Error in Supabase update operation:', error);
    }
    
    // Fallback to local update if Supabase fails
    const index = this.content.findIndex(item => item.id === id);
    if (index !== -1) {
      this.content[index] = {
        ...this.content[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.content[index];
    }
    
    return undefined;
  }

  public async deleteContent(id: string): Promise<boolean> {
    try {
      // First get the content to see if we need to delete a file
      const content = await this.getContentById(id);
      
      if (content && content.storagePath) {
        // Delete the file from storage first
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([content.storagePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting content from Supabase:', error);
      } else {
        // Also delete from local storage
        const initialLength = this.content.length;
        this.content = this.content.filter(item => item.id !== id);
        const success = initialLength > this.content.length;
        
        if (success) {
          this.saveToLocalStorage();
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error in delete operation:', error);
    }
    
    // Fallback to local delete if Supabase fails
    const initialLength = this.content.length;
    this.content = this.content.filter(item => item.id !== id);
    const success = initialLength > this.content.length;
    
    if (success) {
      this.saveToLocalStorage();
    }
    
    return success;
  }

  // Test methods - keeping local for now
  public getTests(subjectId?: string): Test[] {
    if (subjectId) {
      return this.tests.filter(test => test.subject === subjectId);
    }
    return [...this.tests];
  }

  public getTestById(id: string): Test | undefined {
    return this.tests.find(test => test.id === id);
  }

  public addTest(test: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Test {
    const newTest = {
      ...test,
      id: `${test.subject}-test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tests.push(newTest);
    this.saveToLocalStorage();
    return newTest;
  }

  public updateTest(id: string, updates: Partial<Test>): Test | undefined {
    const index = this.tests.findIndex(test => test.id === id);
    if (index !== -1) {
      this.tests[index] = {
        ...this.tests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.tests[index];
    }
    return undefined;
  }

  public deleteTest(id: string): boolean {
    const initialLength = this.tests.length;
    this.tests = this.tests.filter(test => test.id !== id);
    const success = initialLength > this.tests.length;
    if (success) {
      this.saveToLocalStorage();
    }
    return success;
  }

  // Clear all data (for testing/development)
  public clearAllData(): void {
    this.subjects = [];
    this.content = [];
    this.tests = [];
    this.saveToLocalStorage();
  }
}

// Create a singleton instance
export const dataService = new DataService();
