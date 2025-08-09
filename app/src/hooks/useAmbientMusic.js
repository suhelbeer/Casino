import { useEffect, useRef, useState } from 'react'

export default function useAmbientMusic() {
  const ctxRef = useRef(null)
  const nodesRef = useRef({})
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  function ensureContext() {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    const ctx = new Ctx()
    ctxRef.current = ctx
    return ctx
  }

  function start() {
    const ctx = ensureContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    if (nodesRef.current.master) return // already playing

    const master = ctx.createGain()
    master.gain.value = 0.08
    master.connect(ctx.destination)

    // Create two gentle detuned sine pads through a low-pass filter
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 800
    filter.Q.value = 0.7
    filter.connect(master)

    const oscA = ctx.createOscillator()
    const gainA = ctx.createGain()
    oscA.type = 'sine'
    oscA.frequency.value = 196 // G3
    oscA.detune.value = -6
    gainA.gain.value = 0.2
    oscA.connect(gainA)
    gainA.connect(filter)

    const oscB = ctx.createOscillator()
    const gainB = ctx.createGain()
    oscB.type = 'sine'
    oscB.frequency.value = 261.63 // C4
    oscB.detune.value = +6
    gainB.gain.value = 0.18
    oscB.connect(gainB)
    gainB.connect(filter)

    oscA.start()
    oscB.start()

    // Subtle LFO to modulate filter cutoff
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 120
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    nodesRef.current = { master, filter, oscA, oscB, gainA, gainB, lfo, lfoGain }
    setEnabled(true)
  }

  function stop() {
    const ctx = ctxRef.current
    const n = nodesRef.current
    if (!ctx || !n.master) return
    try { n.oscA.stop(); n.oscB.stop(); n.lfo.stop() } catch {}
    try { n.master.disconnect() } catch {}
    nodesRef.current = {}
    setEnabled(false)
  }

  return { start, stop, enabled }
}

