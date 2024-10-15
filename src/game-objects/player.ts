import type Card from "@/game-objects/card.ts"

export default class Player {
  hand: Card[]
  pairs: Card[]

  constructor(hand: Card[], pairs: Card[]) {
    this.hand = hand
    this.pairs = pairs
  }
}
