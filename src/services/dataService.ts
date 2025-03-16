// This service will handle all data fetching and management
// It will be replaced with Supabase client when integrated

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

// Temporary storage until Supabase is integrated
// This simulates a database in localStorage
class DataService {
  private subjects: Subject[] = [];
  private content: ContentItem[] = [];
  private tests: Test[] = [];
  private initialized = false;

  constructor() {
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

  // Content methods
  public getContentBySubject(subjectId: string): ContentItem[] {
    return this.content.filter(item => item.subjectId === subjectId);
  }

  public getContentByType(subjectId: string, type: string): ContentItem[] {
    return this.content.filter(item => item.subjectId === subjectId && item.type === type);
  }

  public getContentById(id: string): ContentItem | undefined {
    return this.content.find(item => item.id === id);
  }

  public addContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const newItem = {
      ...item,
      id: `${item.subjectId}-${item.type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.content.push(newItem);
    this.saveToLocalStorage();
    return newItem;
  }

  public updateContent(id: string, updates: Partial<ContentItem>): ContentItem | undefined {
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

  public deleteContent(id: string): boolean {
    const initialLength = this.content.length;
    this.content = this.content.filter(item => item.id !== id);
    const success = initialLength > this.content.length;
    if (success) {
      this.saveToLocalStorage();
    }
    return success;
  }

  // Test methods
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
