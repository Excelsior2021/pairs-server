export type session = {
  sessionID: string
  playersSocketIDs: string[]
}

export class Card {
  id: string
  value: string | number
  suit: string

  constructor(id, value, suit) {
    this.id = id
    this.value = value
    this.suit = suit
  }
}

export type playerRequest = {
  player: number
  card: card
}

export type gameState = {
  player1Hand: card[]
  player2Hand: card[]
  player1Pairs: card[]
  player2Pairs: card[]
  shuffledDeck: card[]
}
