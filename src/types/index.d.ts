import type { Card, Player } from "@/game-objects/index.ts"

export type session = {
  sessionID: string
  playerSocketsIDs: string[]
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
