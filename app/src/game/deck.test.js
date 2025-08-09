import { describe, it, expect } from 'vitest'
import { createDeck, shuffle, draw, formatCard } from './deck.js'

function cardKey(c) { return `${c.rank}-${c.suit}` }

describe('deck', () => {
  it('creates a full 52-card deck with unique cards', () => {
    const d = createDeck()
    expect(d.length).toBe(52)
    const set = new Set(d.map(cardKey))
    expect(set.size).toBe(52)
  })

  it('shuffles but preserves card set', () => {
    const base = createDeck()
    const before = new Set(base.map(cardKey))
    const shuffled = shuffle([...base], () => 0) // deterministic though odd ordering
    const after = new Set(shuffled.map(cardKey))
    expect(after).toEqual(before)
    expect(shuffled.length).toBe(52)
  })

  it('draws from the end of the deck', () => {
    const d = [{ rank: 'A', suit: '♠' }, { rank: 'K', suit: '♥' }]
    const got = draw(d, 1)
    expect(got).toEqual([{ rank: 'K', suit: '♥' }])
    expect(d).toEqual([{ rank: 'A', suit: '♠' }])
  })

  it('formats cards visibly', () => {
    expect(formatCard({ rank: 'Q', suit: '♦' })).toBe('Q♦')
  })
})

