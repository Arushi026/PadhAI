import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const BRANCH_INFO = {
  CS:    { name: 'Computer Science', emoji: '💻', color: 'bg-blue-600' },
  EC:    { name: 'Electronics',      emoji: '⚡', color: 'bg-yellow-500' },
  ME:    { name: 'Mechanical',       emoji: '⚙️', color: 'bg-red-500' },
  CE:    { name: 'Civil',            emoji: '🏗️', color: 'bg-green-600' },
  EE:    { name: 'Electrical',       emoji: '🔌', color: 'bg-purple-600' },
  Other: { name: 'Other',            emoji: '📚', color: 'bg-gray-600' },
}

export default function BranchPage() {
  const { code } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const info = BRANCH_INFO[code] || { name: code, emoji: '📚', color: 'bg-blue-600' }

  useEffect(() => {
    api.get(`/articles?branch=${code}`)
      .then(res => setArticles(res.data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [code])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className={`${info.color} text-white py-10 px-4 text-center`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{info.name} {info.emoji}</h1>
        <p className="text-white/80 text-sm md:text-base">Explore articles for {info.name} branch</p>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {loading && <p className="text-center text-gray-500">Loading articles...</p>}

        {!loading && articles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">No articles yet for this branch. Check back soon!</p>
          </div>
        )}

        <div className="space-y-4">
          {articles.map(article => (
            <div key={article._id} className="bg-white rounded-2xl shadow-sm border-l-4 border-blue-500 p-5 hover:shadow-md transition">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{article.topic}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">👁 {article.views} views</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{article.title}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{article.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">By {article.author?.name || 'PadhAI'}</span>
                <Link to={`/articles/${article._id}`} className="text-blue-600 font-medium text-sm hover:underline">
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
