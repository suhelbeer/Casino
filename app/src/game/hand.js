export function handValue(cards) {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank === 'A') { aces += 1; total += 11 }
    else if (['K', 'Q', 'J'].includes(c.rank)) total += 10
    else total += Number(c.rank)
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

export function isBlackjack(cards) {
  return cards.length === 2 && handValue(cards) === 21
}

export function isBust(cards) {
  return handValue(cards) > 21
}

