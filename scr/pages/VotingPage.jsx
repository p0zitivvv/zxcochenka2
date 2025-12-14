import { useState, useEffect } from 'react'
import { getRandomPair } from '../data/people'
import { addVote, hasVotedToday, markAsVoted, getVotes } from '../utils/storage'
import './VotingPage.css'

function VotingPage() {
  const [pair, setPair] = useState([])
  const [selected, setSelected] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)
  const [votedToday, setVotedToday] = useState(false)

  useEffect(() => {
    loadNewPair()
    checkVotedStatus()
    updateTotalVotes()
  }, [])

  const checkVotedStatus = () => {
    setVotedToday(hasVotedToday())
  }

  const updateTotalVotes = () => {
    const data = localStorage.getItem('faceoff_data')
    if (data) {
      const votes = JSON.parse(data)
      const total = Object.values(votes).reduce((sum, count) => sum + count, 0)
      setTotalVotes(total)
    }
  }

  const loadNewPair = () => {
    const newPair = getRandomPair()
    setPair(newPair)
    setSelected(null)
  }

  const handleVote = (personId) => {
    if (votedToday || selected) return

    setSelected(personId)
    setIsAnimating(true)
    
    // Добавляем голос
    addVote(personId)
    markAsVoted()
    setVotedToday(true)
    updateTotalVotes()

    // Анимация и загрузка новой пары
    setTimeout(() => {
      setIsAnimating(false)
      loadNewPair()
    }, 800)
  }

  if (pair.length < 2) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="voting-page">
      <div className="voting-header">
        <h1 className="page-title">Кто круче?</h1>
        <div className="stats">
          <span className="stat-item">Всего голосов: {totalVotes}</span>
          {votedToday && <span className="voted-badge">✓ Вы уже проголосовали сегодня</span>}
        </div>
      </div>

      <div className="voting-container">
        <div className={`photo-card ${selected === pair[0].id ? 'selected' : ''} ${isAnimating ? 'animating' : ''}`}>
          <div className="photo-wrapper">
            <img 
              src={pair[0].photo} 
              alt={pair[0].name}
              className="photo"
              loading="lazy"
            />
            <div className="photo-overlay">
              <span className="person-name">{pair[0].name}</span>
              <span className="person-votes">{getVotes(pair[0].id)} голосов</span>
            </div>
          </div>
          <button
            className={`vote-button ${selected === pair[0].id ? 'active' : ''}`}
            onClick={() => handleVote(pair[0].id)}
            disabled={votedToday || selected !== null}
          >
            {selected === pair[0].id ? '✓ Выбрано' : 'Голос за левое фото'}
          </button>
        </div>

        <div className="vs-divider">
          <span>VS</span>
        </div>

        <div className={`photo-card ${selected === pair[1].id ? 'selected' : ''} ${isAnimating ? 'animating' : ''}`}>
          <div className="photo-wrapper">
            <img 
              src={pair[1].photo} 
              alt={pair[1].name}
              className="photo"
              loading="lazy"
            />
            <div className="photo-overlay">
              <span className="person-name">{pair[1].name}</span>
              <span className="person-votes">{getVotes(pair[1].id)} голосов</span>
            </div>
          </div>
          <button
            className={`vote-button ${selected === pair[1].id ? 'active' : ''}`}
            onClick={() => handleVote(pair[1].id)}
            disabled={votedToday || selected !== null}
          >
            {selected === pair[1].id ? '✓ Выбрано' : 'Голос за правое фото'}
          </button>
        </div>
      </div>

      {votedToday && (
        <div className="voted-message">
          <p>Спасибо за ваш голос! 🎉</p>
          <p className="small-text">Вы сможете проголосовать снова завтра</p>
        </div>
      )}
    </div>
  )
}

export default VotingPage

