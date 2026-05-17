import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

// Simple markdown renderer (same pattern as tutor widget)
function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-gray-800 mt-6 mb-2">{line.slice(3)}</h3>
    if (line.startsWith('# '))  return <h2 key={i} className="text-2xl font-bold text-gray-800 mt-6 mb-2">{line.slice(2)}</h2>
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} className="ml-4 my-1 text-gray-700 list-disc">{line.slice(2)}</li>
    }
    if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 my-1 text-gray-700 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
    if (line.trim() === '') return <div key={i} className="h-3" />
    return <p key={i} className="my-1.5 text-gray-700 leading-relaxed">{line}</p>
  })
}

export default function ArticlePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  // Simplify state
  const [simplified, setSimplified] = useState(null)
  const [simplifying, setSimplifying] = useState(false)
  const [showSimplified, setShowSimplified] = useState(false)

  // Quiz generator state
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [savingQuiz, setSavingQuiz] = useState(false)
  const [quizSaved, setQuizSaved] = useState(false)
  const [numQuestions, setNumQuestions] = useState(5)

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [id])

  // ── Simplify Article ──────────────────────────────────────────────────────
  const handleSimplify = async () => {
    if (!user) { navigate('/login'); return }
    if (simplified) { setShowSimplified(true); return } // already fetched

    setSimplifying(true)
    try {
      const res = await api.post('/ai/simplify', {
        title: article.title,
        content: article.content
      })
      setSimplified(res.data.simplified)
      setShowSimplified(true)
    } catch {
      alert('Simplification failed. Please try again.')
    } finally {
      setSimplifying(false)
    }
  }

  // ── Generate Quiz ─────────────────────────────────────────────────────────
  const handleGenerateQuiz = async () => {
    if (!user) { navigate('/login'); return }

    setGeneratingQuiz(true)
    setGeneratedQuiz(null)
    setQuizSaved(false)
    try {
      const res = await api.post('/ai/generate-quiz', {
        title: article.title,
        content: article.content,
        branch: article.branch,
        topic: article.topic,
        numQuestions
      })
      setGeneratedQuiz(res.data.quiz)
    } catch {
      alert('Quiz generation failed. Please try again.')
    } finally {
      setGeneratingQuiz(false)
    }
  }

  // ── Save generated quiz to DB (admin only) ────────────────────────────────
  const handleSaveQuiz = async () => {
    if (!generatedQuiz) return
    setSavingQuiz(true)
    try {
      await api.post('/quizzes', generatedQuiz)
      setQuizSaved(true)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quiz.')
    } finally {
      setSavingQuiz(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center py-20 text-gray-500">Loading article...</p>
    </div>
  )

  if (!article) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center py-20 text-gray-500">Article not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-10 px-6">
        <Link to={`/branches/${article.branch}`} className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to {article.branch}
        </Link>

        {/* Article card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{article.branch}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{article.topic}</span>
            {article.tags?.map(tag => (
              <span key={tag} className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">{article.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <span>By <strong className="text-gray-700">{article.author?.name || 'PadhAI'}</strong></span>
            <span>👁 {article.views} views</span>
          </div>

          {/* Summary box */}
          {article.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-5 py-4 mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Summary</p>
              <p className="text-gray-700 text-sm leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* ── AI Feature Buttons ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleSimplify}
            disabled={simplifying}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {simplifying ? (
              <><span className="animate-spin">⚙️</span> Simplifying...</>
            ) : (
              <><span>✨</span> Simplify with AI</>
            )}
          </button>

          <button
            onClick={() => setGeneratedQuiz(null) || document.getElementById('quiz-gen-panel').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
          >
            <span>🧠</span> Generate Quiz
          </button>
        </div>

        {/* ── Simplified View ── */}
        {showSimplified && simplified && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Simplified Version</h2>
                  <p className="text-xs text-purple-500">Made beginner-friendly by AI</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimplified(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Hide ✕
              </button>
            </div>
            <div className="text-sm leading-relaxed">
              {renderMarkdown(simplified)}
            </div>
          </div>
        )}

        {/* ── Quiz Generator Panel ── */}
        <div id="quiz-gen-panel" className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🧠</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Quiz Generator</h2>
              <p className="text-xs text-green-600">Auto-generate MCQs from this article</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-600 font-medium">Number of questions:</label>
            <select
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400"
            >
              {[3, 5, 7, 10].map(n => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={generatingQuiz}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {generatingQuiz ? (
              <><span className="animate-spin inline-block">⚙️</span> Generating {numQuestions} questions...</>
            ) : (
              <><span>🧠</span> Generate {numQuestions}-Question Quiz</>
            )}
          </button>

          {/* Generated Quiz Preview */}
          {generatedQuiz && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">{generatedQuiz.title}</h3>
                {user?.role === 'admin' && !quizSaved && (
                  <button
                    onClick={handleSaveQuiz}
                    disabled={savingQuiz}
                    className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60"
                  >
                    {savingQuiz ? 'Saving...' : '💾 Save to Quiz Bank'}
                  </button>
                )}
                {quizSaved && (
                  <span className="text-green-600 font-medium text-sm">✅ Saved to Quiz Bank!</span>
                )}
              </div>

              <div className="space-y-4">
                {generatedQuiz.questions.map((q, qi) => (
                  <div key={qi} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`px-3 py-2 rounded-lg text-sm border ${
                          oi === q.correctAnswer
                            ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                          {oi === q.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-2 text-xs text-gray-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {user?.role !== 'admin' && (
                <p className="text-xs text-gray-400 mt-3 text-center">Only admins can save quizzes to the quiz bank.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
