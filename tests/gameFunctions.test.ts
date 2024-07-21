import { describe, expect, test, it, beforeEach, vi } from "vitest"
import game from "../src/gameFunctions"
import Card, { nonNumValue, suit } from "../src/gameObjects/Card"
import mockDeck from "./__mocks__/deck"
import Player from "../src/gameObjects/Player"
import { playerOutput } from "../src/enums"

describe("gameFunctions", () => {
  let deck: Card[]
  beforeEach(() => {
    deck = game.createDeck(Card, nonNumValue, suit)
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
      expect(game.dealHand(deck, 7)).toHaveLength(7)
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
    const shuffledDeck = [{}]
    const hand = [{}] as any,
      pairs = hand
    const player1 = new Player(hand, pairs)
    const player2 = new Player(hand, pairs)
    const createDeck = vi.fn()
    const shuffleDeck = vi.fn(() => shuffledDeck)
    const dealHand = vi.fn(() => hand)
    const initialPairs = vi.fn(() => pairs)
    const startGame = game.startGame(
      createDeck,
      shuffleDeck,
      dealHand,
      initialPairs,
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
          initialGameState
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
    let initialGameState: any

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
          pairs: [],
        },
      } as any
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
      }

      const dealCard = vi.fn(() => ({ id: 1, value: 1 }))

      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput
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
      }
      const dealCard = vi.fn(() => ({ id: 2, value: 2 }))
      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput
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
      }

      const dealCard = vi.fn(() => ({ id: 3, value: 3 }))

      expect(
        game.handleDealCard(
          playerRequest,
          initialGameState,
          dealCard,
          playerOutput
        )
      ).toStrictEqual({ gameState, playerOutput: playerOutput.NoMatch })
    })
  })
})
