import { useState } from 'react'

export default function StrategyDock({ context }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        className='dock dock--closed'
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 12, right: 12, zIndex: 60,
          background: 'rgba(15,26,58,0.95)', color: '#e0fbfc',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9999,
          padding: '10px 14px', cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
        }}
        aria-label='Open strategy'
      >
        Strategy ▴
      </button>
    )
  }

  // Data-driven rules for highlighting
  const hardRules = [
    { key: 'h17p', label: '17+', match: t => t >= 17, action: 'stand', vs: 'Any' },
    { key: 'h16', label: '16', match: t => t === 16, action: 'stand', vs: '2–6', else: 'hit' },
    { key: 'h15', label: '15', match: t => t === 15, action: 'stand', vs: '2–6', else: 'hit' },
    { key: 'h13_14', label: '13–14', match: t => t >= 13 && t <= 14, action: 'stand', vs: '2–6', else: 'hit' },
    { key: 'h12', label: '12', match: t => t === 12, action: 'stand', vs: '4–6', else: 'hit' },
    { key: 'h11', label: '11', match: t => t === 11, action: 'double', vs: '2–10', else: 'hit' },
    { key: 'h10', label: '10', match: t => t === 10, action: 'double', vs: '2–9', else: 'hit' },
    { key: 'h9', label: '9', match: t => t === 9, action: 'double', vs: '3–6', else: 'hit' },
    { key: 'h8m', label: '8 or less', match: t => t <= 8, action: 'hit', vs: 'Any' }
  ]
  const softRules = [
    { key: 's19p', label: 'A,8+ (19–21)', match: t => t >= 19, action: 'stand', vs: 'Any' },
    { key: 's18', label: 'A,7 (18)', match: t => t === 18, action: 'double', vs: '3–6', else: 'stand', elseNote: 'vs 2/7/8 Stand; else Hit' },
    { key: 's17', label: 'A,6 (17)', match: t => t === 17, action: 'double', vs: '3–6', else: 'hit' },
    { key: 's15_16', label: 'A,4–A,5 (15–16)', match: t => t >= 15 && t <= 16, action: 'double', vs: '4–6', else: 'hit' },
    { key: 's13_14', label: 'A,2–A,3 (13–14)', match: t => t >= 13 && t <= 14, action: 'double', vs: '5–6', else: 'hit' }
  ]

  function upInRange(range, up) {
    if (range === 'Any') return true
    // ranges like '2–6', '3–6', '4–6', '2–10', '5–6'
    const [a, b] = range.split('–').map(x => (x === 'A' ? 11 : Number(x)))
    return up >= a && up <= b
  }

  function isHighlighted(rule) {
    if (!context) return false
    const t = context.total
    const up = context.up
    const inRange = upInRange(rule.vs, up)
    const matchesTotal = rule.match(t)
    const suggested = context.suggestion
    const fallback = context.fallback
    if (!(matchesTotal && inRange)) return false
    // highlight if primary or fallback matches suggested/fallback
    return suggested === rule.action || (!!rule.else && (suggested === rule.else || fallback === rule.else))
  }

  return (
    <div
      className='dock dock--open'
      style={{
        position: 'fixed', bottom: 12, right: 12, zIndex: 60,
        width: 'min(380px, 92vw)', maxHeight: '70vh', overflow: 'auto',
        background: 'rgba(15,26,58,0.97)', color: '#fff', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 16px 28px rgba(0,0,0,0.45)', animation: 'pop 200ms ease-out both'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <strong>Strategy</strong>
        <button onClick={() => setOpen(false)} className='btn' style={{
          background: 'transparent', color: '#e0fbfc', border: '1px solid rgba(255,255,255,0.3)',
          padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
        }}>Close</button>
      </div>
      <div style={{ padding: 12 }}>
        <Legend />
        <Section title='Hard Totals'>
          {hardRules.map(r => (
            <RuleRow key={r.key} rule={r} highlight={context && !context.soft && isHighlighted(r)} />
          ))}
        </Section>

        <Section title='Soft Totals (A=11)'>
          {softRules.map(r => (
            <RuleRow key={r.key} rule={r} highlight={context && context.soft && isHighlighted(r)} />
          ))}
        </Section>
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, alignItems: 'center' }}>
      <span className='tag act-stand'>Stand</span>
      <span className='tag act-hit'>Hit</span>
      <span className='tag act-double'>Double</span>
      <span style={{ opacity: 0.75 }}>| If Double unavailable, fallback indicated in notes.</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'grid', gap: 6 }}>{children}</div>
    </div>
  )
}

function RuleRow({ rule, highlight }) {
  return (
    <div className={highlight ? 'row row--current' : 'row'} style={{
      display: 'grid', gridTemplateColumns: '140px 80px 1fr', gap: 8, alignItems: 'center',
      background: highlight ? 'rgba(159,255,199,0.12)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${highlight ? 'rgba(159,255,199,0.55)' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 8, padding: '6px 8px'
    }}>
      <div style={{ opacity: 0.95 }}>{rule.label}</div>
      <div style={{ textAlign: 'center' }}>{rule.vs}</div>
      <div>
        <span className={`tag act-${rule.action}`}>{cap(rule.action)}</span>
        {rule.else && (
          <>
            <span style={{ margin: '0 4px', opacity: 0.8 }}>else</span>
            <span className={`tag act-${rule.else}`}>{cap(rule.else)}</span>
          </>
        )}
      </div>
    </div>
  )
}

function cap(s) { return s[0].toUpperCase() + s.slice(1) }
