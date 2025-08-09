// Basic strategy (simplified): S17, no surrender, no splits
// Focuses on hard/soft totals. Returns primary suggestion and a fallback
// for UIs without Double.

import { handValue } from './hand.js'

function computeTotalAndSoft(cards) {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank === 'A') { aces += 1; total += 11 }
    else if (['K', 'Q', 'J'].includes(c.rank)) total += 10
    else total += Number(c.rank)
  }
  // count how many aces remain as 11 after adjustment
  let softAces = aces
  while (total > 21 && softAces > 0) {
    total -= 10
    softAces -= 1
  }
  const soft = softAces > 0
  return { total, soft }
}

function upRankValue(up) {
  if (!up) return 0
  if (up.rank === 'A') return 11
  if (['K', 'Q', 'J'].includes(up.rank)) return 10
  return Number(up.rank)
}

export function basicStrategy(playerCards, dealerUpCard) {
  const { total, soft } = computeTotalAndSoft(playerCards)
  const up = upRankValue(dealerUpCard)

  // Soft totals
  if (soft) {
    switch (total) {
      case 13: // A,2
      case 14: // A,3
        return up >= 5 && up <= 6 ? suggest('double', 'hit') : suggest('hit')
      case 15: // A,4
      case 16: // A,5
        return up >= 4 && up <= 6 ? suggest('double', 'hit') : suggest('hit')
      case 17: // A,6
        return up >= 3 && up <= 6 ? suggest('double', 'hit') : suggest('hit')
      case 18: // A,7
        if (up >= 3 && up <= 6) return suggest('double', 'stand')
        if (up === 2 || up === 7 || up === 8) return suggest('stand')
        return suggest('hit') // vs 9,10,A
      case 19:
      case 20:
      case 21:
        return suggest('stand')
    }
  }

  // Hard totals
  if (total >= 17) return suggest('stand')
  if (total === 16) return up >= 2 && up <= 6 ? suggest('stand') : suggest('hit')
  if (total === 15) return up >= 2 && up <= 6 ? suggest('stand') : suggest('hit')
  if (total >= 13 && total <= 14) return up >= 2 && up <= 6 ? suggest('stand') : suggest('hit')
  if (total === 12) return up >= 4 && up <= 6 ? suggest('stand') : suggest('hit')
  if (total === 11) return up === 11 ? suggest('hit') : suggest('double', 'hit')
  if (total === 10) return up >= 2 && up <= 9 ? suggest('double', 'hit') : suggest('hit')
  if (total === 9) return up >= 3 && up <= 6 ? suggest('double', 'hit') : suggest('hit')
  return suggest('hit') // 8 or less
}

function suggest(primary, fallback) {
  return { primary, fallback: fallback || null }
}

export function formatSuggestion(s) {
  if (!s) return ''
  if (s.primary === 'double' && s.fallback) return `Double (else ${capitalize(s.fallback)})`
  return capitalize(s.primary)
}

function capitalize(s) { return s[0].toUpperCase() + s.slice(1) }

