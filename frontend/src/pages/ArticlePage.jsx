// import { useEffect, useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import api from '../api/axios'
// import Navbar from '../components/Navbar'
// import { useAuth } from '../context/AuthContext'

// // Simple markdown renderer (same pattern as tutor widget)
// function renderMarkdown(text) {
//   if (!text) return null
//   const lines = text.split('\n')
//   return lines.map((line, i) => {
//     if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-gray-800 mt-6 mb-2">{line.slice(3)}</h3>
//     if (line.startsWith('# '))  return <h2 key={i} className="text-2xl font-bold text-gray-800 mt-6 mb-2">{line.slice(2)}</h2>
//     if (line.startsWith('- ') || line.startsWith('• ')) {
//       return <li key={i} className="ml-4 my-1 text-gray-700 list-disc">{line.slice(2)}</li>
//     }
//     if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 my-1 text-gray-700 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
//     if (line.trim() === '') return <div key={i} className="h-3" />
//     return <p key={i} className="my-1.5 text-gray-700 leading-relaxed">{line}</p>
//   })
// }

// export default function ArticlePage() {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const [article, setArticle] = useState(null)
//   const [loading, setLoading] = useState(true)

//   // Simplify state
//   const [simplified, setSimplified] = useState(null)
//   const [simplifying, setSimplifying] = useState(false)
//   const [showSimplified, setShowSimplified] = useState(false)

//   // Quiz generator state
//   const [generatingQuiz, setGeneratingQuiz] = useState(false)
//   const [generatedQuiz, setGeneratedQuiz] = useState(null)
//   const [savingQuiz, setSavingQuiz] = useState(false)
//   const [quizSaved, setQuizSaved] = useState(false)
//   const [numQuestions, setNumQuestions] = useState(5)

//   useEffect(() => {
//     api.get(`/articles/${id}`)
//       .then(res => setArticle(res.data))
//       .catch(() => setArticle(null))
//       .finally(() => setLoading(false))
//   }, [id])

//   // ── Simplify Article ──────────────────────────────────────────────────────
//   const handleSimplify = async () => {
//     if (!user) { navigate('/login'); return }
//     if (simplified) { setShowSimplified(true); return } // already fetched

//     setSimplifying(true)
//     try {
//       const res = await api.post('/ai/simplify', {
//         title: article.title,
//         content: article.content
//       })
//       setSimplified(res.data.simplified)
//       setShowSimplified(true)
//     } catch {
//       alert('Simplification failed. Please try again.')
//     } finally {
//       setSimplifying(false)
//     }
//   }

//   // ── Generate Quiz ─────────────────────────────────────────────────────────
//   const handleGenerateQuiz = async () => {
//     if (!user) { navigate('/login'); return }

//     setGeneratingQuiz(true)
//     setGeneratedQuiz(null)
//     setQuizSaved(false)
//     try {
//       const res = await api.post('/ai/generate-quiz', {
//         title: article.title,
//         content: article.content,
//         branch: article.branch,
//         topic: article.topic,
//         numQuestions
//       })
//       setGeneratedQuiz(res.data.quiz)
//     } catch {
//       alert('Quiz generation failed. Please try again.')
//     } finally {
//       setGeneratingQuiz(false)
//     }
//   }

//   // ── Save generated quiz to DB (admin only) ────────────────────────────────
//   const handleSaveQuiz = async () => {
//     if (!generatedQuiz) return
//     setSavingQuiz(true)
//     try {
//       await api.post('/quizzes', generatedQuiz)
//       setQuizSaved(true)
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to save quiz.')
//     } finally {
//       setSavingQuiz(false)
//     }
//   }

//   if (loading) return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <p className="text-center py-20 text-gray-500">Loading article...</p>
//     </div>
//   )

//   if (!article) return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <p className="text-center py-20 text-gray-500">Article not found.</p>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="max-w-3xl mx-auto py-10 px-6">
//         <Link to={`/branches/${article.branch}`} className="text-blue-600 hover:underline text-sm mb-4 inline-block">
//           ← Back to {article.branch}
//         </Link>

//         {/* Article card */}
//         <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{article.branch}</span>
//             <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{article.topic}</span>
//             {article.tags?.map(tag => (
//               <span key={tag} className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">{tag}</span>
//             ))}
//           </div>

//           <h1 className="text-3xl font-bold text-gray-800 mb-3">{article.title}</h1>

//           <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
//             <span>By <strong className="text-gray-700">{article.author?.name || 'PadhAI'}</strong></span>
//             <span>👁 {article.views} views</span>
//           </div>

//           {/* Summary box */}
//           {article.summary && (
//             <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-5 py-4 mb-6">
//               <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Summary</p>
//               <p className="text-gray-700 text-sm leading-relaxed">{article.summary}</p>
//             </div>
//           )}

//           {/* Content */}
//           <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
//             {article.content}
//           </div>
//         </div>

//         {/* ── AI Feature Buttons ── */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           <button
//             onClick={handleSimplify}
//             disabled={simplifying}
//             className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
//           >
//             {simplifying ? (
//               <><span className="animate-spin">⚙️</span> Simplifying...</>
//             ) : (
//               <><span>✨</span> Simplify with AI</>
//             )}
//           </button>

//           <button
//             onClick={() => setGeneratedQuiz(null) || document.getElementById('quiz-gen-panel').scrollIntoView({ behavior: 'smooth' })}
//             className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
//           >
//             <span>🧠</span> Generate Quiz
//           </button>
//         </div>

//         {/* ── Simplified View ── */}
//         {showSimplified && simplified && (
//           <div className="bg-white rounded-2xl shadow-md p-8 mb-6 border-2 border-purple-100">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">✨</span>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">Simplified Version</h2>
//                   <p className="text-xs text-purple-500">Made beginner-friendly by AI</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowSimplified(false)}
//                 className="text-gray-400 hover:text-gray-600 text-sm"
//               >
//                 Hide ✕
//               </button>
//             </div>
//             <div className="text-sm leading-relaxed">
//               {renderMarkdown(simplified)}
//             </div>
//           </div>
//         )}

//         {/* ── Quiz Generator Panel ── */}
//         <div id="quiz-gen-panel" className="bg-white rounded-2xl shadow-md p-8 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-2xl">🧠</span>
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">AI Quiz Generator</h2>
//               <p className="text-xs text-green-600">Auto-generate MCQs from this article</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 mb-4">
//             <label className="text-sm text-gray-600 font-medium">Number of questions:</label>
//             <select
//               value={numQuestions}
//               onChange={e => setNumQuestions(Number(e.target.value))}
//               className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400"
//             >
//               {[3, 5, 7, 10].map(n => (
//                 <option key={n} value={n}>{n} questions</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={handleGenerateQuiz}
//             disabled={generatingQuiz}
//             className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
//           >
//             {generatingQuiz ? (
//               <><span className="animate-spin inline-block">⚙️</span> Generating {numQuestions} questions...</>
//             ) : (
//               <><span>🧠</span> Generate {numQuestions}-Question Quiz</>
//             )}
//           </button>

//           {/* Generated Quiz Preview */}
//           {generatedQuiz && (
//             <div className="mt-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-bold text-gray-800">{generatedQuiz.title}</h3>
//                 {user?.role === 'admin' && !quizSaved && (
//                   <button
//                     onClick={handleSaveQuiz}
//                     disabled={savingQuiz}
//                     className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60"
//                   >
//                     {savingQuiz ? 'Saving...' : '💾 Save to Quiz Bank'}
//                   </button>
//                 )}
//                 {quizSaved && (
//                   <span className="text-green-600 font-medium text-sm">✅ Saved to Quiz Bank!</span>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 {generatedQuiz.questions.map((q, qi) => (
//                   <div key={qi} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
//                     <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.question}</p>
//                     <div className="grid grid-cols-1 gap-1.5">
//                       {q.options.map((opt, oi) => (
//                         <div key={oi} className={`px-3 py-2 rounded-lg text-sm border ${
//                           oi === q.correctAnswer
//                             ? 'bg-green-50 border-green-300 text-green-800 font-medium'
//                             : 'bg-white border-gray-200 text-gray-600'
//                         }`}>
//                           <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
//                           {opt}
//                           {oi === q.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
//                         </div>
//                       ))}
//                     </div>
//                     {q.explanation && (
//                       <p className="mt-2 text-xs text-gray-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
//                         💡 {q.explanation}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {user?.role !== 'admin' && (
//                 <p className="text-xs text-gray-400 mt-3 text-center">Only admins can save quizzes to the quiz bank.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }









// src/pages/ArticlePage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ── Branch config ──────────────────────────────────────────────────────────────
const BRANCH = {
  CS:    { color: "#6C63FF", label: "Computer Science",    emoji: "💻", decorEmojis: ["💻","🖥️","⌨️","🧑‍💻","🔐","🗃️"] },
  EC:    { color: "#00B4D8", label: "Electronics & Comm.", emoji: "⚡", decorEmojis: ["⚡","🔋","📻","📡","💡","🛰️"] },
  ME:    { color: "#F77F00", label: "Mechanical Engg.",    emoji: "⚙️",  decorEmojis: ["⚙️","🔩","🔧","🏭","📐","🚂"] },
  CE:    { color: "#52B788", label: "Civil Engg.",         emoji: "🏗️",  decorEmojis: ["🏗️","🧱","🏛️","🗺️","🌉","⛏️"] },
  EE:    { color: "#E63946", label: "Electrical Engg.",    emoji: "🔌", decorEmojis: ["🔌","⚡","🔋","💡","🧲","🔆"] },
  Other: { color: "#888",    label: "Engineering",         emoji: "📚", decorEmojis: ["📚","🎓","✏️","📝","🔬","🧪"] },
};

// ── Reading progress bar at very top ──────────────────────────────────────────
function ReadingBar({ color }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px]">
      <div
        className="h-full transition-all duration-75 rounded-r-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Subtle floating emojis in header bg ───────────────────────────────────────
function BgEmojis({ emojis }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {emojis.map((em, i) => (
        <span
          key={i}
          className="absolute text-3xl"
          style={{
            opacity: 0.07,
            left:  `${6 + (i * 16) % 85}%`,
            top:   `${12 + (i * 19) % 70}%`,
            transform: `rotate(${-15 + i * 7}deg)`,
          }}
        >
          {em}
        </span>
      ))}
    </div>
  );
}

// ── Rich content renderer ─────────────────────────────────────────────────────
function Content({ text, dark, color }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);

  // paragraph text colour
  const paraColor  = dark ? "#c9d1d9"  : "#374151";
  const headColor  = dark ? "#e6edf3"  : "#111827";
  const cardBg     = dark ? "#1e2433"  : "#f8f9ff";
  const cardBorder = dark ? "#2d3748"  : "#e5e7eb";
  const divColor   = dark ? "#2d3748"  : "#e5e7eb";

  return (
    <div className="space-y-6" style={{ fontSize: 17, lineHeight: 1.9 }}>
      {blocks.map((block, i) => {

        /* ── horizontal rule --- ── */
        if (block.trim() === "---")
          return <hr key={i} style={{ border: "none", borderTop: `1px solid ${divColor}`, margin: "8px 0" }} />;

        /* ── fenced code block ── */
        if (block.startsWith("```") || block.match(/^( {4}|\t)/m)) {
          const code = block.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();
          return (
            <div key={i} className="relative group">
              {/* language label */}
              <span className="absolute top-3 right-4 text-[10px] font-mono text-green-400/60 uppercase tracking-widest">code</span>
              <pre className="rounded-2xl px-6 py-5 overflow-x-auto font-mono text-[14px] leading-relaxed"
                style={{ background: "#0d1117", color: "#79c0ff", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
                {code}
              </pre>
            </div>
          );
        }

        /* ── H1 # ── */
        if (block.startsWith("# ")) {
          return (
            <div key={i} className="pt-4">
              <h1 className="text-2xl font-extrabold mb-1" style={{ color: headColor }}>
                {block.slice(2)}
              </h1>
              <div className="h-[3px] w-12 rounded-full mt-2" style={{ background: color }} />
            </div>
          );
        }

        /* ── H2 ## ── */
        if (block.startsWith("## ")) {
          return (
            <div key={i} className="pt-3 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: color }} />
              <h2 className="text-xl font-bold" style={{ color: headColor }}>{block.slice(3)}</h2>
            </div>
          );
        }

        /* ── H3 ### ── */
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold pt-2"
              style={{ color: color }}>
              {block.slice(4)}
            </h3>
          );
        }

        /* ── blockquote > ── */
        if (block.startsWith("> ")) {
          return (
            <div key={i} className="flex gap-4 rounded-xl px-5 py-4"
              style={{ background: `${color}12`, borderLeft: `4px solid ${color}` }}>
              <p className="text-[15px] italic" style={{ color: paraColor }}>
                {block.slice(2)}
              </p>
            </div>
          );
        }

        /* ── bullet list ── */
        if (block.match(/^[-•*] /m)) {
          return (
            <ul key={i} className="space-y-2.5 pl-1">
              {block.split("\n").filter(Boolean).map((line, j) => (
                <li key={j} className="flex gap-3 items-start">
                  <span
                    className="mt-[11px] w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span style={{ color: paraColor }}>{line.replace(/^[-•*] /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        /* ── numbered list 1. ── */
        if (block.match(/^\d+\. /m)) {
          return (
            <ol key={i} className="space-y-2.5 pl-1">
              {block.split("\n").filter(Boolean).map((line, j) => (
                <li key={j} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white mt-[3px]"
                    style={{ background: color }}
                  >
                    {j + 1}
                  </span>
                  <span style={{ color: paraColor }}>{line.replace(/^\d+\. /, "")}</span>
                </li>
              ))}
            </ol>
          );
        }

        /* ── callout NOTE: / TIP: / IMPORTANT: ── */
        const calloutMatch = block.match(/^(NOTE|TIP|IMPORTANT|WARNING):\s*/i);
        if (calloutMatch) {
          const icons = { NOTE: "📝", TIP: "💡", IMPORTANT: "⚠️", WARNING: "🚨" };
          const type  = calloutMatch[1].toUpperCase();
          const body  = block.slice(calloutMatch[0].length);
          return (
            <div key={i}
              className="rounded-2xl px-5 py-4 flex gap-3 items-start"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <span className="text-xl flex-shrink-0 mt-0.5">{icons[type] || "📌"}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>{type}</p>
                <p className="text-[15px]" style={{ color: paraColor }}>{body}</p>
              </div>
            </div>
          );
        }

        /* ── normal paragraph ── */
        return (
          <p key={i} style={{ color: paraColor }}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article,     setArticle]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [simplified,  setSimplified]  = useState(null);
  const [simplifying, setSimplifying] = useState(false);
  const [showSimple,  setShowSimple]  = useState(false);
  const [liked,       setLiked]       = useState(false);
  const [dark,        setDark]        = useState(() => localStorage.getItem("padhai_theme") === "dark");
  const toggleDark = () => setDark(d => { localStorage.setItem("padhai_theme", !d ? "dark":"light"); return !d; });

  useEffect(() => {
    setLoading(true);
    setSimplified(null);
    setShowSimple(false);
    api.get(`/articles/${id}`)
      .then(r  => setArticle(r.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  const simplify = async () => {
    if (simplified) { setShowSimple(s => !s); return; }
    setSimplifying(true);
    try {
      const r = await api.post("/ai/simplify", { title: article.title, content: article.content });
      setSimplified(r.data.simplified);
      setShowSimple(true);
    } catch { alert("Could not simplify. Try again!"); }
    finally  { setSimplifying(false); }
  };

  // ── states ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
      <p className="text-sm animate-pulse" style={{ color: "#8b949e" }}>Loading article…</p>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-3">😕</div>
        <p className="text-gray-500 mb-4">Article not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-500 underline">← Go back</button>
      </div>
    </div>
  );

  const cfg      = BRANCH[article.branch] || BRANCH.Other;
  const estRead  = Math.max(1, Math.ceil(article.content.split(" ").length / 200));
  const dateStr  = new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const bg        = dark ? "#0d1117"              : "#f5f6fa";
  const navBg     = dark ? "rgba(13,17,23,0.95)"  : "rgba(255,255,255,0.92)";
  const navBorder = dark ? "#21262d"              : "#e5e7eb";
  const cardBg    = dark ? "#161b22"              : "#ffffff";
  const cardBorder= dark ? "#21262d"              : "#e5e7eb";

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ background: bg }}>
      <ReadingBar color={cfg.color} />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 backdrop-blur border-b transition-colors"
        style={{ background: navBg, borderColor: navBorder }}>
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm transition-colors flex items-center gap-1"
            style={{ color: dark ? "#8b949e" : "#9ca3af" }}
          >
            ← Back
          </button>
          <Link to="/" className="font-bold text-base" style={{ color: cfg.color }}>
            PadhAI 🎓
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark}
              className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all hover:scale-110"
              style={{ background: dark ? "#21262d" : "#f3f4f6" }} title="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: cfg.color }}>
              {cfg.emoji} {article.branch}
            </span>
          </div>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden py-12 px-5" style={{ background: dark ? `${cfg.color}20` : `${cfg.color}12` }}>
        <BgEmojis emojis={cfg.decorEmojis} />
        <div className="max-w-3xl mx-auto relative z-10">

          {/* meta chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full border" style={{ background: dark ? "#21262d" : "#fff", color: dark ? "#8b949e" : "#6b7280", borderColor: dark ? "#30363d" : "#e5e7eb" }}>
              {cfg.emoji} {cfg.label}
            </span>
            <span className="text-xs px-3 py-1 rounded-full border" style={{ background: dark ? "#21262d" : "#fff", color: dark ? "#8b949e" : "#6b7280", borderColor: dark ? "#30363d" : "#e5e7eb" }}>
              📚 {article.topic}
            </span>
            <span className="text-xs px-3 py-1 rounded-full border" style={{ background: dark ? "#21262d" : "#fff", color: dark ? "#8b949e" : "#6b7280", borderColor: dark ? "#30363d" : "#e5e7eb" }}>
              ⏱️ {estRead} min read
            </span>
            <span className="text-xs px-3 py-1 rounded-full border" style={{ background: dark ? "#21262d" : "#fff", color: dark ? "#8b949e" : "#6b7280", borderColor: dark ? "#30363d" : "#e5e7eb" }}>
              👁️ {article.views} views
            </span>
          </div>

          {/* title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-5" style={{ color: dark ? "#e6edf3" : "#111827" }}>
            {article.title}
          </h1>

          {/* author row */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: cfg.color }}
            >
              {article.author?.name?.[0] || "P"}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: dark ? "#e6edf3" : "#1f2937" }}>{article.author?.name || "PadhAI Team"}</p>
              <p className="text-xs" style={{ color: dark ? "#8b949e" : "#9ca3af" }}>{dateStr}</p>
            </div>
          </div>

          {/* tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg border" style={{ background: dark ? "#21262d" : "#fff", borderColor: dark ? "#30363d" : "#e5e7eb", color: dark ? "#8b949e" : "#6b7280" }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="sticky top-14 z-40 border-b transition-colors" style={{ background: dark ? "#161b22" : "#fff", borderColor: dark ? "#21262d" : "#f3f4f6" }}>
        <div className="max-w-3xl mx-auto px-5 py-2.5 flex items-center gap-3 flex-wrap">

          {/* Simplify */}
          <button
            onClick={simplify}
            disabled={simplifying}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={showSimple
              ? { background: cfg.color, borderColor: cfg.color, color: "#fff" }
              : { borderColor: cfg.color, color: cfg.color, background: "transparent" }
            }
          >
            {simplifying ? "⏳ Simplifying…" : showSimple ? "📄 Show Original" : "🤖 Simplify for Me"}
          </button>

          {/* Quiz */}
          <Link
            to={`/quizzes?article=${id}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-400 transition-all hover:scale-105"
          >
            🎯 Take Quiz
          </Link>

          {/* Like */}
          <button
            onClick={() => setLiked(l => !l)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all hover:scale-105 ${liked ? "border-pink-300 text-pink-500 bg-pink-50" : "border-gray-200 text-gray-500"}`}
          >
            {liked ? "❤️" : "🤍"} {article.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>

      {/* ── AI SIMPLIFIED ── */}
      {showSimple && simplified && (
        <div className="max-w-3xl mx-auto px-5 mt-6">
          <div className="rounded-2xl p-6 border-2" style={{ borderColor: cfg.color, background: `${cfg.color}08` }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-sm font-bold" style={{ color: dark ? "#e6edf3" : "#1f2937" }}>AI Simplified Version</p>
                <p className="text-xs" style={{ color: dark ? "#8b949e" : "#9ca3af" }}>Explained for beginners</p>
              </div>
            </div>
            <p className="text-[15px] leading-[1.85] whitespace-pre-wrap" style={{ color: dark ? "#c9d1d9" : "#374151" }}>{simplified}</p>
          </div>
        </div>
      )}

      {/* ── ARTICLE BODY ── */}
      <main className="max-w-3xl mx-auto px-5 py-10">
        <div className="rounded-2xl px-8 py-10 border shadow-sm transition-colors" style={{ background: cardBg, borderColor: cardBorder }}>
          <Content text={article.content} dark={dark} color={cfg.color} />
        </div>

        {/* Bottom quiz CTA */}
        <div className="mt-6 rounded-2xl p-6 border shadow-sm text-center transition-colors" style={{ background: cardBg, borderColor: cardBorder }}>
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-semibold mb-1" style={{ color: dark ? "#e6edf3" : "#1f2937" }}>Ready to test yourself?</p>
          <p className="text-sm mb-4" style={{ color: dark ? "#8b949e" : "#9ca3af" }}>Take an AI-generated quiz based on this article.</p>
          <Link
            to={`/quizzes?article=${id}`}
            className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: cfg.color }}
          >
            Generate Quiz 🚀
          </Link>
        </div>
      </main>
    </div>
  );
}
