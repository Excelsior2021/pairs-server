import player from "./playerFunctions.js"
import deck from "./deckFunctions.js"
// import { dispatchGameAction } from "../components/MultiplayerSession/MultiplayerSession"

export const initialPairs = hand => {
  let pairs = []
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

export const startGame = () => {
  const newDeck = deck.createDeck()
  const shuffledDeck = deck.shuffleDeck(newDeck)

  const player1Hand = deck.dealHand(shuffledDeck, 7)
  const player2Hand = deck.dealHand(shuffledDeck, 7)

  const player1Pairs = initialPairs(player1Hand)
  const player2Pairs = initialPairs(player2Hand)

  return {
    shuffledDeck,
    player1Hand,
    player2Hand,
    player1Pairs,
    player2Pairs,
  }
}

export const handlePlayerMatchPairs = (
  playerRequest,
  playerMatch,
  gameState
) => {
  if (playerRequest.player === "player1") {
    gameState.player1Pairs.push(playerRequest.card, playerMatch.card)
    gameState.player1Hand = gameState.player1Hand.filter(
      card => card.id !== playerRequest.card.id
    )
    gameState.player2Hand = gameState.player2Hand.filter(
      card => card.id !== playerMatch.card.id
    )
  }

  if (playerRequest.player === "player2") {
    gameState.player2Pairs.push(playerRequest.card, playerMatch.card)
    gameState.player2Hand = gameState.player2Hand.filter(
      card => card.id !== playerRequest.card.id
    )
    gameState.player1Hand = gameState.player1Hand.filter(
      card => card.id !== playerMatch.card.id
    )
  }

  return gameState
}

export const handleDealtCard = (
  dealtCard,
  shuffledDeck,
  playerRequest,
  gameState
) => {
  gameState.shuffledDeck = shuffledDeck
  const playerRequestCard = playerRequest.card

  if (playerRequest.player === "player1") {
    if (playerRequestCard.value === dealtCard.value) {
      gameState.player1Pairs.push(dealtCard, playerRequestCard)
      gameState.player1Hand = gameState.player1Hand.filter(
        card => card.id !== playerRequestCard.id
      )
      return {
        gameState,
        playerOutput: 1,
      }
    }

    for (const card of gameState.player1Hand) {
      if (dealtCard.value === card.value) {
        gameState.player1Pairs.push(dealtCard, card)
        gameState.player1Hand = gameState.player1Hand.filter(
          cardInHand => cardInHand.id !== card.id
        )
        return {
          gameState,
          playerOutput: 2,
        }
      }
    }

    gameState.player1Hand.push(dealtCard)
    return {
      gameState,
      playerOutput: 3,
    }
  }

  if (playerRequest.player === "player2") {
    if (playerRequestCard.value === dealtCard.value) {
      gameState.player2Pairs.push(dealtCard, playerRequestCard)
      gameState.player2Hand = gameState.player2Hand.filter(
        card => card.id !== playerRequestCard.id
      )
      return {
        gameState,
        playerOutput: 1,
      }
    }

    for (const card of gameState.player2Hand) {
      if (dealtCard.value === card.value) {
        gameState.player2Pairs.push(dealtCard, card)
        gameState.player2Hand = gameState.player2Hand.filter(
          cardInHand => cardInHand.id !== card.id
        )
        return {
          gameState,
          playerOutput: 2,
        }
      }
    }

    gameState.player2Hand.push(dealtCard)
    return {
      gameState,
      playerOutput: 3,
    }
  }
}

export default {
  initialPairs,
  startGame,
  handlePlayerMatchPairs,
  handleDealtCard,
}
