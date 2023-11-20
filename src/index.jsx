import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactCardFlip from 'react-card-flip'
import ConfettiExplosion from 'react-confetti-explosion'

import './index.css'

const Game = () => {
  const chunk = (arr, size = 4, chunks = []) => {
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
    return chunks
  }

  const [lastDrawn, setLastDrawn] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const [cards, setCards] = React.useState({
    1: { hidden: true, pair: 7, image: '/card-game/bandit.png' },
    2: { hidden: true, pair: 8, image: '/card-game/bingo.png' },
    3: { hidden: true, pair: 9, image: '/card-game/bluey.png' },
    4: { hidden: true, pair: 10, image: '/card-game/chilli.png' },
    5: { hidden: true, pair: 11, image: '/card-game/muffin.png' },
    6: { hidden: true, pair: 12, image: '/card-game/socks.png' },
    7: { hidden: true, pair: 1, image: '/card-game/bandit.png' },
    8: { hidden: true, pair: 2, image: '/card-game/bingo.png' },
    9: { hidden: true, pair: 3, image: '/card-game/bluey.png' },
    10: { hidden: true, pair: 4, image: '/card-game/chilli.png' },
    11: { hidden: true, pair: 5, image: '/card-game/muffin.png' },
    12: { hidden: true, pair: 6, image: '/card-game/socks.png' },
  })

  const flip = (id) => () => {
    if (cards[id].hidden && !isLoading) {
      if (lastDrawn) {
        if (cards[id].pair === lastDrawn) {
          setCards({ ...cards, [id]: { ...cards[id], hidden: false } })
          setLastDrawn(0)
        } else {
          setIsLoading(true)
          setCards({
            ...cards,
            [id]: { ...cards[id], hidden: false },
          })

          setTimeout(() => {
            setLastDrawn(0)
            setIsLoading(false)
            setCards({
              ...cards,
              [id]: { ...cards[id], hidden: true },
              [lastDrawn]: { ...cards[lastDrawn], hidden: true },
            })
          }, 900)
        }
      } else {
        setLastDrawn(+id)
        setCards({ ...cards, [id]: { ...cards[id], hidden: false } })
      }

      if (Object.values(cards).filter(({ hidden }) => hidden).length === 1) {
        setTimeout(() => setGameOver(true), 50)
      }
    }
  }

  return (
    <>
      {chunk(Object.entries(cards)).map((row, i) => (
        <div key={i} className="row">
          {row.map(([id, { hidden, image, nod }]) => (
            <button onClick={flip(id)} key={id}>
              <ReactCardFlip
                infinite
                isFlipped={!hidden}
                flipSpeedBackToFront={0.4}
                flipSpeedFrontToBack={0.4}
              >
                <div className="card card-back" />
                <div className={`card card-front ${nod ? 'shake' : ''}`}>
                  <img src={image} />
                </div>
              </ReactCardFlip>
            </button>
          ))}
        </div>
      ))}

      {gameOver && (
        <div className="confetti">
          <ConfettiExplosion particleCount={400} force={0.8} />
        </div>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
)
