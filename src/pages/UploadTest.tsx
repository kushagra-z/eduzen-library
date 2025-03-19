import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { testUploadFunctionality } from '@/services/dataService';
import { toast } from 'sonner';

const UploadTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await testUploadFunctionality();
      setResults(testResults);
      
      if (testResults.success) {
        toast.success('Upload tests completed successfully');
      } else {
        toast.error(`Upload tests failed: ${testResults.message}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('An error occurred while running the tests');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Functionality Test</h1>
        
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="mb-4"
        >
          {isRunning ? 'Running Tests...' : 'Run Upload Tests'}
        </Button>

        {results && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Test Results</h2>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadTest; 