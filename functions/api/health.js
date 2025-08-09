export async function onRequest({ env }) {
  const started = globalThis.__START_TIME__ || (globalThis.__START_TIME__ = Date.now())
  const uptime = Math.round((Date.now() - started) / 1000)
  const body = {
    ok: true,
    service: 'health',
    version: env?.VERSION || 'dev',
    uptime_s: uptime,
    time: new Date().toISOString()
  }
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
}

