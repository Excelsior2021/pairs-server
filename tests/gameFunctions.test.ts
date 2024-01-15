import { expect, test } from "vitest"
import game from "../src/gameFunctions"

test("if card has correct properties", () => {
  const deck = game.createDeck()
  const card = deck[0]

  expect(card).toHaveProperty("id", "ace_of_clubs")
  expect(card).toHaveProperty("value", "ace")
  expect(card).toHaveProperty("suit", "clubs")
})

test("createDeck function creates deck of 52 cards", () => {
  expect(game.createDeck()).toHaveLength(52)
})

test("dealt card is taken from deck and deck length is reduced by 1", () => {
  const deck = game.createDeck()
  const shuffledDeck = game.shuffleDeck(deck)
  const topCard = shuffledDeck[shuffledDeck.length - 1]

  expect(game.dealCard(shuffledDeck)).toEqual(topCard)
})

test("dealHand functions creates correct amount of cards for hand", () => {
  const deck = game.createDeck()
  const shuffledDeck = game.shuffleDeck(deck)

  expect(game.dealHand(shuffledDeck, 7)).toHaveLength(7)
})
