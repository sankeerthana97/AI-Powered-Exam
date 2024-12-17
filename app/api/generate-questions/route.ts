import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function POST(request: Request) {
  try {
    const { course, level } = await request.json()

    let prompt = ''
    if (level === 'beginner') {
      prompt = `Generate an exam for ${course} with:
        - 5 multiple choice questions
        - 1 theory question
        Format as JSON with structure:
        {
          "quiz": [{"question": "", "options": [""], "correctAnswer": ""}],
          "theory": [{"question": ""}]
        }`
    } else if (level === 'intermediate') {
      prompt = `Generate an exam for ${course} with:
        - 10 multiple choice questions
        - 1 theory question
        - 1 simple scenario-based question
        Format as JSON with structure:
        {
          "quiz": [{"question": "", "options": [""], "correctAnswer": ""}],
          "theory": [{"question": ""}],
          "scenario": [{"context": "", "question": ""}]
        }`
    } else {
      prompt = `Generate an exam for ${course} with:
        - 10 multiple choice questions
        - 2 theory questions
        - 1 complex scenario-based problem
        Format as JSON with structure:
        {
          "quiz": [{"question": "", "options": [""], "correctAnswer": ""}],
          "theory": [{"question": ""}],
          "scenario": [{"context": "", "question": ""}]
        }`
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful exam generator that creates well-structured questions in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      stream: false,
    })

    const data = await response.json()
    const result = data.choices[0].message.content

    if (!result) {
      throw new Error('No response from OpenAI API')
    }

    // Parse the JSON response
    const questions = JSON.parse(result)
    
    // Validate the structure of the questions
    if (!questions.quiz || !Array.isArray(questions.quiz) || !questions.theory || !Array.isArray(questions.theory)) {
      throw new Error('Invalid question format received from AI model')
    }
    
    return Response.json(questions)
  } catch (error: any) {
    console.error('Error generating questions:', error)
    return Response.json(
      { 
        error: 'Failed to generate questions', 
        details: error.message || 'Unknown error occurred'
      }, 
      { status: 500 }
    )
  }
}

