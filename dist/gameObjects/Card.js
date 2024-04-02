"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonNumValue = exports.suit = void 0;
var suit;
(function (suit) {
    suit["clubs"] = "clubs";
    suit["diamonds"] = "diamonds";
    suit["hearts"] = "hearts";
    suit["spades"] = "spades";
})(suit || (exports.suit = suit = {}));
var nonNumValue;
(function (nonNumValue) {
    nonNumValue["ace"] = "ace";
    nonNumValue["jack"] = "jack";
    nonNumValue["queen"] = "queen";
    nonNumValue["king"] = "king";
})(nonNumValue || (exports.nonNumValue = nonNumValue = {}));
class Card {
    constructor(id, value, suit) {
        this.id = id;
        this.value = value;
        this.suit = suit;
    }
}
exports.default = Card;
