import { useMemo, useState } from 'react'
import { startRound, playerHit, playerStand } from '../game/engine.js'
import { handValue } from '../game/hand.js'
import { formatCard } from '../game/deck.js'
import { basicStrategy, formatSuggestion } from '../game/strategy.js'
import StrategyHelp from './StrategyHelp.jsx'
import { useEffect } from 'react'

function Card({ c, hidden = false, delayMs = 0 }) {
  const isRed = c?.suit === '♥' || c?.suit === '♦'
  const rank = c?.rank
  const suit = c?.suit
  if (hidden) {
    return (
      <div
        className='card card-back'
        style={{
          width: 88,
          height: 120,
          borderRadius: 10,
          animation: 'fadeUp 320ms ease-out both',
          animationDelay: `${delayMs}ms`
        }}
        title='Hidden'
      />
    )
  }
  return (
    <div
      className={`card playing-card ${isRed ? 'red' : 'black'}`}
      style={{
        width: 88,
        height: 120,
        borderRadius: 10,
        animation: 'fadeUp 320ms ease-out both',
        animationDelay: `${delayMs}ms`
      }}
      title={`${rank}${suit}`}
    >
      <div className='corner top-left'>
        <div className='rank'>{rank}</div>
        <div className='suit'>{suit}</div>
      </div>
      <div className='corner bottom-right'>
        <div className='rank'>{rank}</div>
        <div className='suit'>{suit}</div>
      </div>
      {isFace(rank) ? (
        <>
          <div className='watermark'>{suit}</div>
          <div className='face-art'>{rank}</div>
        </>
      ) : rank === 'A' ? (
        <div className='pip ace'>{suit}</div>
      ) : (
        <div className='pips'>
          {getPipCoords(rank).map(([x, y], i) => (
            <div key={i} className='pip' style={{ left: `${x}%`, top: `${y}%` }}>{suit}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function isFace(r) { return r === 'J' || r === 'Q' || r === 'K' }

function getPipCoords(rank) {
  const center = [50, 50]
  const top = 25, upper = 35, middle = 50, lower = 65, bottom = 75
  const left = 30, right = 70, centerX = 50
  switch (rank) {
    case '2': return [[centerX, top], [centerX, bottom]]
    case '3': return [[centerX, top], center, [centerX, bottom]]
    case '4': return [[left, top], [right, top], [left, bottom], [right, bottom]]
    case '5': return [[left, top], [right, top], center, [left, bottom], [right, bottom]]
    case '6': return [[left, top], [right, top], [left, middle], [right, middle], [left, bottom], [right, bottom]]
    case '7': return [[left, top], [right, top], [left, middle], [right, middle], [left, bottom], [right, bottom], [centerX, upper]]
    case '8': return [[left, top], [right, top], [left, middle], [right, middle], [left, bottom], [right, bottom], [centerX, upper], [centerX, lower]]
    case '9': return [[left, top], [right, top], [left, middle], [right, middle], [left, bottom], [right, bottom], [centerX, upper], [centerX, middle], [centerX, lower]]
    case '10': return [[left, top], [centerX, top], [right, top], [left, middle], [right, middle], [left, bottom], [centerX, bottom], [right, bottom], [centerX, upper], [centerX, lower]]
    default: return []
  }
}

export default function GameTable({ onStrategyContext }) {
  const rng = useMemo(() => undefined, [])
  const [state, setState] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [history, setHistory] = useState([])

  const phase = state?.phase ?? 'idle'
  const player = state?.player ?? []
  const dealer = state?.dealer ?? []

  function onStart() {
    const s = startRound(rng)
    setState(s)
    if (s.phase === 'ended' && s.outcome) {
      recordOutcome(s.outcome)
    }
  }
  function onHit() {
    setState(s => {
      const next = { ...playerHit({ ...s, player: [...s.player], dealer: [...s.dealer], deck: [...s.deck] }) }
      if (next.phase === 'ended' && next.outcome) {
        recordOutcome(next.outcome)
      }
      return next
    })
  }
  function onStand() {
    setState(s => {
      const next = { ...playerStand({ ...s, player: [...s.player], dealer: [...s.dealer], deck: [...s.deck] }) }
      if (next.phase === 'ended' && next.outcome) {
        recordOutcome(next.outcome)
      }
      return next
    })
  }
  function onReset() {
    setState(null)
  }

  function recordOutcome(code) {
    const entry = { code, label: outcomeLabel(code), type: outcomeType(code) }
    setHistory(h => [entry, ...h].slice(0, 10))
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === '?') setShowHelp(true)
      if (e.key === '/') {
        // Some keyboards require Shift+/ for '?'; support '/' as well
        setShowHelp(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const dealerFaceDown = phase === 'player'
  const dealerShown = dealerFaceDown && dealer.length > 0 ? [dealer[0], null] : dealer
  const dealerUp = dealer.length > 0 ? dealer[0] : null

  const status = (() => {
    if (phase === 'idle') return 'Click Deal to begin'
    if (phase === 'player') return 'Your turn: Hit or Stand'
    if (phase === 'dealer') return 'Dealer playing…'
    if (phase === 'ended') return outcomeLabel(state?.outcome)
    return ''
  })()

  const suggestion = phase === 'player' && player.length > 0 && dealerUp
    ? basicStrategy(player, dealerUp)
    : null
  const suggestedAction = suggestion?.primary === 'double' ? (suggestion?.fallback || 'hit') : suggestion?.primary

  // Provide lightweight context to StrategyDock for highlighting
  useEffect(() => {
    if (!onStrategyContext) return
    if (phase !== 'player' || player.length === 0 || !dealerUp) {
      onStrategyContext(null)
      return
    }
    const info = computeHandInfo(player)
    const up = upRankValue(dealerUp)
    onStrategyContext({
      total: info.total,
      soft: info.soft,
      up,
      suggestion: suggestion?.primary || null,
      fallback: suggestion?.fallback || null
    })
  }, [phase, player, dealerUp, suggestion, onStrategyContext])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Dealer row at top */}
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ opacity: 0.9, marginBottom: 8 }}>Dealer {dealer.length ? `(${dealerFaceDown ? '?' : handValue(dealer)})` : ''}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {dealerShown.map((c, i) => <Card key={i} c={c} hidden={c == null} delayMs={i * 90} />)}
        </div>
      </div>

      {/* Player row at bottom */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ opacity: 0.9, marginBottom: 8 }}>Player {player.length ? `(${handValue(player)})` : ''}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {player.map((c, i) => <Card key={i} c={c} delayMs={i * 90 + 120} />)}
        </div>
      </div>

      {/* Center controls and status */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ opacity: 0.9, marginBottom: 10 }}>{status}</div>
        {/* strategy hint line removed per request */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {phase === 'idle' && (
            <Btn onClick={onStart}>Deal</Btn>
          )}
          {phase === 'player' && (
            <>
              <Btn onClick={onHit} variant='hit' highlight={suggestedAction === 'hit'}>Hit</Btn>
              <Btn onClick={onStand} variant='stand' highlight={suggestedAction === 'stand'}>Stand</Btn>
            </>
          )}
          {phase === 'ended' && (
            <>
              <Btn onClick={onStart}>Deal Again</Btn>
              <Btn variant='ghost' onClick={onReset}>Reset</Btn>
            </>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>Press ? for strategy help</div>
      </div>

      <StrategyHelp open={showHelp} onClose={() => setShowHelp(false)} />

      {/* Outcomes panel (top-right) */}
      <div className='panel panel--outcomes' style={{
        position: 'fixed', top: 12, right: 12, zIndex: 40,
        background: 'rgba(15,26,58,0.9)', color: '#fff', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.15)', padding: 12,
        minWidth: 260, backdropFilter: 'blur(4px)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Last 10 Outcomes</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ opacity: 0.8 }}>
              <th style={{ textAlign: 'left', paddingBottom: 6 }}>#</th>
              <th style={{ textAlign: 'left', paddingBottom: 6 }}>Outcome</th>
              <th style={{ textAlign: 'center', paddingBottom: 6 }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} style={{ animation: 'fadeUp 180ms ease-out both', animationDelay: `${i * 30}ms` }}>
                <td style={{ padding: '4px 0', opacity: 0.8 }}>{i + 1}</td>
                <td style={{ padding: '4px 0' }}>{h.label}</td>
                <td style={{ padding: '4px 0', textAlign: 'center' }}>
                  <span className={`chip chip--${outcomeVariant(h.code)}`}>{h.type}</span>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan='3' style={{ padding: '6px 0', opacity: 0.8 }}>No outcomes yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ title, children }) {
  return (
    <div>
      <div style={{ opacity: 0.9, marginBottom: 10, fontSize: 14 }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', minHeight: 130 }}>{children}</div>
    </div>
  )
}

function Btn({ onClick, children, variant, highlight }) {
  let styles
  if (variant === 'ghost') {
    styles = {
      background: 'transparent', color: '#e0fbfc', border: '1px solid rgba(255,255,255,0.35)'
    }
  } else if (variant === 'hit') {
    styles = { background: '#2ecc71', color: '#0b132b', border: 0 }
  } else if (variant === 'stand') {
    styles = { background: '#f1c40f', color: '#0b132b', border: 0 }
  } else {
    styles = { background: '#5bc0be', color: '#0b132b', border: 0 }
  }
  if (highlight) {
    styles = {
      ...styles,
      boxShadow: '0 0 0 3px rgba(255,255,255,0.15), 0 10px 24px rgba(0,0,0,0.35)',
      transform: 'translateY(-1px)'
    }
  }
  return (
    <button className='btn' onClick={onClick} style={{
      padding: '14px 22px',
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 16,
      cursor: 'pointer',
      transition: 'transform 120ms ease, box-shadow 200ms ease, background 200ms ease, color 200ms ease',
      willChange: 'transform',
      ...styles
    }}>
      {children}
    </button>
  )
}

function outcomeLabel(code) {
  switch (code) {
    case 'player_blackjack': return 'Blackjack! You win'
    case 'dealer_blackjack': return 'Dealer Blackjack — you lose'
    case 'player_bust': return 'Bust — you lose'
    case 'dealer_bust': return 'Dealer busts — you win'
    case 'player_win': return 'You win'
    case 'dealer_win': return 'Dealer wins'
    case 'push': return 'Push'
    default: return ''
  }
}

function outcomeVariant(code) {
  switch (code) {
    case 'player_blackjack':
      return 'bj'
    case 'dealer_bust':
    case 'player_win':
      return 'win'
    case 'dealer_blackjack':
    case 'player_bust':
    case 'dealer_win':
      return 'lose'
    case 'push':
    default:
      return 'push'
  }
}

function outcomeType(code) {
  switch (code) {
    case 'player_blackjack':
    case 'dealer_bust':
    case 'player_win':
      return 'Win'
    case 'dealer_blackjack':
    case 'player_bust':
    case 'dealer_win':
      return 'Lose'
    case 'push':
    default:
      return 'Push'
  }
}

function computeHandInfo(cards) {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank === 'A') { aces += 1; total += 11 }
    else if (['K', 'Q', 'J'].includes(c.rank)) total += 10
    else total += Number(c.rank)
  }
  let softAces = aces
  while (total > 21 && softAces > 0) { total -= 10; softAces -= 1 }
  return { total, soft: softAces > 0 }
}

function upRankValue(up) {
  if (!up) return 0
  if (up.rank === 'A') return 11
  if (['K', 'Q', 'J'].includes(up.rank)) return 10
  return Number(up.rank)
}
