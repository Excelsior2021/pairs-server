import type { Card, Player } from "@/game-objects/index.ts"

export type session = {
  sessionID: string
  playerSocketsIDs: string[]
}

export type playerRequest = {
  player: number
  card: Card
}

export type playerMatch = {
  clientPlayer: number
  card: Card
}

type gameStatePlayers = {
  [player: string]: Player
}

export type gameState = gameStatePlayers & {
  shuffledDeck: Card[]
}
