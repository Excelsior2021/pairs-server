export default class Card {
  id: string
  value: string | number
  suit: string

  constructor(id: string, value: string | number, suit: string) {
    this.id = id
    this.value = value
    this.suit = suit
  }
}
