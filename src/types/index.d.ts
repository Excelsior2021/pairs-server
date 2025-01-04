import type {
  nonNumValue,
  PlayerID,
  playerOutput as playerOutputType,
  suit as suitType,
} from "@/enums/index.ts"

export type card = {
  id: string
  value: nonNumValue | number
  suit: suitType
  img: string
}

export type player = {
  hand: card[]
  pairs: card[]
}

export type sessions = {
  [sessionID: string]: {
    playerSocketsIDs: string[]
  }
}

export type playerRequest = {
  playerID: PlayerID
  card: card
}

export type playerMatch = {
  playerID: PlayerID
  card: card
}

type gameStateClient = {
  player: player
  opponent: player
  deck: card[]
}

export type gameStateServer = {
  player1: player
  player2: player
  deck: card[]
}

export type shuffleDeck = (deck: card[]) => void

export type initialPairs = (hand: card[]) => card[]

export type startGame = (
  deck: card[],
  shuffleDeck: shuffleDeck,
  initialPairs: initialPairs
) => {
  deck: card[]
  player1: player
  player2: player
}

export type handlePlayerMatchPairs = (
  playerRequest: playerRequest,
  playerMatch: playerMatch,
  gameState: gameStateClient
) => gameStateClient

export type handleDealCard = (
  playerRequest: playerRequest,
  gameState: gameStateClient,
  playerOutput: typeof playerOutputType
) => { newGameStateClient: gameStateClient; playerOutput: playerOutputType }

export type game = {
  shuffleDeck: shuffleDeck
  initialPairs: initialPairs
  startGame: startGame
  handlePlayerMatchPairs: handlePlayerMatchPairs
  handleDealCard: handleDealCard
}

type gameStateRemap = (
  gameState: gameStateClient,
  playerID: PlayerID
) => gameStateServer
