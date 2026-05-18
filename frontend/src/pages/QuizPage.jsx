import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const selectAnswer = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex })
  }

  const submitQuiz = async () => {
    if (!user) { navigate('/login'); return }
    setSubmitting(true)
    try {
      const answersArray = quiz.questions.map((_, i) => answers[i] ?? -1)
      const res = await api.post(`/quizzes/${id}/submit`, { answers: answersArray })
      setResult(res.data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <p className="text-center py-20 text-gray-500">Loading quiz...</p>
    </div>
  )

  if (!quiz) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <p className="text-center py-20 text-gray-500">Quiz not found</p>
    </div>
  )

  // Result screen
  if (result) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="max-w-lg mx-auto py-10 px-4">
        <div className={`rounded-2xl p-8 text-center shadow-lg ${result.passed ? 'bg-green-50 border-2 border-green-300' : 'bg-orange-50 border-2 border-orange-300'}`}>
          <div className="text-6xl mb-4">{result.passed ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{result.passed ? 'Awesome work!' : 'Keep practicing!'}</h2>
          <p className="text-gray-600 mb-6 text-sm">{result.message}</p>
          <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
            <div className="text-5xl font-bold text-purple-600 mb-1">{result.percentage}%</div>
            <p className="text-gray-500 text-sm">You got {result.score} out of {result.total} correct</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setResult(null); setAnswers({}) }}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700">
              Try Again
            </button>
            <Link to="/quizzes" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 text-center">
              More Quizzes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz.questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-6 px-4">
        <Link to="/quizzes" className="text-purple-600 hover:underline text-sm mb-4 inline-block">← Back to quizzes</Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">{quiz.branch}</span>
            <span>{totalQuestions} questions</span>
            <span>Progress: {answeredCount}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
          </div>
        </div>

        {/* Questions */}
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-2xl shadow-sm p-5 mb-3">
            <h3 className="font-bold text-base text-gray-800 mb-4">{qIndex + 1}. {q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <button key={oIndex} onClick={() => selectAnswer(qIndex, oIndex)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition text-sm ${
                    answers[qIndex] === oIndex
                      ? 'border-purple-500 bg-purple-50 text-purple-800 font-medium'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + oIndex)}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={submitQuiz} disabled={submitting || answeredCount < totalQuestions}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-2">
          {submitting ? 'Submitting...' :
            answeredCount < totalQuestions
              ? `Answer all ${totalQuestions} questions (${answeredCount}/${totalQuestions})`
              : '🚀 Submit Quiz'}
        </button>
      </div>
    </div>
  )
}
