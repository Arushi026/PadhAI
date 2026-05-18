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

      <div className="bg-purple-600 text-white py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Quizzes 📝</h1>
        <p className="text-purple-100 text-sm md:text-base">Test your knowledge across all branches</p>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {loading && <p className="text-center text-gray-500">Loading quizzes...</p>}

        {!loading && quizzes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No quizzes available yet</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map(quiz => (
            <Link
              key={quiz._id}
              to={`/quizzes/${quiz._id}`}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border-t-4 border-purple-500"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">{quiz.branch}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{quiz.topic}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{quiz.questions?.length || 0} questions</p>
                <span className="text-purple-600 font-medium text-sm">Start Quiz →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
