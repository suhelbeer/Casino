export async function onRequest() {
  return new Response(
    JSON.stringify({ ok: true, service: 'pages-func', time: new Date().toISOString() }),
    { headers: { 'content-type': 'application/json' } }
  )
}

