'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExamComponent from '@/components/ExamComponent'

export default function Home() {
  const [username, setUsername] = useState('')
  const [course, setCourse] = useState('')
  const [level, setLevel] = useState('')
  const [startExam, setStartExam] = useState(false)

  const handleStartExam = () => {
    if (username && course && level) {
      setStartExam(true)
    }
  }

  if (startExam) {
    return <ExamComponent username={username} course={course} level={level} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">AI-Powered Exam System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Enter Course</Label>
              <Input
                id="course"
                placeholder="e.g., JavaScript Fundamentals"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Course Level</Label>
              <RadioGroup value={level} onValueChange={setLevel} className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button 
            className="w-full mt-6" 
            onClick={handleStartExam}
            disabled={!username || !course || !level}
          >
            Start Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

