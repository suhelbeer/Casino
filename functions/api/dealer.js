export async function onRequest({ request, env }) {
  try {
    const { messages = [] } = await request.json()
    const apiKey = env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'missing api key' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      })
    }
    const payload = {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 100
    }
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })
    const data = await r.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || ''
    return new Response(JSON.stringify({ reply }), {
      headers: { 'content-type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
