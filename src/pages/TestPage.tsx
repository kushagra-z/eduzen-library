
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestQuestion } from '@/components/TestQuestion';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/ui/card';
import { dataService, Test } from '@/services/dataService';

const TestPage = () => {
  const { subjectId, testId } = useParams<{ subjectId: string; testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      if (testId) {
        const testData = dataService.getTestById(testId);
        if (testData) {
          setTest(testData);
        }
      }
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = () => {
    setShowAnswers(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    setUserAnswers({});
    setShowAnswers(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading test...</span>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container py-12">
        <EmptyState 
          title="Test Not Found"
          description="Sorry, we couldn't find the test you're looking for."
          action={{
            label: "Go Back",
            href: `/subjects/${subjectId}`
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-in">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/subjects/${subjectId}`} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {subjectId}
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
        <p className="text-muted-foreground mb-4">{test.description}</p>
        
        {!showAnswers && (
          <Card className="p-4 border-primary/20 bg-primary/5 mb-6">
            <p className="font-medium">Instructions:</p>
            <p className="text-sm text-muted-foreground">{test.instructions}</p>
          </Card>
        )}

        {showAnswers && (
          <Card className="p-4 bg-green-500/10 border-green-500/20 mb-6">
            <p className="font-medium text-green-500">Test completed!</p>
            <p className="text-sm text-muted-foreground">You can now review the correct answers and explanations below.</p>
          </Card>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {test.questions.map((question, index) => (
          <TestQuestion 
            key={question.id}
            questionNumber={index + 1}
            text={question.text}
            options={question.options}
            correctAnswerId={showAnswers ? question.correctAnswerId : undefined}
            explanation={showAnswers ? question.explanation : undefined}
            onSelect={(optionId) => handleAnswerSelect(question.id, optionId)}
            selectedOptionId={userAnswers[question.id]}
            showAnswer={showAnswers}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {!showAnswers ? (
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={Object.keys(userAnswers).length < test.questions.length}
          >
            Submit Answers
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={resetTest}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestPage;
