export type session = {
  sessionID: string
  playersSocketIDs: string[]
}

export class Card {
  id: string
  value: string | number
  suit: string

  constructor(id: string, value: string | number, suit: string) {
    this.id = id
    this.value = value
    this.suit = suit
  }
}

export type playerRequest = {
  player: number
  card: Card
}

export type gameState = {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Pairs: Card[]
  player2Pairs: Card[]
  shuffledDeck: Card[]
}
