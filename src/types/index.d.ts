import type {
  Card as CardType,
  Player as PlayerType,
} from "@/game-objects/index.ts"
import type {
  nonNumValue as nonNumValueType,
  suit as suitType,
} from "@/enums/index.ts"

export type session = {
  sessionID: string
  playerSocketsIDs: string[]
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

export type gameState = gameStatePlayers & {
  shuffledDeck: CardType[]
}

export type createDeck = (
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
