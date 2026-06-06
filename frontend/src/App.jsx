import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BranchPage from './pages/BranchPage'
import ArticlePage from './pages/ArticlePage'
import QuizListPage from './pages/QuizListPage'
import QuizPage from './pages/QuizPage'
import AiTutorWidget from './components/AiTutorWidget'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AiTutorWidget />
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
          <Route path="/branches/:code" element={<BranchPage />} />
          <Route path="/articles/:id"   element={<ArticlePage />} />
          <Route path="/quizzes"        element={<QuizListPage />} />
          <Route path="/quizzes/:id"    element={<QuizPage />} />
          <Route path="/admin"          element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}


