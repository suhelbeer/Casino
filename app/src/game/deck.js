const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck() {
  const deck = []
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ rank: r, suit: s })
    }
  }
  return deck
}

export function shuffle(deck, rng = Math.random) {
  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function draw(deck, n = 1) {
  const cards = []
  for (let i = 0; i < n; i++) cards.push(deck.pop())
  return cards
}

export function formatCard(card) {
  return card ? `${card.rank}${card.suit}` : ''
}
