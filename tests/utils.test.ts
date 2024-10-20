//@ts-nocheck:
import { expect } from "jsr:@std/expect"
import { describe, it } from "jsr:@std/testing/bdd"
import { gameStateRemap } from "@/utils/index.ts"
import type { gameState } from "@/types/index.d.ts"
import type { Card, Player } from "@/game-objects/index.ts"

describe("utils", () => {
  const player: Player = {
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
  }
  const opponent: Player = {
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
  }
  const shuffledDeck: Card[] = []

  const initialGameState: gameState = {
    player,
    opponent,
    shuffledDeck,
  }

  const gameStateRemapped: gameState = {
    player1: player,
    player2: opponent,
    shuffledDeck,
  }

  describe("gameStateRemap()", () => {
    const clientPlayer = 1
    it("returns remmapped game state", () => {
      expect(gameStateRemap(initialGameState, clientPlayer)).toStrictEqual(
        gameStateRemapped
      )
    })
  })
})
