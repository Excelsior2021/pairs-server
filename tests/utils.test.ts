import { expect } from "jsr:@std/expect"
import { describe, it } from "jsr:@std/testing/bdd"
import { gameStateRemap } from "@/utils/index.ts"
import type { card, gameStateServer, gameStateClient } from "@/types/index.d.ts"

describe("utils", () => {
  const playerMock = {
    hand: [],
    pairs: [],
  }
  const deck = <card[]>[]

  const initialGameState: gameStateClient = {
    player: playerMock,
    opponent: playerMock,
    deck,
  }

  const remappedGameState: gameStateServer = {
    player1: playerMock,
    player2: playerMock,
    deck,
  }

  describe("gameStateRemap()", () => {
    const playerID = 1
    it("returns remapped game state", () => {
      expect(gameStateRemap(initialGameState, playerID)).toStrictEqual(
        remappedGameState
      )
    })
  })
})
