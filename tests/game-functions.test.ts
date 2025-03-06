import { expect } from "jsr:@std/expect"
import { describe, it, test, beforeEach } from "jsr:@std/testing/bdd"
import { spy } from "jsr:@std/testing/mock"
import game from "@/game-functions/index.ts"
import { PlayerOutput, Suit } from "@/enums/index.ts"
import type {
  card,
  gameStateClient,
  playerMatch,
  playerRequest,
} from "@/types/index.d.ts"

describe("gameFunctions", () => {
  let initialGameStateClient: gameStateClient

  beforeEach(() => {
    initialGameStateClient = {
      player: {
        hand: [],
        pairs: [],
      },
      opponent: {
        hand: [],
        pairs: [],
      },
      deck: [],
    }
  })

  describe("initialPairs()", () => {
    const handMock = [
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
    ] as card[]

    it("returns pairs from handMock", () => {
      const pairs = game.initialPairs(handMock)

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

      expect(handMock).toStrictEqual([
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
    const deckMock = <card[]>[]
    const handMock = <card[]>[],
      pairsMock = handMock
    const player1 = { hand: handMock, pairs: pairsMock }
    const player2 = { hand: handMock, pairs: pairsMock }
    const shuffleDeckStub = spy(() => deckMock)
    const initialPairsStub = spy(() => pairsMock)
    const startGame = game.startGame(
      deckMock,
      shuffleDeckStub,
      initialPairsStub
    )

    it("returns start game data", () => {
      expect(startGame).toStrictEqual({
        player1,
        player2,
        deck: deckMock,
      })
    })
  })

  describe("handlePlayerMatchPairs()", () => {
    const playerRequest = {
      playerID: 1,
      card: {
        id: "id",
      },
    } as playerRequest

    const playerMatch = {
      playerID: 2,
      card: {
        id: "id",
      },
    } as playerMatch

    const outputMock = {
      player: {
        hand: [],
        pairs: [],
      },
      opponent: {
        hand: [],
        pairs: [
          {
            id: "id",
          },
          {
            id: "id",
          },
        ],
      },
      deck: [],
    }

    it("returns new game state after player match", () => {
      expect(
        game.handlePlayerMatchPairs(
          playerRequest,
          playerMatch,
          initialGameStateClient
        )
      ).toStrictEqual(outputMock)
    })
  })

  describe("handleDealCard()", () => {
    const playerRequest = {
      playerID: 1,
      card: {
        id: "1x",
        value: 1,
        suit: Suit.clubs,
        img: "",
      },
    } as playerRequest

    test("match with dealt card", () => {
      initialGameStateClient.player.hand = [
        {
          id: "1x",
          value: 1,
          suit: Suit.clubs,
          img: "",
        },
      ]

      initialGameStateClient.deck = [
        {
          id: "1y",
          value: 1,
          suit: Suit.clubs,
          img: "",
        },
      ]

      const newGameStateClient = {
        ...initialGameStateClient,
        player: {
          hand: [],
          pairs: [
            {
              id: "1y",
              value: 1,
              suit: Suit.clubs,
              img: "",
            },
            {
              id: "1x",
              value: 1,
              suit: Suit.clubs,
              img: "",
            },
          ],
        },
        deck: [],
      }

      expect(
        game.handleDealCard(playerRequest, initialGameStateClient, PlayerOutput)
      ).toStrictEqual({
        newGameStateClient,
        PlayerOutput: PlayerOutput.DealtcardMatch,
      })
    })

    test("match with card in hand", () => {
      initialGameStateClient.player = {
        hand: [
          {
            id: "2x",
            value: 2,
            suit: Suit.clubs,
            img: "",
          },
        ],
        pairs: [],
      }

      initialGameStateClient.deck = [
        {
          id: "2y",
          value: 2,
          suit: Suit.clubs,
          img: "",
        },
      ]

      const newGameStateClient = {
        ...initialGameStateClient,
        player: {
          hand: [],
          pairs: [
            {
              id: "2y",
              value: 2,
              suit: Suit.clubs,
              img: "",
            },
            {
              id: "2x",
              value: 2,
              suit: Suit.clubs,
              img: "",
            },
          ],
        },

        deck: [],
      }

      expect(
        game.handleDealCard(playerRequest, initialGameStateClient, PlayerOutput)
      ).toStrictEqual({
        newGameStateClient,
        PlayerOutput: PlayerOutput.HandMatch,
      })
    })

    test("dealt card is added to player's hand", () => {
      initialGameStateClient.player.hand = [
        {
          id: "1x",
          value: 1,
          suit: Suit.clubs,
          img: "",
        },
      ]

      initialGameStateClient.deck = [
        {
          id: "2x",
          value: 2,
          suit: Suit.clubs,
          img: "",
        },
      ]

      const newGameStateClient = {
        ...initialGameStateClient,
        player: {
          hand: [
            {
              id: "1x",
              value: 1,
              suit: Suit.clubs,
              img: "",
            },
            {
              id: "2x",
              value: 2,
              suit: Suit.clubs,
              img: "",
            },
          ],
          pairs: [],
        },
        deck: [],
      }

      expect(
        game.handleDealCard(playerRequest, initialGameStateClient, PlayerOutput)
      ).toStrictEqual({
        newGameStateClient,
        PlayerOutput: PlayerOutput.NoMatch,
      })
    })
  })
})
