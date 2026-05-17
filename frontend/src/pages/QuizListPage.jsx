import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-purple-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Quizzes 📝</h1>
        <p className="text-purple-100">Test your knowledge across all branches</p>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6">
        {loading && <p className="text-center text-gray-500">Loading quizzes...</p>}

        {!loading && quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No quizzes available yet</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map(quiz => (
            <Link
              key={quiz._id}
              to={`/quizzes/${quiz._id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-t-4 border-purple-500"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  {quiz.branch}
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {quiz.topic}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-gray-500 text-sm mb-3">
                {quiz.questions?.length || 0} questions • By {quiz.author?.name || 'PadhAI'}
              </p>
              <span className="text-purple-600 font-medium">Start Quiz →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}