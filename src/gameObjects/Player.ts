import type Card from "./Card"

export default class Player {
  hand: Card[]
  pairs: Card[]

  constructor(hand: Card[], pairs: Card[]) {
    this.hand = hand
    this.pairs = pairs
  }
}
