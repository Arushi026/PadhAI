import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const branchNames = {
  CS: 'Computer Science',
  EC: 'Electronics',
  ME: 'Mechanical',
  CE: 'Civil',
  EE: 'Electrical',
  Other: 'Other'
}

export default function BranchPage() {
  const { code } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get(`/articles?branch=${code}`)
        setArticles(res.data)
      } catch (err) {
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [code])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">
          {branchNames[code] || code} 📚
        </h1>
        <p className="text-blue-100">
          Explore articles for {branchNames[code] || code} branch
        </p>
      </div>

      {/* Articles List */}
      <div className="max-w-5xl mx-auto py-10 px-6">
        {loading && (
          <p className="text-center text-gray-500">Loading articles...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">
              No articles yet for this branch. Check back soon!
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {articles.map((article) => (
            <Link
              key={article._id}
              to={`/articles/${article._id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {article.topic}
                </span>
                <span className="text-xs text-gray-400">
                  👁 {article.views} views
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-3">{article.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  By {article.author?.name || 'PadhAI'}
                </span>
                <span className="text-blue-600 font-medium">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
