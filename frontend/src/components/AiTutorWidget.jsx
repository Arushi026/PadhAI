import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Simple markdown renderer for bold, code, bullets
function renderMarkdown(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Heading
    if (line.startsWith('## ')) {
      return <p key={i} className="font-bold text-purple-700 mt-2 mb-1">{line.slice(3)}</p>
    }
    if (line.startsWith('# ')) {
      return <p key={i} className="font-bold text-purple-800 mt-2 mb-1 text-base">{line.slice(2)}</p>
    }
    // Bullet
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-purple-400 mt-0.5">•</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>
      )
    }
    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const [num, ...rest] = line.split('. ')
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-purple-500 font-bold min-w-[1.2rem]">{num}.</span>
          <span>{inlineFormat(rest.join('. '))}</span>
        </div>
      )
    }
    // Code block line
    if (line.startsWith('```') || line.startsWith('    ')) {
      return <code key={i} className="block bg-gray-800 text-green-300 text-xs px-2 py-0.5 rounded my-0.5 font-mono">{line.replace(/^```\w*/, '').trim()}</code>
    }
    // Empty line
    if (line.trim() === '') return <div key={i} className="h-1" />
    // Normal paragraph
    return <p key={i} className="my-0.5 leading-relaxed">{inlineFormat(line)}</p>
  })
}

function inlineFormat(text) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-100 text-purple-700 text-xs px-1 rounded font-mono">{part.slice(1, -1)}</code>
    }
    return part
  })
}

export default function AiTutorWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your **PadhAI Tutor** 🎓\n\nAsk me anything — DSA, circuits, thermodynamics, calculus, you name it!\n\nI'm here to make engineering concepts click for you."
    }
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (!user) {
      navigate('/login')
      return
    }

    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      // Build history from current messages (exclude the initial greeting)
      const history = messages
        .filter((_, i) => i > 0) // skip greeting
        .map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))

      const res = await api.post('/ai/tutor', { question, history })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: err.response?.status === 401
          ? "Please **login** to use the AI Tutor! 🔐"
          : "Oops! Something went wrong. Please try again. 🙏"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* ── Chat Panel ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[360px] max-h-[560px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.2s ease-out' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🎓</div>
              <div>
                <p className="text-white font-bold text-sm leading-none">PadhAI Tutor</p>
                <p className="text-purple-200 text-xs mt-0.5">Powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-xl leading-none transition">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
            style={{ maxHeight: '380px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0">🎓</div>
                )}
                <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-snug
                  ${msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}>
                  {msg.role === 'ai' ? renderMarkdown(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs mr-2 mt-1">🎓</div>
                <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100">
            {!user && (
              <p className="text-xs text-center text-gray-400 mb-2">
                <button onClick={() => navigate('/login')} className="text-purple-600 font-medium hover:underline">Login</button> to chat with the tutor
              </p>
            )}
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Enter to send)"
                rows={1}
                disabled={!user}
                className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 disabled:bg-gray-50 disabled:text-gray-400 max-h-24"
                style={{ overflowY: 'auto' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || !user}
                className="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1.5">Shift+Enter for new line</p>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center text-2xl"
        title="Ask AI Tutor"
      >
        {isOpen ? '✕' : '🎓'}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
