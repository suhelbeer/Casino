import { useMemo, useState } from 'react'
import { startRound, playerHit, playerStand } from '../game/engine.js'
import { handValue } from '../game/hand.js'
import { formatCard } from '../game/deck.js'
import { basicStrategy, formatSuggestion } from '../game/strategy.js'
import StrategyHelp from './StrategyHelp.jsx'
import { useEffect } from 'react'
import DealerVoice from './DealerVoice.jsx'
import DealerChat from './DealerChat.jsx'
import useAmbientMusic from '../hooks/useAmbientMusic.js'

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
        <div className='face-wrap'>
          <div className='face top'>{faceSVG(rank, suit, isRed)}</div>
          <div className='face bottom'>{faceSVG(rank, suit, isRed)}</div>
        </div>
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

function faceSVG(rank, suit, isRed) {
  const stroke = isRed ? '#b71c1c' : '#0b132b'
  const gold = '#f1c40f'
  const steel = '#b0bec5'
  const robe = isRed ? '#ef9a9a' : '#90caf9'
  const trim = isRed ? '#ffebee' : '#e3f2fd'
  const gem = isRed ? '#ef5350' : '#64b5f6'
  const motif = isRed ? '#b71c1c' : '#0b132b'
  const size = 56

  function SuitEmblem({ cx = 32, cy = 40, scale = 1 }) {
    const s = 1 * scale
    if (suit === '♥') {
      return (
        <g transform={`translate(${cx},${cy}) scale(${s})`}>
          <path d='M0,8 C -6,2 -10,-1 -10,-6 C -10,-9 -8,-11 -5,-11 C -3,-11 -1,-10 0,-8 C 1,-10 3,-11 5,-11 C 8,-11 10,-9 10,-6 C 10,-1 6,2 0,8 Z' fill={gem} stroke={stroke} strokeWidth='1' />
        </g>
      )
    }
    if (suit === '♠') {
      return (
        <g transform={`translate(${cx},${cy}) scale(${s})`}>
          <path d='M0,-8 C 5,-13 12,-8 12,-3 C 12,1 8,4 0,10 C -8,4 -12,1 -12,-3 C -12,-8 -5,-13 0,-8 Z' fill={gem} stroke={stroke} strokeWidth='1' />
          <rect x='-2' y='10' width='4' height='6' fill={gold} stroke={stroke} strokeWidth='0.8' />
        </g>
      )
    }
    if (suit === '♦') {
      return (
        <g transform={`translate(${cx},${cy}) scale(${s})`}>
          <polygon points='0,-10 8,0 0,10 -8,0' fill={gem} stroke={stroke} strokeWidth='1' />
        </g>
      )
    }
    // Clubs
    return (
      <g transform={`translate(${cx},${cy}) scale(${s})`}>
        <circle cx='-5' cy='-6' r='5' fill={gem} stroke={stroke} strokeWidth='1' />
        <circle cx='5' cy='-6' r='5' fill={gem} stroke={stroke} strokeWidth='1' />
        <circle cx='0' cy='0' r='6' fill={gem} stroke={stroke} strokeWidth='1' />
        <rect x='-2' y='6' width='4' height='6' fill={gold} stroke={stroke} strokeWidth='0.8' />
      </g>
    )
  }

  if (rank === 'K') {
    return (
      <svg width={size} height={size} viewBox='0 0 64 64' fill='none' aria-label='King'>
        {/* Crown */}
        <path d='M16 18 L24 10 L32 18 L40 10 L48 18 L48 24 L16 24 Z' fill={gold} stroke={stroke} strokeWidth='1.5' />
        <circle cx='24' cy='12' r='2' fill={gem} stroke={stroke} strokeWidth='0.8' />
        <circle cx='40' cy='12' r='2' fill={gem} stroke={stroke} strokeWidth='0.8' />
        <circle cx='32' cy='18' r='2' fill={gem} stroke={stroke} strokeWidth='0.8' />
        {/* Face */}
        <rect x='24' y='24' width='16' height='10' rx='3' fill='#ffe0b2' stroke={stroke} strokeWidth='1' />
        {/* Beard */}
        <path d='M24 34 C28 38 36 38 40 34 L40 36 C36 40 28 40 24 36 Z' fill={steel} stroke={stroke} strokeWidth='1' />
        {/* Robe */}
        <path d='M18 36 H46 V48 C46 52 42 54 32 54 C22 54 18 52 18 48 Z' fill={robe} stroke={stroke} strokeWidth='1.5' />
        <path d='M18 42 H46' stroke={trim} strokeWidth='2' />
        {/* Suit motifs on robe */}
        <g opacity='0.28' fill={motif} fontSize='6'>
          <text x='22' y='46'>{suit}</text>
          <text x='28' y='46'>{suit}</text>
          <text x='34' y='46'>{suit}</text>
          <text x='40' y='46'>{suit}</text>
        </g>
        {/* Emblem */}
        <SuitEmblem cx={32} cy={40} scale={0.8} />
        {/* Sword */}
        <rect x='31' y='20' width='2' height='24' fill={steel} />
        <rect x='28' y='28' width='8' height='2' fill={gold} />
      </svg>
    )
  }

  if (rank === 'Q') {
    return (
      <svg width={size} height={size} viewBox='0 0 64 64' fill='none' aria-label='Queen'>
        {/* Tiara */}
        <path d='M18 20 C22 14 42 14 46 20 L46 24 H18 Z' fill={gold} stroke={stroke} strokeWidth='1.5' />
        <circle cx='32' cy='18' r='2.2' fill={gem} stroke={stroke} strokeWidth='0.8' />
        {/* Face */}
        <rect x='24' y='24' width='16' height='10' rx='3' fill='#ffecb3' stroke={stroke} strokeWidth='1' />
        {/* Hair */}
        <path d='M22 24 C22 20 26 18 32 18 C38 18 42 20 42 24' fill='none' stroke={stroke} strokeWidth='1.2' />
        {/* Dress */}
        <path d='M18 36 H46 L42 50 H22 Z' fill={robe} stroke={stroke} strokeWidth='1.4' />
        <path d='M22 42 H42' stroke={trim} strokeWidth='2' />
        {/* Flower/Scepter */}
        <circle cx='44' cy='32' r='3' fill={gem} stroke={stroke} strokeWidth='1' />
        <path d='M44 35 L44 44' stroke={steel} strokeWidth='1.5' />
        {/* Suit motif hem */}
        <g opacity='0.25' fill={motif} fontSize='6'>
          <text x='24' y='48'>{suit}</text>
          <text x='28' y='48'>{suit}</text>
          <text x='32' y='48'>{suit}</text>
          <text x='36' y='48'>{suit}</text>
          <text x='40' y='48'>{suit}</text>
        </g>
        {/* Locket emblem */}
        <SuitEmblem cx={32} cy={36} scale={0.7} />
      </svg>
    )
  }

  // Jack
  return (
    <svg width={size} height={size} viewBox='0 0 64 64' fill='none' aria-label='Jack'>
      {/* Cap */}
      <path d='M22 18 H42 L38 14 H26 Z' fill={gold} stroke={stroke} strokeWidth='1' />
      <path d='M28 14 L32 12 L36 14' stroke={gem} strokeWidth='1.4' />
      {/* Face */}
      <rect x='26' y='20' width='12' height='9' rx='3' fill='#ffe0b2' stroke={stroke} strokeWidth='1' />
      {/* Collar */}
      <path d='M24 30 H40 L38 34 H26 Z' fill={trim} stroke={stroke} strokeWidth='1' />
      {/* Tunic */}
      <rect x='22' y='34' width='20' height='14' rx='2' fill={robe} stroke={stroke} strokeWidth='1.2' />
      <path d='M22 40 H42' stroke={trim} strokeWidth='2' />
      {/* Suit pattern band */}
      <g opacity='0.28' fill={motif} fontSize='6'>
        <text x='24' y='44'>{suit}</text>
        <text x='28' y='44'>{suit}</text>
        <text x='32' y='44'>{suit}</text>
        <text x='36' y='44'>{suit}</text>
        <text x='40' y='44'>{suit}</text>
      </g>
      {/* Chest badge */}
      <SuitEmblem cx={32} cy={38} scale={0.65} />
      {/* Dagger */}
      <rect x='32' y='28' width='2' height='12' fill={steel} />
    </svg>
  )
}

export default function GameTable({ onStrategyContext }) {
  const rng = useMemo(() => undefined, [])
  const [state, setState] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [history, setHistory] = useState([])
  const [voiceOn, setVoiceOn] = useState(true)
  const [musicOn, setMusicOn] = useState(false)
  const [voiceEvent, setVoiceEvent] = useState(null)
  const music = useAmbientMusic()

  const phase = state?.phase ?? 'idle'
  const player = state?.player ?? []
  const dealer = state?.dealer ?? []

  function onStart() {
    const s = startRound(rng)
    setState(s)
    if (s.phase === 'ended' && s.outcome) {
      recordOutcome(s.outcome)
    }
    const dealerUpLocal = s.dealer[0]
    setVoiceEvent({
      id: Date.now() + '-deal',
      type: 'deal',
      player: s.player,
      dealerUp: dealerUpLocal,
      playerTotal: handValue(s.player)
    })
    if (musicOn && !music.enabled) music.start()
  }
  function onHit() {
    setState(s => {
      const next = { ...playerHit({ ...s, player: [...s.player], dealer: [...s.dealer], deck: [...s.deck] }) }
      if (next.phase === 'ended' && next.outcome) {
        recordOutcome(next.outcome)
      }
      const card = next.player[next.player.length - 1]
      setVoiceEvent({ id: Date.now() + '-hit', type: 'hit', card, playerTotal: handValue(next.player) })
      return next
    })
  }
  function onStand() {
    setState(s => {
      const next = { ...playerStand({ ...s, player: [...s.player], dealer: [...s.dealer], deck: [...s.deck] }) }
      if (next.phase === 'ended' && next.outcome) {
        recordOutcome(next.outcome)
      }
      setVoiceEvent({ id: Date.now() + '-stand', type: 'stand' })
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
        <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Toggle on={voiceOn} onClick={() => setVoiceOn(v => !v)}>Voice</Toggle>
          <Toggle on={musicOn} onClick={() => { const next = !musicOn; setMusicOn(next); if (next) music.start(); else music.stop() }}>Music</Toggle>
        </div>
        <DealerChat onSpeak={text => setVoiceEvent({ id: Date.now() + '-chat', type: 'chat', text })} />
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
      {/* Voice dealer announcer */}
      <DealerVoice enabled={voiceOn} event={voiceEventFor(state, voiceEvent)} />
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

function Toggle({ on, onClick, children }) {
  return (
    <button onClick={onClick} className='btn' style={{
      padding: '8px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
      background: on ? '#9fffc7' : 'transparent', color: on ? '#0b132b' : '#e0fbfc',
      border: on ? 0 : '1px solid rgba(255,255,255,0.35)'
    }}>{children}</button>
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

function voiceEventFor(state, pending) {
  if (!state) return pending
  if (state.phase === 'ended' && state.outcome && (!pending || !String(pending.id).includes('-end'))) {
    return {
      id: Date.now() + '-end',
      type: 'end',
      outcome: state.outcome,
      outcomeLabel: outcomeLabel(state.outcome),
      playerTotal: handValue(state.player || []),
      dealerTotal: handValue(state.dealer || [])
    }
  }
  return pending
}
