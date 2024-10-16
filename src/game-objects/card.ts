import type { suit, nonNumValue } from "@/enums/index.ts"
export default class Card {
  id: string
  value: string | number
  suit: string
  img: string

  constructor(
    id: string,
    value: nonNumValue | number,
    suit: suit,
    img: string
  ) {
    this.id = id
    this.value = value
    this.suit = suit
    this.img = img
  }
}
