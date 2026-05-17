import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">PadhAI 🎓</Link>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 focus:outline-none"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/branches" className="text-gray-600 hover:text-blue-600">Branches</Link>
          <Link to="/quizzes" className="text-gray-600 hover:text-blue-600">Quizzes</Link>
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}!</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Signup</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 pb-2 border-t border-gray-100 pt-3">
          <Link to="/branches" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-blue-600 py-1">Branches</Link>
          <Link to="/quizzes" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-blue-600 py-1">Quizzes</Link>
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}!</span>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-center">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-blue-600 hover:underline py-1">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
