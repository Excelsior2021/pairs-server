import type {
  createDeck,
  dealCard,
  dealHand,
  dealHand,
  gameState,
  initialPairs,
  playerMatch,
  playerRequest,
  shuffleDeck,
  startGame,
} from "@/types/index.d.ts"
import type CardType from "@/game-objects/card.ts"
import {
  type nonNumValue as nonNumValueType,
  type playerOutput as playerOutputType,
  playerID,
  playerServer,
} from "@/enums/index.ts"

const createDeck: createDeck = (Card, nonNumValue, suit) => {
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

const shuffleDeck: shuffleDeck = deck => {
  for (const x in deck) {
    const y = Math.floor(Math.random() * parseInt(x))
    const temp = deck[x]
    deck[x] = deck[y]
    deck[y] = temp
  }
  return deck
}

const dealCard: dealCard = (deck: CardType[]) => {
  if (deck.length === 0) return //handle empty deck
  return deck.pop()
}

const dealHand: dealHand = (dealCard, deck, handSize) => {
  const hand: CardType[] = new Array(handSize)
  for (let i = 0; i < handSize; i++) hand[i] = dealCard(deck)!
  return hand
}

const initialPairs: initialPairs = hand => {
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

const startGame: startGame = (
  createDeck,
  shuffleDeck,
  dealCard,
  dealHand,
  initialPairs,
  Card,
  Player,
  nonNumValue,
  suit
) => {
  const shuffledDeck = shuffleDeck(createDeck(Card, nonNumValue, suit))

  const player1Hand = dealHand(dealCard, shuffledDeck, 7)
  const player2Hand = dealHand(dealCard, shuffledDeck, 7)

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
  playerMatch: playerMatch,
  gameState: gameState
) => {
  let player: string, opp: string

  if (playerRequest.player === playerID.player1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (playerRequest.player === playerID.player2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else {
    //implement error handling
    return
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
  gameState: gameState,
  dealCard: dealCard,
  playerOutput: typeof playerOutputType
) => {
  const playerRequestCard = playerRequest.card
  const dealtCard = dealCard(gameState.shuffledDeck)

  let player: string

  if (playerRequest.player === playerID.player1) player = playerServer.player1
  else if (playerRequest.player === playerID.player2)
    player = playerServer.player2
  //implement error handling
  else return

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
