import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const branches = [
  { code: 'CS', name: 'Computer Science', emoji: '💻', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { code: 'EC', name: 'Electronics', emoji: '⚡', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
  { code: 'ME', name: 'Mechanical', emoji: '⚙️', color: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
  { code: 'CE', name: 'Civil', emoji: '🏗️', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
  { code: 'EE', name: 'Electrical', emoji: '🔌', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  { code: 'Other', name: 'Other', emoji: '📚', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-700' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Welcome to PadhAI 🎓</h1>
        <p className="text-blue-100 text-sm md:text-lg mb-6 max-w-xl mx-auto">
          Your AI-powered learning platform for engineering students
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/branches"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
            Start Learning
          </Link>
          <Link to="/signup"
            className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Join Free
          </Link>
        </div>
      </div>

      {/* Branches */}
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">Choose Your Branch</h2>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Explore articles and quizzes tailored for your engineering branch
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {branches.map(branch => (
            <Link
              key={branch.code}
              to={`/branches/${branch.code}`}
              className={`${branch.color} border-2 rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl md:text-4xl mb-2">{branch.emoji}</div>
              <h3 className={`font-bold text-sm md:text-base ${branch.textColor}`}>{branch.name}</h3>
              <p className="text-gray-500 text-xs mt-1">Explore topics</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why PadhAI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '🎓', title: 'AI Tutor', desc: 'Ask any engineering question and get instant clear answers' },
              { emoji: '✨', title: 'Simplify Articles', desc: 'One click makes any complex topic beginner-friendly' },
              { emoji: '🧠', title: 'Auto Quizzes', desc: 'AI generates MCQs from any article to test your knowledge' },
            ].map(f => (
              <div key={f.title} className="text-center p-4">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}





