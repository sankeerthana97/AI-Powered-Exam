'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Question {
  question: string
  options?: string[]
  correctAnswer?: string
}

interface ExamData {
  quiz: Question[]
  theory: Question[]
  scenario?: Question[]
}

interface ResultsComponentProps {
  username: string
  course: string
  level: string
  questions: ExamData
  answers: string[]
}

export default function ResultsComponent({
  username,
  course,
  level,
  questions,
  answers,
}: ResultsComponentProps) {
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    // Calculate score
    let totalScore = 0
    let maxScore = 0

    // Quiz questions (40% of total score)
    const quizScore = questions.quiz.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)
    totalScore += (quizScore / questions.quiz.length) * 40

    // Theory questions (30% of total score)
    const theoryStartIndex = questions.quiz.length
    const theoryWeight = questions.theory.length > 1 ? 15 : 30 // 15% each for advanced level
    questions.theory.forEach((_, index) => {
      if (answers[theoryStartIndex + index]?.length > 50) { // Basic length check
        totalScore += theoryWeight
      }
    })

    // Scenario questions (30% of total score)
    if (questions.scenario) {
      const scenarioStartIndex = questions.quiz.length + questions.theory.length
      questions.scenario.forEach((_, index) => {
        if (answers[scenarioStartIndex + index]?.length > 100) { // Basic length check
          totalScore += 30
        }
      })
    }

    setScore(Math.round(totalScore))
  }, [questions, answers])

  const generateCertificate = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 700
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // Background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 1000, 700)

      // Decorative border
      ctx.strokeStyle = '#c084fc' // Purple border
      ctx.lineWidth = 20
      ctx.strokeRect(20, 20, 960, 660)

      // Inner border
      ctx.strokeStyle = '#f0abfc' // Light purple border
      ctx.lineWidth = 2
      ctx.strokeRect(40, 40, 920, 620)

      // Title
      ctx.font = 'bold 50px Arial'
      ctx.fillStyle = '#581c87' // Dark purple text
      ctx.textAlign = 'center'
      ctx.fillText('Certificate of Completion', 500, 150)

      // Content
      ctx.font = '30px Arial'
      ctx.fillStyle = '#000000'
      ctx.fillText('This is to certify that', 500, 250)
      
      ctx.font = 'bold 40px Arial'
      ctx.fillText(username, 500, 320)
      
      ctx.font = '30px Arial'
      ctx.fillText('has successfully completed the course', 500, 380)
      
      ctx.font = 'bold 35px Arial'
      ctx.fillText(`${course} - ${level} level`, 500, 440)
      
      ctx.font = '30px Arial'
      ctx.fillText(`with a score of ${score}%`, 500, 500)

      // Date
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      ctx.font = '25px Arial'
      ctx.fillText(`Issued on ${date}`, 500, 580)

      // Convert to image and download
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${username}-${course}-certificate.png`
      link.href = image
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Exam Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg"><strong>Name:</strong> {username}</p>
            <p className="text-lg"><strong>Course:</strong> {course}</p>
            <p className="text-lg"><strong>Level:</strong> {level}</p>
            <p className="text-2xl font-bold mt-4">Final Score: {score}%</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Score Breakdown:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Multiple Choice Questions: {Math.round((questions.quiz.filter((_, index) => 
                answers[index] === questions.quiz[index].correctAnswer).length / questions.quiz.length) * 40)}% (out of 40%)</li>
              <li>Theory Questions: {questions.theory.filter((_, index) => 
                answers[questions.quiz.length + index]?.length > 50).length * 
                (questions.theory.length > 1 ? 15 : 30)}% (out of {questions.theory.length * (questions.theory.length > 1 ? 15 : 30)}%)</li>
              {questions.scenario && (
                <li>Scenario Questions: {questions.scenario.filter((_, index) => 
                  answers[questions.quiz.length + questions.theory.length + index]?.length > 100).length * 30}% (out of 30%)</li>
              )}
            </ul>
          </div>

          <Button onClick={generateCertificate} className="w-full mt-6">
            Download Certificate
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

