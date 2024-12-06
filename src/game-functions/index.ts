import type {
  card,
  dealcard,
  dealHand,
  initialPairs,
  shuffleDeck,
  startGame,
  handlePlayerMatchPairs,
  handleDealcard,
} from "@/types/index.d.ts"
import deckObj from "@/deck/index.ts"

const shuffleDeck: shuffleDeck = deck => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealcard: dealcard = (deck: card[]) => {
  if (deck.length === 0) return //handle
  return deck.pop()
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

const startGame: startGame = (shuffleDeck, dealHand, initialPairs) => {
  const deck = structuredClone(deckObj)
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
  gameState,
  playerID,
  playerServer
) => {
  let player: string, opp: string

  if (playerRequest.clientPlayer === playerID.player1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (playerRequest.clientPlayer === playerID.player2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else throw new Error("clientPlayer can not be determined")

  gameState[player].pairs.push(playerRequest.card, playerMatch.card)

  gameState[player].hand = gameState[player].hand.filter(
    (card: card) => card.id !== playerRequest.card.id
  )

  gameState[opp].hand = gameState[opp].hand.filter(
    (card: card) => card.id !== playerMatch.card.id
  )

  return gameState
}

const handleDealcard: handleDealcard = (
  playerRequest,
  gameState,
  dealcard,
  playerOutput,
  playerID,
  playerServer
) => {
  if (gameState.shuffledDeck.length === 0) return

  const playerRequestcard = playerRequest.card
  const dealtcard = dealcard(gameState.shuffledDeck)!

  let player: string

  if (playerRequest.clientPlayer === playerID.player1)
    player = playerServer.player1
  else if (playerRequest.clientPlayer === playerID.player2)
    player = playerServer.player2
  //implement error handling
  else return

  if (playerRequestcard.value === dealtcard.value) {
    gameState[player].pairs.push(dealtcard, playerRequestcard)
    gameState[player].hand = gameState[player].hand.filter(
      (card: card) => card.id !== playerRequestcard.id
    )
    return {
      gameState,
      playerOutput: playerOutput.DealtcardMatch,
    }
  }

  for (const card of gameState[player].hand) {
    if (dealtcard.value === card.value) {
      gameState[player].pairs.push(dealtcard, card)
      gameState[player].hand = gameState[player].hand.filter(
        (cardInHand: card) => cardInHand.id !== card.id
      )
      return {
        gameState,
        playerOutput: playerOutput.HandMatch,
      }
    }
  }

  gameState[player].hand.push(dealtcard)

  return {
    gameState,
    playerOutput: playerOutput.NoMatch,
  }
}

export default {
  shuffleDeck,
  dealcard,
  dealHand,
  initialPairs,
  startGame,
  handlePlayerMatchPairs,
  handleDealcard,
}
