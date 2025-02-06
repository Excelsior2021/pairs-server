import type {
  card,
  initialPairs,
  shuffleDeck,
  startGame,
  handlePlayerMatchPairs,
  handleDealCard,
  isGameOver,
} from "@/types/index.d.ts"

const shuffleDeck: shuffleDeck = deck => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
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

const startGame: startGame = (deck, shuffleDeck, initialPairs) => {
  shuffleDeck(deck)
  const initialHandSize: number = 7 //declare as function parameter (also on client)

  const player1Hand = deck.splice(0, initialHandSize)
  const player2Hand = deck.splice(0, initialHandSize)

  const player1Pairs = initialPairs(player1Hand)
  const player2Pairs = initialPairs(player2Hand)

  const player1 = { hand: player1Hand, pairs: player1Pairs }
  const player2 = { hand: player2Hand, pairs: player2Pairs }

  return {
    player1,
    player2,
    deck,
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
  const playerRequestCard = playerRequest.card
  const dealtCard = gameState.deck.pop()!

  if (playerRequestCard.value === dealtCard.value) {
    gameState.player.pairs.push(dealtCard, playerRequestCard)
    gameState.player.hand = gameState.player.hand.filter(
      (card: card) => card.id !== playerRequestCard.id
    )
    return {
      newGameStateClient: gameState,
      playerOutput: playerOutput.DealtcardMatch,
    }
  }

  for (const card of gameState.player.hand) {
    if (dealtCard.value === card.value) {
      gameState.player.pairs.push(dealtCard, card)
      gameState.player.hand = gameState.player.hand.filter(
        (cardInHand: card) => cardInHand.id !== card.id
      )
      return {
        newGameStateClient: gameState,
        playerOutput: playerOutput.HandMatch,
      }
    }
  }

  gameState.player.hand.push(dealtCard)

  return {
    newGameStateClient: gameState,
    playerOutput: playerOutput.NoMatch,
  }
}

const isGameOver: isGameOver = gameState => {
  const { player, opponent, deck } = gameState

  if (
    player.hand.length === 0 ||
    opponent.hand.length === 0 ||
    deck.length === 0
  )
    return true
  return false
}

export default {
  shuffleDeck,
  initialPairs,
  startGame,
  handlePlayerMatchPairs,
  handleDealCard,
  isGameOver,
}
