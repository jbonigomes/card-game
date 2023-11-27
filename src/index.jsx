import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactCardFlip from 'react-card-flip'
import ReactConfetti from 'react-confetti-explosion'

import bandit from './images/bandit.png'
import bingo from './images/bingo.png'
import bluey from './images/bluey.png'
import chilli from './images/chilli.png'
import muffin from './images/muffin.png'
import socks from './images/socks.png'

import { noop, shuffle } from 'lodash'
import { StatusBar } from '@capacitor/status-bar'

import './index.css'

// Consider iOS build issue:
// https://stackoverflow.com/questions/76792138

const Game = () => {
  const [order, setOrder] = React.useState([])
  const [reset, setReset] = React.useState(false)
  const [lastDrawn, setLastDrawn] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [viewReady, setViewReady] = React.useState(false)
  const [cards, setCards] = React.useState({
    1: { hidden: true, pair: 7, image: bandit },
    2: { hidden: true, pair: 8, image: bingo },
    3: { hidden: true, pair: 9, image: bluey },
    4: { hidden: true, pair: 10, image: chilli },
    5: { hidden: true, pair: 11, image: muffin },
    6: { hidden: true, pair: 12, image: socks },
    7: { hidden: true, pair: 1, image: bandit },
    8: { hidden: true, pair: 2, image: bingo },
    9: { hidden: true, pair: 3, image: bluey },
    10: { hidden: true, pair: 4, image: chilli },
    11: { hidden: true, pair: 5, image: muffin },
    12: { hidden: true, pair: 6, image: socks },
  })

  const flip = (id) => () => {
    setLastDrawn(cards[id].pair === lastDrawn ? 0 : +id)
    setCards({ ...cards, [id]: { ...cards[id], hidden: false } })

    // It's a miss
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

    // Game over
    if (Object.values(cards).filter(({ hidden }) => hidden).length === 1) {
      setTimeout(() => setGameOver(true), 10)

      setTimeout(() => {
        setLastDrawn(0)
        setReset(!reset)
        setGameOver(false)
        setIsLoading(false)
        setCards(
          Object.entries(cards).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: { ...val, hidden: true },
          }), {})
        )
      }, 3000)
    }
  }

  React.useEffect(() => {
    StatusBar
      .hide()
      .then(() => setViewReady(true))
      .catch(() => setViewReady(true))
  }, [])

  React.useEffect(() => {
    setIsLoading(true)
    setOrder(shuffle(Object.keys(cards)))

    setTimeout(() => {
      setCards(
        Object.entries(cards).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: { ...val, hidden: false },
        }), {})
      )
    }, 1000)

    setTimeout(() => {
      setIsLoading(false)
      setCards(
        Object.entries(cards).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: { ...val, hidden: true },
        }), {})
      )
    }, 4000)
  }, [reset])

  return !viewReady ? <div /> : (
    <div className="board">
      {order.map((id) => (
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
            <div className="card card-back">
              <div className="pattern" />
            </div>
            <div className="card">
              <img src={cards[id].image} />
            </div>
          </ReactCardFlip>
        </button>
      ))}

      {gameOver && (
        <div className="confetti">
          <ReactConfetti particleCount={400} force={0.8} />
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
)
