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
    if (!user) {
      alert('Please login to submit the quiz!')
      navigate('/login')
      return
    }
    setSubmitting(true)
    try {
      // convert answers object to array in order
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50"><Navbar /><p className="text-center py-20 text-gray-500">Loading quiz...</p></div>
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center py-20 text-gray-500">Quiz not found</p>
      </div>
    )
  }

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-16 px-6">
          <div className={`rounded-2xl p-10 text-center shadow-lg ${
            result.passed ? 'bg-green-50 border-2 border-green-300' : 'bg-orange-50 border-2 border-orange-300'
          }`}>
            <div className="text-7xl mb-4">{result.passed ? '🎉' : '💪'}</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              {result.passed ? 'Awesome work!' : 'Keep practicing!'}
            </h2>
            <p className="text-gray-600 mb-6">{result.message}</p>

            <div className="bg-white rounded-xl p-6 mb-6 inline-block shadow-sm">
              <div className="text-6xl font-bold text-purple-600 mb-2">{result.percentage}%</div>
              <p className="text-gray-500">You got {result.score} out of {result.total} correct</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setResult(null); setAnswers({}); }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Try Again
              </button>
              <Link to="/quizzes" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300">
                More Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz taking screen
  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz.questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <Link to="/quizzes" className="text-purple-600 hover:underline text-sm mb-4 inline-block">
          ← Back to quizzes
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">{quiz.branch}</span>
            <span>{totalQuestions} questions</span>
            <span>•</span>
            <span>Progress: {answeredCount}/{totalQuestions}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              {qIndex + 1}. {q.question}
            </h3>
            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => selectAnswer(qIndex, oIndex)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    answers[qIndex] === oIndex
                      ? 'border-purple-500 bg-purple-50 text-purple-800 font-medium'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={submitQuiz}
          disabled={submitting || answeredCount < totalQuestions}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {submitting ? 'Submitting...' :
            answeredCount < totalQuestions
              ? `Answer all ${totalQuestions} questions first (${answeredCount}/${totalQuestions})`
              : '🚀 Submit Quiz'}
        </button>
      </div>
    </div>
  )
}