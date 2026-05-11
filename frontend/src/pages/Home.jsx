import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const branches = [
  { name: 'Computer Science', code: 'CS', icon: '💻', color: 'bg-blue-100' },
  { name: 'Electronics', code: 'EC', icon: '⚡', color: 'bg-yellow-100' },
  { name: 'Mechanical', code: 'ME', icon: '⚙️', color: 'bg-red-100' },
  { name: 'Civil', code: 'CE', icon: '🏗️', color: 'bg-green-100' },
  { name: 'Electrical', code: 'EE', icon: '🔌', color: 'bg-purple-100' },
  { name: 'Other', code: 'Other', icon: '📚', color: 'bg-gray-100' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to PadhAI 🎓
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          Your AI-powered learning platform for engineering students
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/branches"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50"
          >
            Start Learning
          </Link>
          <Link
            to="/signup"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Join Free
          </Link>
        </div>
      </div>

      {/* Branches Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Choose Your Branch
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {branches.map(branch => (
            <Link
              key={branch.code}
              to={`/branches/${branch.code}`}
              className={`${branch.color} p-6 rounded-xl shadow hover:shadow-md transition text-center`}
            >
              <div className="text-5xl mb-3">{branch.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{branch.name}</h3>
              <p className="text-gray-500 mt-1">Explore topics →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Why PadhAI?
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2">Quality Articles</h3>
              <p className="text-gray-500">Well written articles on every engineering topic</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Tutor</h3>
              <p className="text-gray-500">Get instant answers from our AI powered tutor</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Practice Quizzes</h3>
              <p className="text-gray-500">Test your knowledge with topic wise quizzes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>© 2026 PadhAI — Built with ❤️ for engineering students</p>
      </footer>
    </div>
  )
}