const createDeck = () => {
  const deck = []
  const non_num_cards = ["ace", "jack", "queen", "king"]
  const suits = ["clubs", "diamonds", "hearts", "spades"]

  for (const suit of suits) {
    const id = `ace_of_${suit}`
    deck.push({
      id,
      value: "ace",
      suit,
    })
  }

  for (let value = 2; value < 11; value++) {
    for (const suit of suits) {
      const id = `${value}_of_${suit}`
      deck.push({
        id,
        value,
        suit,
      })
    }
  }

  for (const value of non_num_cards) {
    if (value !== "ace") {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        deck.push({
          id,
          value,
          suit,
        })
      }
    }
  }

  return deck
}

const shuffleDeck = deck => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealCard = deck => deck.pop()

const dealHand = (deck, handSize) => {
  const hand = []
  while (hand.length < handSize) hand.push(dealCard(deck))

  return hand
}

const initialPairs = hand => {
  const pairs = []
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
  const newDeck = createDeck()
  const shuffledDeck = shuffleDeck(newDeck)

  const player1Hand = dealHand(shuffledDeck, 7)
  const player2Hand = dealHand(shuffledDeck, 7)

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
  startGame,
  handlePlayerMatchPairs,
  handleDealtCard,
}
