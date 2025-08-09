import { describe, it, expect } from 'vitest'
import { handValue, isBlackjack, isBust } from './hand.js'

const C = (rank, suit = '♠') => ({ rank, suit })

describe('hand', () => {
  it('computes values without aces', () => {
    expect(handValue([C('10'), C('9')])).toBe(19)
    expect(handValue([C('5'), C('7'), C('9')])).toBe(21)
  })

  it('handles aces as 11 or 1', () => {
    expect(handValue([C('A'), C('9')])).toBe(20)
    expect(handValue([C('A'), C('9'), C('A')])).toBe(21)
    expect(handValue([C('A'), C('9'), C('A'), C('K')])).toBe(21)
    expect(handValue([C('A'), C('A'), C('9')])).toBe(21)
    expect(handValue([C('A'), C('A'), C('9'), C('9')])).toBe(20)
  })

  it('detects blackjack and bust', () => {
    expect(isBlackjack([C('A'), C('K')])).toBe(true)
    expect(isBlackjack([C('A'), C('9'), C('A')])).toBe(false)
    expect(isBust([C('K'), C('Q'), C('2')])).toBe(true)
  })
})

