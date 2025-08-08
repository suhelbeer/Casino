import { useState } from 'react'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function pingApi() {
    setLoading(true)
    try {
      const res = await fetch('/api/hello')
      const json = await res.json()
      setResult(json)
    } catch (e) {
      setResult({ ok: false, error: 'fetch_failed' })
    } finally {
      setLoading(false)
    }
  }

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
      <main style={{ textAlign: 'center', padding: 24 }}>
        <h1 style={{ margin: '0 0 8px' }}>Test Branch Web App</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>Minimal page to verify deploy + API</p>

        <button onClick={pingApi} disabled={loading} style={{
          padding: '10px 16px',
          borderRadius: 8,
          background: '#5bc0be',
          color: '#0b132b',
          fontWeight: 600,
          border: 0,
          cursor: 'pointer'
        }}>
          {loading ? 'Pinging…' : 'Ping /api/hello'}
        </button>

        <pre style={{
          marginTop: 16,
          textAlign: 'left',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: 16,
          whiteSpace: 'pre-wrap'
        }}>
{JSON.stringify(result, null, 2)}
        </pre>
      </main>
    </div>
  )
}
