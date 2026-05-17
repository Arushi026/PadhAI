import Quiz from '../models/Quiz.js'

// GET ALL QUIZZES
export const getQuizzes = async (req, res) => {
  try {
    const { branch, topic } = req.query
    const filter = {}
    if (branch) filter.branch = branch
    if (topic) filter.topic = topic

    const quizzes = await Quiz.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })

    res.json(quizzes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET SINGLE QUIZ
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('author', 'name')

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json(quiz)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// CREATE QUIZ (Admin only)
export const createQuiz = async (req, res) => {
  try {
    const { title, branch, topic, questions } = req.body

    const quiz = await Quiz.create({
      title,
      branch,
      topic,
      questions,
      author: req.user.id
    })

    res.status(201).json({
      message: 'Quiz created successfully!',
      quiz
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE QUIZ (Admin only)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json({ message: 'Quiz deleted!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// SUBMIT QUIZ (Student)
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    const { answers } = req.body
    let score = 0

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++
      }
    })

    const percentage = Math.round((score / quiz.questions.length) * 100)
let message = 'Quiz submitted!'
if (percentage === 100) message = 'Perfect score! You are a genius! 🏆'
else if (percentage >= 80) message = 'Excellent! Almost perfect! 🌟'
else if (percentage >= 60) message = 'Good job! You passed! 🎯'
else message = 'Don\'t give up! Try again 💪'

res.json({
  message,
  score,
  total: quiz.questions.length,
  percentage,
  passed: percentage >= 60
})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}