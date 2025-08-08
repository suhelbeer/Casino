import { useEffect } from 'react'

export default function StrategyHelp({ open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className='overlay' style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      animation: 'fadeIn 200ms ease-out both'
    }} onClick={onClose}>
      <div className='dialog' role='dialog' aria-modal='true' onClick={(e) => e.stopPropagation()} style={{
        width: 'min(820px, 95vw)', maxHeight: '85vh', overflow: 'auto',
        background: '#0f1a3a', color: '#fff', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'pop 220ms cubic-bezier(.2,.8,.2,1) both'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <strong>Basic Strategy — S17, no splits/surrender</strong>
          <button onClick={onClose} aria-label='Close' style={{
            background: 'transparent', color: '#e0fbfc', border: '1px solid rgba(255,255,255,0.3)',
            padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
          }}>Close</button>
        </div>

        <div style={{ padding: 16, display: 'grid', gap: 16 }}>
          <p style={{ opacity: 0.9, margin: 0 }}>Compact chart for common decisions. Dealer stands on 17. Pair splits and surrender not included.</p>

          <Section title='Hard Totals'>
            <Rule total='17+' action='Stand' detail='Always' />
            <Rule total='16' action='Stand' detail='vs 2–6; else Hit' />
            <Rule total='15' action='Stand' detail='vs 2–6; else Hit' />
            <Rule total='13–14' action='Stand' detail='vs 2–6; else Hit' />
            <Rule total='12' action='Stand' detail='vs 4–6; else Hit' />
            <Rule total='11' action='Double' detail='vs 2–10; vs A Hit' />
            <Rule total='10' action='Double' detail='vs 2–9; else Hit' />
            <Rule total='9' action='Double' detail='vs 3–6; else Hit' />
            <Rule total='8 or less' action='Hit' detail='Always' />
          </Section>

          <Section title='Soft Totals (A counted as 11)'>
            <Rule total='A,8+ (19–21)' action='Stand' detail='Always' />
            <Rule total='A,7 (18)' action='Double' detail='vs 3–6; vs 2/7/8 Stand; else Hit' />
            <Rule total='A,6 (17)' action='Double' detail='vs 3–6; else Hit' />
            <Rule total='A,4–A,5 (15–16)' action='Double' detail='vs 4–6; else Hit' />
            <Rule total='A,2–A,3 (13–14)' action='Double' detail='vs 5–6; else Hit' />
          </Section>

          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Note: If Double is unavailable, take the fallback (Hit or Stand) indicated by hints on the table.
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {children}
      </div>
    </div>
  )
}

function Rule({ total, action, detail }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 120px 1fr',
      gap: 8, alignItems: 'center', padding: '6px 8px',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8
    }}>
      <div style={{ opacity: 0.9 }}>{total}</div>
      <div style={{ fontWeight: 700, color: '#9fffc7' }}>{action}</div>
      <div style={{ opacity: 0.9 }}>{detail}</div>
    </div>
  )
}
