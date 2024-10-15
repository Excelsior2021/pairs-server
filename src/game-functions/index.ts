import type { playerOutput as playerOutputType } from "@/enums/index.ts"
import type { gameStateServer, playerRequest } from "@/types/index.d.ts"
import type CardType from "@/game-objects/card.ts"
import type {
  nonNumValue as nonNumValueType,
  suit as suitType,
} from "@/game-objects/card.ts"
import type PlayerType from "@/game-objects/player.ts"

const createDeck = (
  Card: typeof CardType,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => {
  const deck: CardType[] = new Array(52)
  const non_num_cards = [
    nonNumValue.ace,
    nonNumValue.jack,
    nonNumValue.queen,
    nonNumValue.king,
  ]
  const suits = [suit.clubs, suit.diamonds, suit.hearts, suit.spades]
  let deckIndex = 0

  const createSuits = (value: number | nonNumValueType) => {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      const img = `./cards/${id}.webp`
      deck[deckIndex] = new Card(id, value, suit, img)
      deckIndex++
    }
  }

  for (const value of non_num_cards) createSuits(value)

  for (let value = 2; value < 11; value++) createSuits(value)

  return deck
}

const shuffleDeck = (deck: CardType[]) => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealCard = (deck: CardType[]) => deck.pop()

const dealHand = (deck: CardType[], handSize: number) => {
  const hand: CardType[] = new Array(handSize)
  for (let i = 0; i < handSize; i++) hand[i] = dealCard(deck)!
  return hand
}

const initialPairs = (hand: CardType[]) => {
  const pairs: CardType[] = []
  hand.forEach(cardX =>
    hand.some(cardY => {
      if (
        cardX.value === cardY.value &&
        cardX.suit !== cardY.suit &&
        !pairs.includes(cardX) &&
        !pairs.includes(cardY)
      )
        pairs.push(cardX, cardY)
    })
  )

  pairs.forEach(cardP =>
    hand.some(cardH => {
      if (cardP === cardH) hand.splice(hand.indexOf(cardH), 1)
    })
  )
  return pairs
}

const startGame = (
  createDeck,
  shuffleDeck,
  dealHand,
  initialPairs,
  Card: typeof CardType,
  Player: typeof PlayerType,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType
) => {
  const shuffledDeck = shuffleDeck(createDeck(Card, nonNumValue, suit))

  const player1Hand = dealHand(shuffledDeck, 7)
  const player2Hand = dealHand(shuffledDeck, 7)

  const player1Pairs = initialPairs(player1Hand)
  const player2Pairs = initialPairs(player2Hand)

  const player1 = new Player(player1Hand, player1Pairs)
  const player2 = new Player(player2Hand, player2Pairs)

  return {
    shuffledDeck,
    player1,
    player2,
  }
}

const handlePlayerMatchPairs = (
  playerRequest: playerRequest,
  playerMatch: playerRequest,
  gameState: gameStateServer
) => {
  let player: string, opp: string

  if (playerRequest.player === 1) {
    player = "player1"
    opp = "player2"
  }

  if (playerRequest.player === 2) {
    player = "player2"
    opp = "player1"
  }

  gameState[player].pairs.push(playerRequest.card, playerMatch.card)

  gameState[player].hand = gameState[player].hand.filter(
    (card: CardType) => card.id !== playerRequest.card.id
  )

  gameState[opp].hand = gameState[opp].hand.filter(
    (card: CardType) => card.id !== playerMatch.card.id
  )

  return gameState
}

const handleDealCard = (
  playerRequest: playerRequest,
  gameState: gameStateServer,
  dealCard,
  playerOutput: typeof playerOutputType
) => {
  const playerRequestCard = playerRequest.card
  const dealtCard = dealCard(gameState.shuffledDeck)

  let player: string

  if (playerRequest.player === 1) player = "player1"
  if (playerRequest.player === 2) player = "player2"

  if (playerRequestCard.value === dealtCard.value) {
    gameState[player].pairs.push(dealtCard, playerRequestCard)
    gameState[player].hand = gameState[player].hand.filter(
      (card: CardType) => card.id !== playerRequestCard.id
    )
    return {
      gameState,
      playerOutput: playerOutput.DealtCardMatch,
    }
  }

  for (const card of gameState[player].hand) {
    if (dealtCard.value === card.value) {
      gameState[player].pairs.push(dealtCard, card)
      gameState[player].hand = gameState[player].hand.filter(
        (cardInHand: CardType) => cardInHand.id !== card.id
      )
      return {
        gameState,
        playerOutput: playerOutput.HandMatch,
      }
    }
  }

  gameState[player].hand.push(dealtCard)

  return {
    gameState,
    playerOutput: playerOutput.NoMatch,
  }
}

export default {
  createDeck,
  shuffleDeck,
  dealCard,
  dealHand,
  initialPairs,
  startGame,
  handlePlayerMatchPairs,
  handleDealCard,
}
