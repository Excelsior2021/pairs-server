import Card, { nonNumValue, suit } from "./gameObjects/Card"
import Player from "./gameObjects/Player"
import { playerOutput } from "./enums"

import type { gameStateServer, playerRequest } from "../types"

const createDeck = () => {
  const deck: Card[] = new Array(52)
  const non_num_cards = [
    nonNumValue.ace,
    nonNumValue.jack,
    nonNumValue.queen,
    nonNumValue.king,
  ]
  const suits = [suit.clubs, suit.diamonds, suit.hearts, suit.spades]
  let deckIndex = 0

  const createSuits = (value: number | nonNumValue) => {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      const img = `./cards/${id}.png`
      deck[deckIndex] = new Card(id, value, suit, img)
      deckIndex++
    }
  }

  for (const value of non_num_cards) createSuits(value)

  for (let value = 2; value < 11; value++) createSuits(value)

  return deck
}

const shuffleDeck = (deck: Card[]) => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealCard = (deck: Card[]) => deck.pop()

const dealHand = (deck: Card[], handSize: number) => {
  const hand: Card[] = new Array(handSize)
  for (let i = 0; i < handSize; i++) hand[i] = dealCard(deck)!
  return hand
}

const initialPairs = (hand: Card[]) => {
  const pairs: Card[] = []
  hand.forEach(cardX =>
    hand.forEach(cardY => {
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
    hand.forEach(cardH => {
      if (cardP === cardH) {
        hand.splice(hand.indexOf(cardH), 1)
      }
    })
  )
  return pairs
}

const startGame = () => {
  const shuffledDeck = shuffleDeck(createDeck())

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
  if (playerRequest.player === 1) {
    gameState.player1.pairs.push(playerRequest.card, playerMatch.card)
    gameState.player1.hand = gameState.player1.hand.filter(
      card => card.id !== playerRequest.card.id
    )
    gameState.player2.hand = gameState.player2.hand.filter(
      card => card.id !== playerMatch.card.id
    )
  }

  if (playerRequest.player === 2) {
    gameState.player2.pairs.push(playerRequest.card, playerMatch.card)
    gameState.player2.hand = gameState.player2.hand.filter(
      card => card.id !== playerRequest.card.id
    )
    gameState.player1.hand = gameState.player1.hand.filter(
      card => card.id !== playerMatch.card.id
    )
  }

  return gameState
}

const handleDealCard = (
  playerRequest: playerRequest,
  gameState: gameStateServer
) => {
  const playerRequestCard = playerRequest.card
  const dealtCard = dealCard(gameState.shuffledDeck)

  if (playerRequest.player === 1) {
    if (playerRequestCard.value === dealtCard.value) {
      gameState.player1.pairs.push(dealtCard, playerRequestCard)
      gameState.player1.hand = gameState.player1.hand.filter(
        card => card.id !== playerRequestCard.id
      )
      return {
        gameState,
        playerOutput: playerOutput.DealtCardMatch,
      }
    }

    for (const card of gameState.player1.hand) {
      if (dealtCard.value === card.value) {
        gameState.player1.pairs.push(dealtCard, card)
        gameState.player1.hand = gameState.player1.hand.filter(
          cardInHand => cardInHand.id !== card.id
        )
        return {
          gameState,
          playerOutput: playerOutput.HandMatch,
        }
      }
    }

    gameState.player1.hand.push(dealtCard)

    return {
      gameState,
      playerOutput: playerOutput.NoMatch,
    }
  }

  if (playerRequest.player === 2) {
    if (playerRequestCard.value === dealtCard.value) {
      gameState.player2.pairs.push(dealtCard, playerRequestCard)
      gameState.player2.hand = gameState.player2.hand.filter(
        card => card.id !== playerRequestCard.id
      )
      return {
        gameState,
        playerOutput: playerOutput.DealtCardMatch,
      }
    }

    for (const card of gameState.player2.hand) {
      if (dealtCard.value === card.value) {
        gameState.player2.pairs.push(dealtCard, card)
        gameState.player2.hand = gameState.player2.hand.filter(
          cardInHand => cardInHand.id !== card.id
        )
        return {
          gameState,
          playerOutput: playerOutput.HandMatch,
        }
      }
    }

    gameState.player2.hand.push(dealtCard)
    return {
      gameState,
      playerOutput: playerOutput.NoMatch,
    }
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
