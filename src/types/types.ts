import Player from "../gameObjects/Player"

export type session = {
  sessionID: string
  playersSocketIDs: string[]
}

export class Card {
  id: string
  value: string | number
  suit: string
  img: string

  constructor(id: string, value: string | number, suit: string, img: string) {
    this.id = id
    this.value = value
    this.suit = suit
    this.img = img
  }
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

export enum playerOutput {
  DealtCardMatch = 1,
  HandMatch,
  NoMatch,
}
