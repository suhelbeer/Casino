import { createDeck, shuffle, draw } from './deck.js'
import { handValue, isBlackjack, isBust } from './hand.js'

export function startRound(rng) {
  const deck = shuffle(createDeck(), rng)
  const player = draw(deck, 2)
  const dealer = draw(deck, 2)

  const state = {
    phase: 'player', // 'player' | 'dealer' | 'ended'
    deck,
    player,
    dealer,
    outcome: null // 'player_blackjack' | 'dealer_blackjack' | 'player_bust' | 'dealer_bust' | 'player_win' | 'dealer_win' | 'push'
  }

  if (isBlackjack(player) || isBlackjack(dealer)) {
    state.phase = 'ended'
    state.outcome = resolveOutcome(state)
  }
  return state
}

export function playerHit(state) {
  if (state.phase !== 'player') return state
  state.player.push(...draw(state.deck, 1))
  if (isBust(state.player)) {
    state.phase = 'ended'
    state.outcome = 'player_bust'
  }
  return state
}

export function playerStand(state) {
  if (state.phase !== 'player') return state
  state.phase = 'dealer'
  // Dealer hits to 17 (stand on soft 17 configurable later; here: stand on 17+)
  while (handValue(state.dealer) < 17) {
    state.dealer.push(...draw(state.deck, 1))
  }
  if (isBust(state.dealer)) {
    state.phase = 'ended'
    state.outcome = 'dealer_bust'
    return state
  }
  state.phase = 'ended'
  state.outcome = resolveOutcome(state)
  return state
}

export function resolveOutcome(state) {
  const pv = handValue(state.player)
  const dv = handValue(state.dealer)
  const pBJ = isBlackjack(state.player)
  const dBJ = isBlackjack(state.dealer)

  if (pBJ && dBJ) return 'push'
  if (pBJ) return 'player_blackjack'
  if (dBJ) return 'dealer_blackjack'
  if (pv > 21) return 'player_bust'
  if (dv > 21) return 'dealer_bust'
  if (pv > dv) return 'player_win'
  if (pv < dv) return 'dealer_win'
  return 'push'
}

export function summary(state) {
  return {
    phase: state.phase,
    playerValue: handValue(state.player),
    dealerValue: handValue(state.dealer),
    outcome: state.outcome
  }
}

