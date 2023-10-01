export type session = {
  sessionID: string
  playersSocketIDs: string[]
}

export type card = {
  id: string
  value: string | number
  suit: string
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
