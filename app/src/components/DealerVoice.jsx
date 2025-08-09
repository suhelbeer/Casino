import { useEffect, useRef } from 'react'

function formatCardSpeech(c) {
  if (!c) return ''
  // speak suits as words
  const suit = c.suit === '♥' ? 'hearts' : c.suit === '♦' ? 'diamonds' : c.suit === '♠' ? 'spades' : 'clubs'
  const rank = ({ A: 'ace', J: 'jack', Q: 'queen', K: 'king' }[c.rank]) || c.rank
  return `${rank} of ${suit}`
}

function speak(text, opts = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = opts.rate ?? 1
  u.pitch = opts.pitch ?? 1
  u.volume = opts.volume ?? 1
  window.speechSynthesis.speak(u)
}

export default function DealerVoice({ enabled, event }) {
  const lastIdRef = useRef(null)

  useEffect(() => {
    if (!enabled || !event) return
    if (lastIdRef.current === event.id) return
    lastIdRef.current = event.id

    // Cancel any queued utterances to keep things snappy
    try { window.speechSynthesis?.cancel() } catch {}

    const e = event
    switch (e.type) {
      case 'deal': {
        const player = e.player || []
        const dealerUp = e.dealerUp
        const pTotal = e.playerTotal
        const intro = [
          'Cards coming your way.',
          'Let’s play.',
          'Good luck — dealing now.'
        ]
        const lead = intro[Math.floor(Math.random() * intro.length)]
        const line = `${lead} You have ${player.map(formatCardSpeech).join(' and ')}, for ${pTotal}. Dealer shows ${formatCardSpeech(dealerUp)}.`
        speak(line)
        break
      }
      case 'hit': {
        const card = e.card
        const total = e.playerTotal
        const line = `Hit. Drew ${formatCardSpeech(card)}. Total is ${total}.`
        speak(line)
        break
      }
      case 'stand': {
        speak('Standing. Dealer will play.')
        break
      }
      case 'end': {
        const dv = e.dealerTotal
        const pv = e.playerTotal
        const outcome = e.outcomeLabel
        const comments = {
          player_blackjack: 'Blackjack! Nice one.',
          dealer_blackjack: 'Dealer has blackjack.',
          player_bust: 'That’s a bust.',
          dealer_bust: 'Dealer busts.',
          player_win: 'You win.',
          dealer_win: 'Dealer wins.',
          push: 'Push.'
        }
        const wrap = `Player ${pv}. Dealer ${dv}. ${comments[e.outcome] || outcome}.`
        speak(wrap)
        break
      }
      default:
        break
    }
  }, [enabled, event])

  return null
}

