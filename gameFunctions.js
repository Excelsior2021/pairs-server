"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./gameObjects/Player"));
const types_1 = require("./types/types");
const createDeck = () => {
    const deck = new Array(52);
    const non_num_cards = ["ace", "jack", "queen", "king"];
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    let deckIndex = 0;
    for (const value of non_num_cards) {
        for (const suit of suits) {
            const id = `${value}_of_${suit}`;
            const img = `./cards/${id}.png`;
            deck[deckIndex] = new types_1.Card(id, value, suit, img);
            deckIndex++;
        }
    }
    for (let value = 2; value < 11; value++) {
        for (const suit of suits) {
            const id = `${value}_of_${suit}`;
            const img = `./cards/${id}.png`;
            deck[deckIndex] = new types_1.Card(id, value, suit, img);
            deckIndex++;
        }
    }
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
    hand.forEach(cardX => hand.forEach(cardY => {
        if (cardX.value === cardY.value &&
            cardX.suit !== cardY.suit &&
            !pairs.includes(cardX) &&
            !pairs.includes(cardY))
            pairs.push(cardX, cardY);
    }));
    pairs.forEach(cardP => hand.forEach(cardH => {
        if (cardP === cardH) {
            hand.splice(hand.indexOf(cardH), 1);
        }
    }));
    return pairs;
};
const startGame = () => {
    const shuffledDeck = shuffleDeck(createDeck());
    const player1Hand = dealHand(shuffledDeck, 7);
    const player2Hand = dealHand(shuffledDeck, 7);
    const player1Pairs = initialPairs(player1Hand);
    const player2Pairs = initialPairs(player2Hand);
    const player1 = new Player_1.default(player1Hand, player1Pairs);
    const player2 = new Player_1.default(player2Hand, player2Pairs);
    return {
        shuffledDeck,
        player1,
        player2,
    };
};
const handlePlayerMatchPairs = (playerRequest, playerMatch, gameState) => {
    if (playerRequest.player === 1) {
        gameState.player1.pairs.push(playerRequest.card, playerMatch.card);
        gameState.player1.hand = gameState.player1.hand.filter(card => card.id !== playerRequest.card.id);
        gameState.player2.hand = gameState.player2.hand.filter(card => card.id !== playerMatch.card.id);
    }
    if (playerRequest.player === 2) {
        gameState.player2.pairs.push(playerRequest.card, playerMatch.card);
        gameState.player2.hand = gameState.player2.hand.filter(card => card.id !== playerRequest.card.id);
        gameState.player1.hand = gameState.player1.hand.filter(card => card.id !== playerMatch.card.id);
    }
    return gameState;
};
const handleDealCard = (playerRequest, gameState) => {
    const playerRequestCard = playerRequest.card;
    const dealtCard = dealCard(gameState.shuffledDeck);
    if (playerRequest.player === 1) {
        if (playerRequestCard.value === dealtCard.value) {
            gameState.player1.pairs.push(dealtCard, playerRequestCard);
            gameState.player1.hand = gameState.player1.hand.filter(card => card.id !== playerRequestCard.id);
            return {
                gameState,
                playerOutput: types_1.playerOutput.DealtCardMatch,
            };
        }
        for (const card of gameState.player1.hand) {
            if (dealtCard.value === card.value) {
                gameState.player1.pairs.push(dealtCard, card);
                gameState.player1.hand = gameState.player1.hand.filter(cardInHand => cardInHand.id !== card.id);
                return {
                    gameState,
                    playerOutput: types_1.playerOutput.HandMatch,
                };
            }
        }
        gameState.player1.hand.push(dealtCard);
        return {
            gameState,
            playerOutput: types_1.playerOutput.NoMatch,
        };
    }
    if (playerRequest.player === 2) {
        if (playerRequestCard.value === dealtCard.value) {
            gameState.player2.pairs.push(dealtCard, playerRequestCard);
            gameState.player2.hand = gameState.player2.hand.filter(card => card.id !== playerRequestCard.id);
            return {
                gameState,
                playerOutput: types_1.playerOutput.DealtCardMatch,
            };
        }
        for (const card of gameState.player2.hand) {
            if (dealtCard.value === card.value) {
                gameState.player2.pairs.push(dealtCard, card);
                gameState.player2.hand = gameState.player2.hand.filter(cardInHand => cardInHand.id !== card.id);
                return {
                    gameState,
                    playerOutput: types_1.playerOutput.HandMatch,
                };
            }
        }
        gameState.player2.hand.push(dealtCard);
        return {
            gameState,
            playerOutput: types_1.playerOutput.NoMatch,
        };
    }
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
