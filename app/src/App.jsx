import { useEffect, useState } from 'react'

export default function App() {
  const [apiMessage, setApiMessage] = useState(null)

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((data) => setApiMessage(data))
      .catch(() => setApiMessage({ ok: false }))
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif'
    }}>
      <main style={{ textAlign: 'center', padding: 24 }}>
        <img src="/icons/logo.svg" alt="Caseeno" width="96" height="96" />
        <h1 style={{ margin: '16px 0 8px' }}>Caseeno Blackjack</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>Cloudflare PWA starter</p>

        <section style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <strong>API check:</strong>
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(apiMessage, null, 2)}
          </pre>
        </section>

        <a
          href="https://developers.cloudflare.com/pages/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            borderRadius: 8,
            background: '#5bc0be',
            color: '#0b132b',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          Docs: Cloudflare Pages
        </a>
      </main>
    </div>
  )
}

