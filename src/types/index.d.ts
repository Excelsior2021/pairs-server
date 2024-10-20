import type {
  Card as CardType,
  Player as PlayerType,
} from "@/game-objects/index.ts"
import type {
  nonNumValue as nonNumValueType,
  playerID as playerIDType,
  playerOutput as playerOutputType,
  playerServer as playerServerType,
  suit as suitType,
} from "@/enums/index.ts"

export type session = {
  [sessionID: string]: {
    playerSocketsIDs: string[]
  }
}

export type playerRequest = {
  player: number
  card: CardType
}

export type playerMatch = {
  clientPlayer: number
  card: CardType
}

type gameStatePlayers = {
  [player: string]: PlayerType
}

type gameStateClient = {
  player: PlayerType
  opponent: PlayerType
  shuffledDeck: CardType[]
}

export type gameState = gameStatePlayers & {
  shuffledDeck: CardType[]
}

export type createSuits = (
  Card: typeof CardType,
  value: number | nonNumValueType,
  deck: CardType[],
  deckIndex: number,
  suits: suitType[]
) => number

export type createDeck = (
  createSuits: createSuits,
  Card: typeof CardType,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => CardType[]

export type shuffleDeck = (deck: CardType[]) => CardType[]

export type dealCard = (deck: CardType[]) => CardType | undefined

export type dealHand = (
  dealCard: dealCard,
  deck: CardType[],
  handSize: number
) => CardType[]

export type initialPairs = (hand: CardType[]) => CardType[]

export type startGame = (
  createSuits: createSuits,
  createDeck: createDeck,
  shuffleDeck: shuffleDeck,
  dealCard: dealCard,
  dealHand: dealHand,
  initialPairs: initialPairs,
  Card: typeof CardType,
  Player: typeof PlayerType,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => {
  shuffledDeck: CardType[]
  player1: PlayerType
  player2: PlayerType
}

export type handlePlayerMatchPairs = (
  playerRequest: playerRequest,
  playerMatch: playerMatch,
  gameState: gameState,
  playerID: typeof playerIDType,
  playerServer: typeof playerServerType
) => gameState | undefined

export type handleDealCard = (
  playerRequest: playerRequest,
  gameState: gameState,
  dealCard: dealCard,
  playerOutput: typeof playerOutputType,
  playerID: typeof playerIDType,
  playerServer: typeof playerServerType
) => { gameState: gameState; playerOutput: playerOutputType } | undefined
