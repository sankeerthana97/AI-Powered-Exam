'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ResultsComponent from './ResultsComponent'
import { QuestionComponent } from './QuestionComponent'

interface Question {
  question: string
  options?: string[]
  correctAnswer?: string
  context?: string
}

interface ExamData {
  quiz: Question[]
  theory: Question[]
  scenario?: Question[]
}

interface ExamComponentProps {
  username: string
  course: string
  level: string
}

export default function ExamComponent({ username, course, level }: ExamComponentProps) {
  const [questions, setQuestions] = useState<ExamData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [examCompleted, setExamCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course, level }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (!data.quiz || !Array.isArray(data.quiz) || !data.theory || !Array.isArray(data.theory)) {
          throw new Error('Invalid question format received from API')
        }
        setQuestions(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching questions:', error)
        setError(`Failed to fetch questions: ${error.message}`)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [course, level])

  const handleAnswer = (answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = answer
      return newAnswers
    })
  }

  const handleNext = () => {
    if (questions) {
      const totalQuestions = questions.quiz.length + questions.theory.length + (questions.scenario?.length || 0)
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setExamCompleted(true)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Loading exam questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">No questions available. Please try again.</p>
            <Button className="w-full mt-4" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (examCompleted) {
    return (
      <ResultsComponent
        username={username}
        course={course}
        level={level}
        questions={questions}
        answers={answers}
      />
    )
  }

  const allQuestions = [
    ...questions.quiz.map(q => ({ ...q, type: 'quiz' as const })),
    ...questions.theory.map(q => ({ ...q, type: 'theory' as const })),
    ...(questions.scenario?.map(q => ({ ...q, type: 'scenario' as const })) || [])
  ]

  const currentQuestion = allQuestions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 flex items-center justify-center">
      <QuestionComponent
        questionData={currentQuestion}
        questionType={currentQuestion.type}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={allQuestions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  )
}

