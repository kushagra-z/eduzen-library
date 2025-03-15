
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface TestQuestionProps {
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswerId?: string; // Optional, only shown after submission
  explanation?: string; // Optional explanation
  onSelect: (optionId: string) => void;
  selectedOptionId?: string;
  showAnswer: boolean;
}

export const TestQuestion = ({
  questionNumber,
  text,
  options,
  correctAnswerId,
  explanation,
  onSelect,
  selectedOptionId,
  showAnswer,
}: TestQuestionProps) => {
  const isCorrect = showAnswer && selectedOptionId === correctAnswerId;
  const isIncorrect = showAnswer && selectedOptionId !== correctAnswerId && selectedOptionId;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 text-primary font-medium rounded-full h-8 w-8 flex items-center justify-center">
          {questionNumber}
        </div>
        <h3 className="text-lg font-medium">{text}</h3>
      </div>

      <RadioGroup
        className="space-y-3 mt-4"
        value={selectedOptionId}
        onValueChange={onSelect}
        disabled={showAnswer}
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-2 p-3 rounded-md border ${
              showAnswer && option.id === correctAnswerId
                ? 'border-green-500 bg-green-500/10'
                : showAnswer && option.id === selectedOptionId
                ? 'border-red-500 bg-red-500/10'
                : 'border-border'
            }`}
          >
            <RadioGroupItem 
              value={option.id} 
              id={option.id} 
            />
            <Label 
              htmlFor={option.id} 
              className="flex-1 cursor-pointer"
            >
              {option.text}
            </Label>
            
            {showAnswer && option.id === correctAnswerId && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {showAnswer && option.id === selectedOptionId && option.id !== correctAnswerId && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        ))}
      </RadioGroup>

      {showAnswer && explanation && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-md">
          <p className="text-sm font-medium mb-1">Explanation:</p>
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      )}
    </Card>
  );
};
