import { expect, test } from "vitest"
import { remap } from "../src/utils"
import type { gameStateClient, gameStateServer } from "../types"

const gameState: gameStateClient = {
  player: {
    hand: [
      {
        id: "4_of_clubs",
        value: 4,
        suit: "clubs",
        img: "",
      },
      {
        id: "6_of_clubs",
        value: 6,
        suit: "clubs",
        img: "",
      },
    ],
    pairs: [
      {
        id: "2_of_clubs",
        value: 2,
        suit: "clubs",
        img: "",
      },
      {
        id: "2_of_spades",
        value: 2,
        suit: "spades",
        img: "",
      },
    ],
  },
  opponent: {
    hand: [
      {
        id: "8_of_clubs",
        value: 8,
        suit: "clubs",
        img: "",
      },
      {
        id: "10_of_clubs",
        value: 10,
        suit: "clubs",
        img: "",
      },
    ],
    pairs: [
      {
        id: "3_of_clubs",
        value: 3,
        suit: "clubs",
        img: "",
      },
      {
        id: "3_of_spades",
        value: 3,
        suit: "spades",
        img: "",
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
        img: "",
      },
      {
        id: "6_of_clubs",
        value: 6,
        suit: "clubs",
        img: "",
      },
    ],
    pairs: [
      {
        id: "2_of_clubs",
        value: 2,
        suit: "clubs",
        img: "",
      },
      {
        id: "2_of_spades",
        value: 2,
        suit: "spades",
        img: "",
      },
    ],
  },
  player2: {
    hand: [
      {
        id: "8_of_clubs",
        value: 8,
        suit: "clubs",
        img: "",
      },
      {
        id: "10_of_clubs",
        value: 10,
        suit: "clubs",
        img: "",
      },
    ],
    pairs: [
      {
        id: "3_of_clubs",
        value: 3,
        suit: "clubs",
        img: "",
      },
      {
        id: "3_of_spades",
        value: 3,
        suit: "spades",
        img: "",
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
