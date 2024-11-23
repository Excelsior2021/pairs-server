import type {
  nonNumValue,
  nonNumValue as nonNumValueType,
  playerID as playerIDType,
  playerServer as playerServerType,
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

export type session = {
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

type gameStateplayers = {
  [player: string]: player
}

type gameStateClient = {
  player: player
  opponent: player
  shuffledDeck: card[]
}

export type gameState = gameStateplayers & {
  shuffledDeck: card[]
}

export type createSuits = (
  value: number | nonNumValueType,
  deck: card[],
  deckIndex: number,
  suits: suitType[]
) => number

export type createDeck = (
  createSuits: createSuits,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => card[]

export type shuffleDeck = (deck: card[]) => card[]

export type dealcard = (deck: card[]) => card | undefined

export type dealHand = (deck: card[], handSize: number) => card[]

export type initialPairs = (hand: card[]) => card[]

export type startGame = (
  createSuits: createSuits,
  createDeck: createDeck,
  shuffleDeck: shuffleDeck,
  dealHand: dealHand,
  initialPairs: initialPairs,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => {
  shuffledDeck: card[]
  player1: player
  player2: player
}

export type handleplayerMatchPairs = (
  playerRequest: playerRequest,
  playerMatch: playerMatch,
  gameState: gameState,
  playerID: typeof playerIDType,
  playerServer: typeof playerServerType
) => gameState | undefined

export type handleDealcard = (
  playerRequest: playerRequest,
  gameState: gameState,
  dealcard: dealcard,
  playerOutput: typeof playerOutputType,
  playerID: typeof playerIDType,
  playerServer: typeof playerServerType
) => { gameState: gameState; playerOutput: playerOutputType } | undefined

export type game = {
  createSuits: createSuits
  createDeck: createDeck
  shuffleDeck: shuffleDeck
  dealcard: dealcard
  dealHand: dealHand
  initialPairs: initialPairs
  startGame: startGame
  handleplayerMatchPairs: handleplayerMatchPairs
  handleDealcard: handleDealcard
}

type gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: playerID
) => gameState
