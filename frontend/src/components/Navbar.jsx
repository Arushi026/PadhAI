import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        PadhAI 🎓
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/branches" className="text-gray-600 hover:text-blue-600">
          Branches
        </Link>
        <Link to="/quizzes" className="text-gray-600 hover:text-blue-600">
          Quizzes
        </Link>

        {user ? (
          <>
            <span className="text-gray-600">Hi, {user.name}!</span>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}