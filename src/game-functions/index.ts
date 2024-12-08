import type {
  card,
  dealHand,
  initialPairs,
  shuffleDeck,
  startGame,
  handlePlayerMatchPairs,
  handleDealCard,
} from "@/types/index.d.ts"

const shuffleDeck: shuffleDeck = deck => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealHand: dealHand = (deck, handSize) => {
  const hand = deck.splice(0, handSize)
  return hand
}

const initialPairs: initialPairs = hand => {
  const pairs: card[] = []
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

const startGame: startGame = (deck, shuffleDeck, dealHand, initialPairs) => {
  const shuffledDeck = shuffleDeck(deck)
  const initialHandSize: number = 7

  const player1Hand = dealHand(shuffledDeck, initialHandSize)
  const player2Hand = dealHand(shuffledDeck, initialHandSize)

  const player1Pairs = initialPairs(player1Hand)
  const player2Pairs = initialPairs(player2Hand)

  const player1 = { hand: player1Hand, pairs: player1Pairs }
  const player2 = { hand: player2Hand, pairs: player2Pairs }

  return {
    shuffledDeck,
    player1,
    player2,
  }
}

const handlePlayerMatchPairs: handlePlayerMatchPairs = (
  playerRequest,
  playerMatch,
  gameState
) => {
  gameState.opponent.pairs.push(playerRequest.card, playerMatch.card)

  gameState.opponent.hand = gameState.opponent.hand.filter(
    (card: card) => card.id !== playerRequest.card.id
  )

  gameState.player.hand = gameState.player.hand.filter(
    (card: card) => card.id !== playerMatch.card.id
  )

  return gameState
}

const handleDealCard: handleDealCard = (
  playerRequest,
  gameState,
  playerOutput
) => {
  const playerRequestcard = playerRequest.card
  const dealtcard = gameState.shuffledDeck.pop()!

  if (playerRequestcard.value === dealtcard.value) {
    gameState.player.pairs.push(dealtcard, playerRequestcard)
    gameState.player.hand = gameState.player.hand.filter(
      (card: card) => card.id !== playerRequestcard.id
    )
    return {
      newGameStateClient: gameState,
      playerOutput: playerOutput.DealtcardMatch,
    }
  }

  for (const card of gameState.player.hand) {
    if (dealtcard.value === card.value) {
      gameState.player.pairs.push(dealtcard, card)
      gameState.player.hand = gameState.player.hand.filter(
        (cardInHand: card) => cardInHand.id !== card.id
      )
      return {
        newGameStateClient: gameState,
        playerOutput: playerOutput.HandMatch,
      }
    }
  }

  gameState.player.hand.push(dealtcard)

  return {
    newGameStateClient: gameState,
    playerOutput: playerOutput.NoMatch,
  }
}

export default {
  shuffleDeck,
  dealHand,
  initialPairs,
  startGame,
  handlePlayerMatchPairs,
  handleDealCard,
}
