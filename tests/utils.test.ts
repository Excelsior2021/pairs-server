// @ts-nocheck:
import { expect } from "jsr:@std/expect"
import { describe, it } from "jsr:@std/testing/bdd"
import { gameStateRemap } from "@/utils/index.ts"
import type {
  card,
  player,
  gameState,
  gameStateClient,
} from "@/types/index.d.ts"

describe("utils", () => {
  const player: player = {
    hand: [],
    pairs: [],
  }
  const opponent: player = {
    hand: [],
    pairs: [],
  }
  const shuffledDeck: card[] = []

  const initialGameState: gameStateClient = {
    player,
    opponent,
    shuffledDeck,
  }

  const remappedGameState: gameState = {
    player1: player,
    player2: opponent,
    shuffledDeck,
  }

  describe("gameStateRemap()", () => {
    const clientPlayer = 1
    it("returns remmapped game state", () => {
      expect(gameStateRemap(initialGameState, clientPlayer)).toStrictEqual(
        remappedGameState
      )
    })
  })
})
