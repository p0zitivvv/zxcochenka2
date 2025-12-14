import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import VotingPage from './pages/VotingPage'
import RankingPage from './pages/RankingPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            <span className="logo-icon">🔥</span>
            <span className="logo-text">FaceOff</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Голосовать</Link>
            <Link to="/ranking" className="nav-link">Рейтинг</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

