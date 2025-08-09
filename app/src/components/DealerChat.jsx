import { useEffect, useRef, useState } from 'react'

export default function DealerChat({ onSpeak }) {
  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = false
    r.onresult = e => {
      const text = e.results[0][0].transcript
      handleUserText(text)
    }
    r.onend = () => setListening(false)
    recRef.current = r
  }, [])

  async function handleUserText(text) {
    const next = [...messages, { role: 'user', text }]
    setMessages(next)
    const payload = {
      messages: [
        { role: 'system', content: 'You are a friendly casino dealer. Keep replies brief.' },
        ...next.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
      ]
    }
    try {
      const res = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      const reply = data.reply || ''
      setMessages(m => [...m, { role: 'dealer', text: reply }])
      onSpeak?.(reply)
    } catch {}
  }

  function start() {
    const r = recRef.current
    if (!r || listening) return
    setListening(true)
    r.start()
  }

  return (
    <div style={{ marginTop: 10, textAlign: 'center' }}>
      <button className='btn' onClick={start} disabled={listening} style={{ padding: '8px 12px', borderRadius: 8 }}>
        {listening ? 'Listening…' : 'Chat'}
      </button>
      <div style={{ marginTop: 6, fontSize: 12, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>
        {messages.slice(-2).map((m, i) => (
          <div key={i} style={{ opacity: 0.85 }}>
            <strong>{m.role === 'user' ? 'You' : 'Dealer'}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  )
}
