import GameTable from './components/GameTable.jsx'
import StrategyDock from './components/StrategyDock.jsx'
import { useState } from 'react'

export default function App() {
  const [strategyInfo, setStrategyInfo] = useState(null)
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b132b',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif'
    }}>
      {/* Logo top-left */}
      <a href='/' aria-label='Caseeno Home' style={{
        position: 'fixed', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
        color: 'inherit', textDecoration: 'none', zIndex: 50
      }}>
        <img src='/icons/logo.svg' alt='' width='28' height='28' style={{ filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.4))' }} />
        <strong style={{ letterSpacing: 0.3 }}>Caseeno</strong>
      </a>
      <main style={{ textAlign: 'center', padding: 24, width: 'min(1040px, 100%)' }}>
        <h1 style={{ margin: '0 0 8px' }}>Caseeno Blackjack</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>Phase 0 foundation: UI shell + game core</p>

        <div className='table-felt' style={{
          position: 'relative',
          margin: '0 auto',
          width: 'min(980px, 95vw)',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          borderRadius: 9999,
          background: 'radial-gradient(120% 120% at 50% 10%, #2a9d8f 0%, #1b5e54 60%, #0f3b35 100%)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 2px 8px rgba(255,255,255,0.08)',
          border: '2px solid rgba(0,0,0,0.3)'
        }}>
          {/* Seats */}
          <div className='seats' aria-hidden='true'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`seat seat-${i+1}`} />
            ))}
          </div>
          <section style={{ width: 'min(900px, 100%)', height: '100%' }}>
            <GameTable onStrategyContext={setStrategyInfo} />
          </section>
        </div>
      </main>
      <StrategyDock context={strategyInfo} />
    </div>
  )
}
