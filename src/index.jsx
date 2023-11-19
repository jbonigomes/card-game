import React from 'react'
import ReactDOM from 'react-dom/client'
import Confetti from 'react-confetti'
import ReactCardFlip from 'react-card-flip'

import './index.css'

const Game = () => {
  const chunk = (arr) => {
    const chunkSize = 4
    const chunks = []

    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize))
    }

    return chunks
  }

  const [gameFinished, setGameFinished] = React.useState(false)

  const [cards, setCards] = React.useState({
    1: { hidden: true, pair: 7, image: 'bandit.png' },
    2: { hidden: true, pair: 8, image: 'bingo.png' },
    3: { hidden: true, pair: 9, image: 'bluey.png' },
    4: { hidden: true, pair: 10, image: 'chilli.png' },
    5: { hidden: true, pair: 11, image: 'muffin.png' },
    6: { hidden: true, pair: 12, image: 'socks.png' },
    7: { hidden: true, pair: 1, image: 'bandit.png' },
    8: { hidden: true, pair: 2, image: 'bingo.png' },
    9: { hidden: true, pair: 3, image: 'bluey.png' },
    10: { hidden: true, pair: 4, image: 'chilli.png' },
    11: { hidden: true, pair: 5, image: 'muffin.png' },
    12: { hidden: true, pair: 6, image: 'socks.png' },
  })

  const flip = (id) => () => {
    const numberOfFlippedCards = Object.values(cards).filter(({ hidden }) => !hidden).length

    setCards({ ...cards, [id]: { ...cards[id], hidden: false } })

    if (numberOfFlippedCards % 2 === 1 && cards[cards[id].pair].hidden) {
      setTimeout(() => {
        Object.entries(cards).forEach(([id, { hidden, pair }]) => {
          if (!hidden && cards[pair].hidden) {
            setCards({ ...cards, [id]: { ...cards[id], hidden: true, nod: false } })
          }
        })
      }, 3000)
    }

    if (numberOfFlippedCards === Object.keys(cards).length - 1) {
      setGameFinished(true)
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
        <Confetti width={window.innerWidth} height={window.innerHeight} run={gameFinished} />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
)
