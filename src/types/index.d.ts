import type {
  nonNumValue,
  playerID as playerIDType,
  playerOutput as playerOutputType,
  suit as suitType,
  playerID,
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
  clientPlayer: playerIDType
  card: card
}

export type playerMatch = {
  clientPlayer: playerIDType
  card: card
}

type gameStateClient = {
  player: player
  opponent: player
  shuffledDeck: card[]
}

export type gameStateServer = {
  player1: player
  player2: player
  shuffledDeck: card[]
}

export type shuffleDeck = (deck: card[]) => card[]

export type dealHand = (deck: card[], handSize: number) => card[]

export type initialPairs = (hand: card[]) => card[]

export type startGame = (
  deck: card[],
  shuffleDeck: shuffleDeck,
  dealHand: dealHand,
  initialPairs: initialPairs
) => {
  shuffledDeck: card[]
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
  dealHand: dealHand
  initialPairs: initialPairs
  startGame: startGame
  handlePlayerMatchPairs: handlePlayerMatchPairs
  handleDealCard: handleDealCard
}

type gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: playerID
) => gameStateServer
