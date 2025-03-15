
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestQuestion } from '@/components/TestQuestion';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/ui/card';

// Mock data - In a real app, this would be fetched from Supabase
const MOCK_TESTS = {
  'eng-test-1': {
    id: 'eng-test-1',
    title: 'Practice Test: Grammar',
    description: 'Test your understanding of grammar concepts',
    subject: 'english',
    instructions: 'Select the correct answer for each question. You can check your answers at the end of the test.',
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is a proper noun?',
        options: [
          { id: 'a', text: 'Boy' },
          { id: 'b', text: 'New Delhi' },
          { id: 'c', text: 'Tree' },
          { id: 'd', text: 'Beautiful' }
        ],
        correctAnswerId: 'b',
        explanation: 'A proper noun is the name of a specific person, place, or thing. "New Delhi" is a specific city name, making it a proper noun.'
      },
      {
        id: 'q2',
        text: 'Identify the conjunction in the sentence: "She likes tea but hates coffee."',
        options: [
          { id: 'a', text: 'She' },
          { id: 'b', text: 'likes' },
          { id: 'c', text: 'but' },
          { id: 'd', text: 'hates' }
        ],
        correctAnswerId: 'c',
        explanation: 'A conjunction is a word that connects clauses or sentences or coordinates words in the same clause. In this sentence, "but" connects the two parts of the sentence.'
      },
      {
        id: 'q3',
        text: 'What is the past tense of "write"?',
        options: [
          { id: 'a', text: 'Wrote' },
          { id: 'b', text: 'Written' },
          { id: 'c', text: 'Writed' },
          { id: 'd', text: 'Writing' }
        ],
        correctAnswerId: 'a',
        explanation: '"Wrote" is the simple past tense of "write". "Written" is the past participle form.'
      }
    ]
  },
  'math-test-1': {
    id: 'math-test-1',
    title: 'Chapter 1-3 Test',
    description: 'Test covering the first three chapters',
    subject: 'mathematics',
    instructions: 'Choose the correct option for each problem. Work out the solutions on paper if needed.',
    questions: [
      {
        id: 'q1',
        text: 'If x² - 5x + 6 = 0, what are the values of x?',
        options: [
          { id: 'a', text: 'x = 2, x = 3' },
          { id: 'b', text: 'x = -2, x = -3' },
          { id: 'c', text: 'x = 2, x = -3' },
          { id: 'd', text: 'x = -2, x = 3' }
        ],
        correctAnswerId: 'a',
        explanation: 'Using the quadratic formula or factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0, which gives x = 2 or x = 3.'
      },
      {
        id: 'q2',
        text: 'What is the value of sin 30°?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1/2' },
          { id: 'c', text: '1/√2' },
          { id: 'd', text: '1' }
        ],
        correctAnswerId: 'b',
        explanation: 'sin 30° = 1/2 is one of the standard trigonometric values you should memorize.'
      }
    ]
  },
  'sci-test-1': {
    id: 'sci-test-1',
    title: 'Biology MCQ Test',
    description: 'Multiple choice questions on life processes',
    subject: 'science',
    instructions: 'Select the most appropriate answer for each question.',
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is NOT a part of the digestive system?',
        options: [
          { id: 'a', text: 'Esophagus' },
          { id: 'b', text: 'Pancreas' },
          { id: 'c', text: 'Lungs' },
          { id: 'd', text: 'Small intestine' }
        ],
        correctAnswerId: 'c',
        explanation: 'Lungs are part of the respiratory system, not the digestive system.'
      },
      {
        id: 'q2',
        text: 'Photosynthesis takes place in which part of the plant cell?',
        options: [
          { id: 'a', text: 'Nucleus' },
          { id: 'b', text: 'Mitochondria' },
          { id: 'c', text: 'Chloroplast' },
          { id: 'd', text: 'Vacuole' }
        ],
        correctAnswerId: 'c',
        explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells.'
      }
    ]
  }
};

const TestPage = () => {
  const { subjectId, testId } = useParams<{ subjectId: string; testId: string }>();
  const [test, setTest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    // Simulate fetching test data from backend
    setTimeout(() => {
      if (testId && MOCK_TESTS[testId as keyof typeof MOCK_TESTS]) {
        setTest(MOCK_TESTS[testId as keyof typeof MOCK_TESTS]);
      }
      setLoading(false);
    }, 1000);
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
        {test.questions.map((question: any, index: number) => (
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
