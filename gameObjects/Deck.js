"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types/types");
class Deck {
    constructor() {
        this.dealCard = () => this.deck.pop();
        this.deck = this.create();
    }
    create() {
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
    }
    shuffle() {
        for (const x in this.deck) {
            const y = Math.floor(Math.random() * parseInt(x));
            const temp = this.deck[x];
            this.deck[x] = this.deck[y];
            this.deck[y] = temp;
        }
    }
    dealHand(handSize) {
        const hand = new Array(handSize);
        for (let i = 0; i < handSize; i++)
            hand[i] = this.dealCard();
        return hand;
    }
}
exports.default = Deck;
