"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDeck = (Card, nonNumValue, suit) => {
    const deck = new Array(52);
    const non_num_cards = [
        nonNumValue.ace,
        nonNumValue.jack,
        nonNumValue.queen,
        nonNumValue.king,
    ];
    const suits = [suit.clubs, suit.diamonds, suit.hearts, suit.spades];
    let deckIndex = 0;
    const createSuits = (value) => {
        for (const suit of suits) {
            const id = `${value}_of_${suit}`;
            const img = `./cards/${id}.webp`;
            deck[deckIndex] = new Card(id, value, suit, img);
            deckIndex++;
        }
    };
    for (const value of non_num_cards)
        createSuits(value);
    for (let value = 2; value < 11; value++)
        createSuits(value);
    return deck;
};
const shuffleDeck = (deck) => {
    for (const x in deck) {
        const y = Math.floor(Math.random() * parseInt(x));
        const temp = deck[x];
        deck[x] = deck[y];
        deck[y] = temp;
    }
    return deck;
};
const dealCard = (deck) => deck.pop();
const dealHand = (deck, handSize) => {
    const hand = new Array(handSize);
    for (let i = 0; i < handSize; i++)
        hand[i] = dealCard(deck);
    return hand;
};
const initialPairs = (hand) => {
    const pairs = [];
    hand.forEach(cardX => hand.some(cardY => {
        if (cardX.value === cardY.value &&
            cardX.suit !== cardY.suit &&
            !pairs.includes(cardX) &&
            !pairs.includes(cardY))
            pairs.push(cardX, cardY);
    }));
    pairs.forEach(cardP => hand.some(cardH => {
        if (cardP === cardH)
            hand.splice(hand.indexOf(cardH), 1);
    }));
    return pairs;
};
const startGame = (createDeck, shuffleDeck, dealHand, initialPairs, Card, Player, nonNumValue, suit) => {
    const shuffledDeck = shuffleDeck(createDeck(Card, nonNumValue, suit));
    const player1Hand = dealHand(shuffledDeck, 7);
    const player2Hand = dealHand(shuffledDeck, 7);
    const player1Pairs = initialPairs(player1Hand);
    const player2Pairs = initialPairs(player2Hand);
    const player1 = new Player(player1Hand, player1Pairs);
    const player2 = new Player(player2Hand, player2Pairs);
    return {
        shuffledDeck,
        player1,
        player2,
    };
};
const handlePlayerMatchPairs = (playerRequest, playerMatch, gameState) => {
    let player, opp;
    if (playerRequest.player === 1) {
        player = "player1";
        opp = "player2";
    }
    if (playerRequest.player === 2) {
        player = "player2";
        opp = "player1";
    }
    gameState[player].pairs.push(playerRequest.card, playerMatch.card);
    gameState[player].hand = gameState[player].hand.filter((card) => card.id !== playerRequest.card.id);
    gameState[opp].hand = gameState[opp].hand.filter((card) => card.id !== playerMatch.card.id);
    return gameState;
};
const handleDealCard = (playerRequest, gameState, dealCard, playerOutput) => {
    const playerRequestCard = playerRequest.card;
    const dealtCard = dealCard(gameState.shuffledDeck);
    let player;
    if (playerRequest.player === 1)
        player = "player1";
    if (playerRequest.player === 2)
        player = "player2";
    if (playerRequestCard.value === dealtCard.value) {
        gameState[player].pairs.push(dealtCard, playerRequestCard);
        gameState[player].hand = gameState[player].hand.filter((card) => card.id !== playerRequestCard.id);
        return {
            gameState,
            playerOutput: playerOutput.DealtCardMatch,
        };
    }
    for (const card of gameState[player].hand) {
        if (dealtCard.value === card.value) {
            gameState[player].pairs.push(dealtCard, card);
            gameState[player].hand = gameState[player].hand.filter((cardInHand) => cardInHand.id !== card.id);
            return {
                gameState,
                playerOutput: playerOutput.HandMatch,
            };
        }
    }
    gameState[player].hand.push(dealtCard);
    return {
        gameState,
        playerOutput: playerOutput.NoMatch,
    };
};
exports.default = {
    createDeck,
    shuffleDeck,
    dealCard,
    dealHand,
    initialPairs,
    startGame,
    handlePlayerMatchPairs,
    handleDealCard,
};
