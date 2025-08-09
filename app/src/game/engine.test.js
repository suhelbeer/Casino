import { describe, it, expect } from 'vitest'
import { startRound, playerHit, playerStand, resolveOutcome } from './engine.js'

const C = (rank, suit = '♠') => ({ rank, suit })

describe('engine', () => {
  it('startRound deals two each and leaves 48 in deck', () => {
    const s = startRound(() => 0) // deterministic shuffle
    expect(['player', 'ended']).toContain(s.phase)
    expect(s.player.length).toBe(2)
    expect(s.dealer.length).toBe(2)
    expect(s.deck.length).toBe(48)
  })

  it('playerHit can bust and end the round', () => {
    const state = {
      phase: 'player',
      deck: [C('K')], // next draw busts
      player: [C('K'), C('Q')], // 20
      dealer: [C('9'), C('7')],
      outcome: null
    }
    playerHit(state)
    expect(state.phase).toBe('ended')
    expect(state.outcome).toBe('player_bust')
  })

  it('playerStand plays dealer to 17+ and resolves', () => {
    const state = {
      phase: 'player',
      deck: [C('2')], // dealer draws to 18
      player: [C('10'), C('7')], // 17
      dealer: [C('9'), C('7')], // 16
      outcome: null
    }
    playerStand(state)
    expect(state.phase).toBe('ended')
    expect(state.outcome).toBe('dealer_win') // 18 vs 17
  })

  it('resolveOutcome handles blackjacks and pushes', () => {
    const base = { phase: 'ended', deck: [], outcome: null }
    expect(resolveOutcome({ ...base, player: [C('A'), C('K')], dealer: [C('A'), C('K')] })).toBe('push')
    expect(resolveOutcome({ ...base, player: [C('A'), C('K')], dealer: [C('9'), C('K')] })).toBe('player_blackjack')
    expect(resolveOutcome({ ...base, player: [C('9'), C('K')], dealer: [C('A'), C('K')] })).toBe('dealer_blackjack')
  })
})

