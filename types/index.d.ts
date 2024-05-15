import type Player from "../src/gameObjects/Player"

export type session = {
  sessionID: string
  playersSocketIDs: string[]
}

export type playerRequest = {
  player: number
  card: Card
}

export type gameStateClient = {
  player: Player
  opponent: Player
  shuffledDeck: Card[]
}

export type gameStateServer = {
  player1: Player
  player2: Player
  shuffledDeck: Card[]
}
