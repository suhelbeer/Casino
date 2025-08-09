import { describe, it, expect } from 'vitest'
import { basicStrategy, formatSuggestion } from './strategy.js'

const C = (rank, suit = '♠') => ({ rank, suit })

describe('strategy', () => {
  it('hard 16 vs 10 → Hit', () => {
    const s = basicStrategy([C('10'), C('6')], C('K'))
    expect(s.primary).toBe('hit')
    expect(formatSuggestion(s)).toMatch(/Hit/i)
  })

  it('hard 12 vs 4 → Stand; vs 2 → Hit', () => {
    expect(basicStrategy([C('10'), C('2')], C('4')).primary).toBe('stand')
    expect(basicStrategy([C('10'), C('2')], C('2')).primary).toBe('hit')
  })

  it('soft 18 vs 3-6 → Double else Stand; vs 9 → Hit', () => {
    expect(basicStrategy([C('A'), C('7')], C('3')).primary).toBe('double')
    expect(basicStrategy([C('A'), C('7')], C('8')).primary).toBe('stand')
    expect(basicStrategy([C('A'), C('7')], C('9')).primary).toBe('hit')
  })

  it('11 vs A → Hit; vs 10 → Double', () => {
    expect(basicStrategy([C('9'), C('2')], C('A')).primary).toBe('hit')
    expect(basicStrategy([C('9'), C('2')], C('K')).primary).toBe('double')
  })

  it('9 vs 3-6 → Double; else Hit', () => {
    expect(basicStrategy([C('5'), C('4')], C('3')).primary).toBe('double')
    expect(basicStrategy([C('5'), C('4')], C('2')).primary).toBe('hit')
  })
})

