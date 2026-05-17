import express from 'express'
import Groq from 'groq-sdk'
import authenticate from '../middleware/auth.js'

const router = express.Router()

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

router.post('/tutor', authenticate, async (req, res) => {
  try {
    const { question } = req.body
    if (!question?.trim()) return res.status(400).json({ message: 'Question is required' })

    const groq = getGroq()
    const result = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are PadhAI Tutor — a friendly expert AI tutor for engineering students. Help with CS, EC, ME, CE, EE and more. Keep answers clear, structured and beginner-friendly with examples. Use simple markdown.' },
        { role: 'user', content: question }
      ]
    })

    res.json({ answer: result.choices[0].message.content })
  } catch (err) {
    console.error('Tutor error:', err)
    res.status(500).json({ message: 'AI Tutor failed. Please try again.' })
  }
})

router.post('/simplify', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Article content is required' })

    const groq = getGroq()
    const result = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a teacher explaining complex topics to beginners. Use simple words, real-world analogies, ## headings, bullet points, and add an "In Simple Words" summary at the end.' },
        { role: 'user', content: `Simplify this article:\nTitle: "${title}"\nContent: ${content}` }
      ]
    })

    res.json({ simplified: result.choices[0].message.content })
  } catch (err) {
    console.error('Simplify error:', err)
    res.status(500).json({ message: 'Simplification failed. Please try again.' })
  }
})

router.post('/generate-quiz', authenticate, async (req, res) => {
  try {
    const { title, content, branch, topic, numQuestions = 5 } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Article content is required' })

    const groq = getGroq()
    const result = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a quiz generator. Return ONLY a valid JSON array, no markdown, no backticks, no explanation.' },
        { role: 'user', content: `Generate exactly ${numQuestions} MCQs from this article.
Title: "${title}"
Content: ${content}
Format: [{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]` }
      ]
    })

    let text = result.choices[0].message.content.trim()
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const questions = JSON.parse(text)

    res.json({
      message: 'Quiz generated successfully!',
      quiz: { title: `${title} - AI Quiz`, branch: branch || 'CS', topic: topic || title, questions }
    })
  } catch (err) {
    console.error('Quiz gen error:', err)
    res.status(500).json({ message: 'Quiz generation failed. Please try again.' })
  }
})

export default router