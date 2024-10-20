//@ts-nocheck:
import { expect } from "jsr:@std/expect"
import { describe, it, test, beforeEach } from "jsr:@std/testing/bdd"
import { spy } from "jsr:@std/testing/mock"
import game from "@/game-functions/index.ts"
import { Card, Player } from "@/game-objects/index.ts"
import {
  nonNumValue,
  suit,
  playerOutput,
  playerID,
  playerServer,
} from "@/enums/index.ts"
import mockDeck from "./__mocks__/deck.ts"
import type { gameState } from "@/types/index.d.ts"

describe("gameFunctions", () => {
  let deck: Card[]
  const createSuitsSpy = spy(game.createSuits)

  beforeEach(() => {
    deck = game.createDeck(createSuitsSpy, Card, nonNumValue, suit)
  })

  describe("createDeck()", () => {
    it("returns a standard deck of cards", () => {
      expect(JSON.stringify(deck)).toStrictEqual(JSON.stringify(mockDeck))
    })
  })

  describe("dealCard()", () => {
    it("returns the top card of the deck", () => {
      const topCard = deck[deck.length - 1]

      expect(game.dealCard(deck)).toEqual(topCard)
    })
  })

  describe("dealHand()", () => {
    it("returns the specified amount of cards for a hand", () => {
      expect(game.dealHand(game.dealCard, deck, 7)).toHaveLength(7)
    })
  })

  describe("initialPairs()", () => {
    const hand = [
      {
        id: "ace_of_clubs",
        value: "ace",
        suit: "clubs",
        img: "./cards/ace_of_clubs.webp",
      },
      {
        id: "ace_of_diamonds",
        value: "ace",
        suit: "diamonds",
        img: "./cards/ace_of_diamonds.webp",
      },
      {
        id: "jack_of_spades",
        value: "jack",
        suit: "spades",
        img: "./cards/jack_of_spades.webp",
      },
    ]

    it("returns pairs from hand", () => {
      const pairs = game.initialPairs(hand)

      expect(pairs).toStrictEqual([
        {
          id: "ace_of_clubs",
          value: "ace",
          suit: "clubs",
          img: "./cards/ace_of_clubs.webp",
        },
        {
          id: "ace_of_diamonds",
          value: "ace",
          suit: "diamonds",
          img: "./cards/ace_of_diamonds.webp",
        },
      ])

      expect(hand).toStrictEqual([
        {
          id: "jack_of_spades",
          value: "jack",
          suit: "spades",
          img: "./cards/jack_of_spades.webp",
        },
      ])
    })
  })

  describe("startGame()", () => {
    const shuffledDeck = <Card[]>[{}]
    const hand = <Card[]>[{}],
      pairs = hand
    const player1 = new Player(hand, pairs)
    const player2 = new Player(hand, pairs)
    const createDeckSpy = spy(game.createDeck)
    const shuffleDeckStub = spy(() => shuffledDeck)
    const dealCardStub = spy(game.dealCard)
    const dealHandStub = spy(() => hand)
    const initialPairsStub = spy(() => pairs)
    const startGame = game.startGame(
      createSuitsSpy,
      createDeckSpy,
      shuffleDeckStub,
      dealCardStub,
      dealHandStub,
      initialPairsStub,
      Card,
      Player,
      nonNumValue,
      suit
    )

    it("returns start game data", () => {
      expect(startGame).toStrictEqual({ shuffledDeck, player1, player2 })
    })
  })

  describe("handlePlayerMatchPairs()", () => {
    const initialGameState = {
      player1: {
        hand: [
          {
            id: 1,
          },
        ],
        pairs: [],
      },
      player2: {
        hand: [
          {
            id: 1,
          },
        ],
      },
      deck: [],
    } as any
    const playerRequest = {
      player: 1,
      card: {
        id: 1,
      },
    } as any
    const playerMatch = {
      card: {
        id: 1,
      },
    } as any

    it("returns transformed game state after player match", () => {
      expect(
        game.handlePlayerMatchPairs(
          playerRequest,
          playerMatch,
          initialGameState,
          playerID,
          playerServer
        )
      ).toStrictEqual({
        player1: {
          hand: [],
          pairs: [
            {
              id: 1,
            },
            {
              id: 1,
            },
          ],
        },
        player2: {
          hand: [],
        },
        deck: [],
      })
    })
  })

  describe("handleDealCard()", () => {
    let initialGameState = <gameState>{}

    beforeEach(() => {
      initialGameState = {
        player1: {
          hand: [
            {
              id: 1,
              value: 1,
            },
            {
              id: 2,
              value: 2,
            },
          ],
          pairs: <Card[]>[],
        },
        shuffledDeck: <Card[]>[{}],
      }
    })

    const playerRequest = {
      player: 1,
      card: {
        id: 1,
        value: 1,
      },
    } as any

    test("match with dealt card", () => {
      const gameState = {
        player1: {
          hand: [
            {
              id: 2,
              value: 2,
            },
          ],
          pairs: [
            {
              id: 1,
              value: 1,
            },
            {
              id: 1,
              value: 1,
            },
          ],
        },
        shuffledDeck: <Card[]>[{}],
      }

      const dealCard = spy(() => ({ id: 1, value: 1 }))

      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput,
          playerID,
          playerServer
        )
      ).toStrictEqual({ gameState, playerOutput: playerOutput.DealtCardMatch })
    })

    test("match with card in hand", () => {
      const gameState = {
        player1: {
          hand: [
            {
              id: 1,
              value: 1,
            },
          ],
          pairs: [
            {
              id: 2,
              value: 2,
            },
            {
              id: 2,
              value: 2,
            },
          ],
        },
        shuffledDeck: <Card[]>[{}],
      }
      const dealCard = spy(() => ({ id: 2, value: 2 }))
      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput,
          playerID,
          playerServer
        )
      ).toStrictEqual({ gameState, playerOutput: playerOutput.HandMatch })
    })

    test("dealt card is added to player's hand", () => {
      const gameState = {
        player1: {
          hand: [
            {
              id: 1,
              value: 1,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: 3,
            },
          ],
          pairs: [],
        },
        shuffledDeck: <Card[]>[{}],
      }

      const dealCard = spy(() => ({ id: 3, value: 3 }))

      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput,
          playerID,
          playerServer
        )
      ).toStrictEqual({ gameState, playerOutput: playerOutput.NoMatch })
    })
  })
})
