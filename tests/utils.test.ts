import { expect, test } from "vitest"
import { gameStateRemap, remap } from "../src/utils/utils"
import { gameStateClient, gameStateServer } from "../src/types/types"

const gameState: gameStateClient = {
  player: {
    hand: [
      {
        id: "4_of_clubs",
        value: 4,
        suit: "clubs",
      },
      {
        id: "6_of_clubs",
        value: 6,
        suit: "clubs",
      },
    ],
    pairs: [
      {
        id: "2_of_clubs",
        value: 2,
        suit: "clubs",
      },
      {
        id: "2_of_spades",
        value: 2,
        suit: "spades",
      },
    ],
  },
  opponent: {
    hand: [
      {
        id: "8_of_clubs",
        value: 8,
        suit: "clubs",
      },
      {
        id: "10_of_clubs",
        value: 10,
        suit: "clubs",
      },
    ],
    pairs: [
      {
        id: "3_of_clubs",
        value: 3,
        suit: "clubs",
      },
      {
        id: "3_of_spades",
        value: 3,
        suit: "spades",
      },
    ],
  },
  shuffledDeck: [],
}

const gameStateRemapped: gameStateServer = {
  player1: {
    hand: [
      {
        id: "4_of_clubs",
        value: 4,
        suit: "clubs",
      },
      {
        id: "6_of_clubs",
        value: 6,
        suit: "clubs",
      },
    ],
    pairs: [
      {
        id: "2_of_clubs",
        value: 2,
        suit: "clubs",
      },
      {
        id: "2_of_spades",
        value: 2,
        suit: "spades",
      },
    ],
  },
  player2: {
    hand: [
      {
        id: "8_of_clubs",
        value: 8,
        suit: "clubs",
      },
      {
        id: "10_of_clubs",
        value: 10,
        suit: "clubs",
      },
    ],
    pairs: [
      {
        id: "3_of_clubs",
        value: 3,
        suit: "clubs",
      },
      {
        id: "3_of_spades",
        value: 3,
        suit: "spades",
      },
    ],
  },
  shuffledDeck: [],
}

test("remap function returns correct gamestate", () => {
  expect(remap(gameState, {}, "player1", "player2")).toStrictEqual(
    gameStateRemapped
  )
})
