import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Question {
  question: string
  options?: string[]
  correctAnswer?: string
  context?: string
}

interface QuestionComponentProps {
  questionData: Question
  questionType: 'quiz' | 'theory' | 'scenario'
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: string) => void
  onNext: () => void
}

export function QuestionComponent({
  questionData,
  questionType,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuestionComponentProps) {
  const [answer, setAnswer] = React.useState('')

  const handleAnswer = (value: string) => {
    setAnswer(value)
    onAnswer(value)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Question {questionNumber} of {totalQuestions}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questionType === 'scenario' && questionData.context && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium mb-2">Scenario:</p>
            <p>{questionData.context}</p>
          </div>
        )}
        <p className="font-medium text-lg">{questionData.question}</p>
        {questionType === 'quiz' && (
          <RadioGroup value={answer} onValueChange={handleAnswer}>
            {questionData.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q-opt-${index}`} />
                <Label htmlFor={`q-opt-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {(questionType === 'theory' || questionType === 'scenario') && (
          <Textarea
            value={answer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[150px]"
          />
        )}
        <Button onClick={onNext} className="w-full mt-4">
          {questionNumber === totalQuestions ? 'Finish Exam' : 'Next Question'}
        </Button>
      </CardContent>
    </Card>
  )
}

