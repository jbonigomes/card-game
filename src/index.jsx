import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactCardFlip from 'react-card-flip'
import ConfettiExplosion from 'react-confetti-explosion'

import { chunk, noop, shuffle } from 'lodash'

import './index.css'

const Game = () => {
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

  const order = React.useMemo(() => chunk(shuffle(Object.keys(cards)), 4), [])

  const flip = (id) => () => {
    setCards({ ...cards, [id]: { ...cards[id], hidden: false } })

    if (lastDrawn && cards[id].pair !== lastDrawn) {
      setIsLoading(true)
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

    if (cards[id].pair === lastDrawn) {
      setLastDrawn(0)
    }

    if (!lastDrawn) {
      setLastDrawn(+id)
    }

    if (Object.values(cards).filter(({ hidden }) => hidden).length === 1) {
      setGameOver(true)
    }
  }

  return (
    <>
      {order.map((row, i) => (
        <div key={i} className="row">
          {row.map((id) => (
            <button
              key={id}
              onClick={cards[id].hidden && !isLoading ? flip(id) : noop}
            >
              <ReactCardFlip
                infinite
                flipSpeedBackToFront={0.4}
                flipSpeedFrontToBack={0.4}
                isFlipped={!cards[id].hidden}
              >
                <div className="card pattern" />
                <div className="card">
                  <img src={cards[id].image} />
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
