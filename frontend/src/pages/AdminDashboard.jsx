import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const BRANCHES = ['CS', 'EC', 'ME', 'CE', 'EE', 'Other']

const emptyArticle = { title: '', summary: '', content: '', branch: 'CS', topic: '', tags: '' }
const emptyQuiz = { title: '', branch: 'CS', topic: '', questions: [] }
const emptyQuestion = { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [articles, setArticles] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  // Article form
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [articleForm, setArticleForm] = useState(emptyArticle)
  const [articleSaving, setArticleSaving] = useState(false)

  // Quiz form
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [quizForm, setQuizForm] = useState(emptyQuiz)
  const [quizQuestions, setQuizQuestions] = useState([{ ...emptyQuestion }])
  const [quizSaving, setQuizSaving] = useState(false)

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
    if (!user) navigate('/login')
  }, [user])

  // Load all data
  useEffect(() => {
    if (user?.role === 'admin') loadAll()
  }, [user])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [statsRes, articlesRes, quizzesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/articles'),
        api.get('/quizzes')
      ])
      setStats(statsRes.data)
      setArticles(articlesRes.data)
      setQuizzes(quizzesRes.data)
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── ARTICLE CRUD ───────────────────────────────────────────────────────────
  const openCreateArticle = () => {
    setEditingArticle(null)
    setArticleForm(emptyArticle)
    setShowArticleForm(true)
  }

  const openEditArticle = (article) => {
    setEditingArticle(article)
    setArticleForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      branch: article.branch,
      topic: article.topic,
      tags: article.tags?.join(', ') || ''
    })
    setShowArticleForm(true)
  }

  const saveArticle = async () => {
    setArticleSaving(true)
    try {
      const payload = {
        ...articleForm,
        tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      if (editingArticle) {
        await api.put(`/articles/${editingArticle._id}`, payload)
      } else {
        await api.post('/articles', payload)
      }
      setShowArticleForm(false)
      loadAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save article')
    } finally {
      setArticleSaving(false)
    }
  }

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return
    await api.delete(`/articles/${id}`)
    loadAll()
  }

  // ── QUIZ CRUD ──────────────────────────────────────────────────────────────
  const openCreateQuiz = () => {
    setQuizForm(emptyQuiz)
    setQuizQuestions([{ ...emptyQuestion, options: ['', '', '', ''] }])
    setShowQuizForm(true)
  }

  const updateQuestion = (qi, field, value) => {
    setQuizQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q))
  }

  const updateOption = (qi, oi, value) => {
    setQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q
      const options = [...q.options]
      options[oi] = value
      return { ...q, options }
    }))
  }

  const addQuestion = () => setQuizQuestions(prev => [...prev, { ...emptyQuestion, options: ['', '', '', ''] }])
  const removeQuestion = (qi) => setQuizQuestions(prev => prev.filter((_, i) => i !== qi))

  const saveQuiz = async () => {
    setQuizSaving(true)
    try {
      const payload = { ...quizForm, questions: quizQuestions }
      await api.post('/quizzes', payload)
      setShowQuizForm(false)
      loadAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quiz')
    } finally {
      setQuizSaving(false)
    }
  }

  const deleteQuiz = async (id) => {
    if (!confirm('Delete this quiz?')) return
    await api.delete(`/quizzes/${id}`)
    loadAll()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center py-20 text-gray-500">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard 🛠️</h1>
          <p className="text-purple-200">Manage PadhAI content and monitor platform stats</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'stats', label: '📊 Stats' },
            { id: 'articles', label: '📝 Articles' },
            { id: 'quizzes', label: '🧠 Quizzes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 font-medium text-sm rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 border border-b-white border-gray-200 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── STATS TAB ── */}
        {activeTab === 'stats' && stats && (
          <div>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'blue' },
                { label: 'Total Articles', value: stats.totalArticles, icon: '📝', color: 'green' },
                { label: 'Total Quizzes', value: stats.totalQuizzes, icon: '🧠', color: 'purple' }
              ].map(card => (
                <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{card.icon}</span>
                    <span className={`text-4xl font-bold text-${card.color}-600`}>{card.value}</span>
                  </div>
                  <p className="text-gray-500 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Recent users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Signups 👤</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-medium">Name</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Email</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Branch</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-800">{u.name}</td>
                        <td className="py-3 text-gray-500">{u.email}</td>
                        <td className="py-3">
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{u.branch}</span>
                        </td>
                        <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ARTICLES TAB ── */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">All Articles ({articles.length})</h2>
              <button onClick={openCreateArticle}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                + New Article
              </button>
            </div>

            {/* Article Form */}
            {showArticleForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">{editingArticle ? 'Edit Article' : 'Create Article'}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Title *</label>
                    <input value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="Article title" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Branch *</label>
                    <select value={articleForm.branch} onChange={e => setArticleForm({ ...articleForm, branch: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400">
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Topic *</label>
                    <input value={articleForm.topic} onChange={e => setArticleForm({ ...articleForm, topic: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="e.g. DSA, Circuits" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Summary *</label>
                    <input value={articleForm.summary} onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="Short summary" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Tags (comma separated)</label>
                    <input value={articleForm.tags} onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
                      placeholder="arrays, DSA, beginner" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Content *</label>
                    <textarea value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                      rows={8}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Full article content..." />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveArticle} disabled={articleSaving}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                    {articleSaving ? 'Saving...' : editingArticle ? '💾 Update Article' : '✅ Create Article'}
                  </button>
                  <button onClick={() => setShowArticleForm(false)}
                    className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Articles list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {articles.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No articles yet. Create your first one!</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Branch</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Topic</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Views</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article._id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{article.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{article.branch}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{article.topic}</td>
                        <td className="px-6 py-4 text-gray-500">👁 {article.views}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditArticle(article)}
                              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-yellow-200">
                              ✏️ Edit
                            </button>
                            <button onClick={() => deleteArticle(article._id)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200">
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── QUIZZES TAB ── */}
        {activeTab === 'quizzes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">All Quizzes ({quizzes.length})</h2>
              <button onClick={openCreateQuiz}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700">
                + New Quiz
              </button>
            </div>

            {/* Quiz Form */}
            {showQuizForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Create Quiz</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Quiz Title *</label>
                    <input value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-purple-400"
                      placeholder="Quiz title" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Branch *</label>
                    <select value={quizForm.branch} onChange={e => setQuizForm({ ...quizForm, branch: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-purple-400">
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Topic *</label>
                    <input value={quizForm.topic} onChange={e => setQuizForm({ ...quizForm, topic: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-purple-400"
                      placeholder="e.g. DSA, Circuits" />
                  </div>
                </div>

                {/* Questions */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Questions</h4>
                    <button onClick={addQuestion}
                      className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-200">
                      + Add Question
                    </button>
                  </div>

                  {quizQuestions.map((q, qi) => (
                    <div key={qi} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700 text-sm">Question {qi + 1}</span>
                        {quizQuestions.length > 1 && (
                          <button onClick={() => removeQuestion(qi)}
                            className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                        )}
                      </div>
                      <input value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:border-purple-400 bg-white"
                        placeholder="Question text" />
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + oi)}.</span>
                            <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                              placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 items-center">
                        <div>
                          <label className="text-xs text-gray-500 font-medium">Correct Answer</label>
                          <select value={q.correctAnswer} onChange={e => updateQuestion(qi, 'correctAnswer', Number(e.target.value))}
                            className="ml-2 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 bg-white">
                            {['A', 'B', 'C', 'D'].map((l, i) => <option key={i} value={i}>{l}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <input value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                            placeholder="Explanation (optional)" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={saveQuiz} disabled={quizSaving}
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60">
                    {quizSaving ? 'Saving...' : '✅ Create Quiz'}
                  </button>
                  <button onClick={() => setShowQuizForm(false)}
                    className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quizzes list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {quizzes.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No quizzes yet. Create your first one!</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Branch</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Topic</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Questions</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map(quiz => (
                      <tr key={quiz._id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{quiz.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs">{quiz.branch}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{quiz.topic}</td>
                        <td className="px-6 py-4 text-gray-500">{quiz.questions?.length || 0} Qs</td>
                        <td className="px-6 py-4">
                          <button onClick={() => deleteQuiz(quiz._id)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200">
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-16" />
    </div>
  )
}
