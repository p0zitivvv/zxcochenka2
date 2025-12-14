import { useState, useEffect } from 'react'
import { people } from '../data/people'
import { getRanking, getVotes } from '../utils/storage'
import './RankingPage.css'

function RankingPage() {
  const [ranking, setRanking] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    updateRanking()
  }, [])

  const updateRanking = () => {
    const ranked = getRanking()
    const peopleMap = new Map(people.map(p => [p.id, p]))
    
    const rankedWithInfo = ranked.map((item, index) => ({
      ...item,
      ...peopleMap.get(item.id),
      position: index + 1
    }))

    // Добавляем участников без голосов
    const votedIds = new Set(ranked.map(r => r.id))
    const notVoted = people
      .filter(p => !votedIds.has(p.id))
      .map((p, index) => ({
        ...p,
        votes: 0,
        position: ranked.length + index + 1
      }))

    setRanking([...rankedWithInfo, ...notVoted])
    
    const total = ranked.reduce((sum, item) => sum + item.votes, 0)
    setTotalVotes(total)
  }

  const getMedal = (position) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return null
  }

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1 className="page-title">Рейтинг участников</h1>
        <div className="stats">
          <span className="stat-item">Всего голосов: {totalVotes}</span>
          <span className="stat-item">Участников: {ranking.length}</span>
        </div>
      </div>

      <div className="ranking-list">
        {ranking.length === 0 ? (
          <div className="empty-state">
            <p>Пока нет голосов</p>
            <p className="small-text">Будьте первым, кто проголосует!</p>
          </div>
        ) : (
          ranking.map((person) => (
            <div 
              key={person.id} 
              className={`ranking-item ${person.position <= 3 ? 'top-three' : ''}`}
            >
              <div className="rank-number">
                {getMedal(person.position) || `#${person.position}`}
              </div>
              
              <div className="person-photo-small">
                <img 
                  src={person.photo} 
                  alt={person.name}
                  loading="lazy"
                />
              </div>

              <div className="person-info">
                <div className="person-name">{person.name}</div>
                <div className="person-votes-count">
                  {person.votes} {person.votes === 1 ? 'голос' : person.votes < 5 ? 'голоса' : 'голосов'}
                </div>
              </div>

              <div className="votes-bar-container">
                <div 
                  className="votes-bar"
                  style={{ 
                    width: `${totalVotes > 0 ? (person.votes / totalVotes * 100) : 0}%` 
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RankingPage

