"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerOutput = exports.Card = void 0;
class Card {
    constructor(id, value, suit, img) {
        this.id = id;
        this.value = value;
        this.suit = suit;
        this.img = img;
    }
}
exports.Card = Card;
var playerOutput;
(function (playerOutput) {
    playerOutput[playerOutput["DealtCardMatch"] = 1] = "DealtCardMatch";
    playerOutput[playerOutput["HandMatch"] = 2] = "HandMatch";
    playerOutput[playerOutput["NoMatch"] = 3] = "NoMatch";
})(playerOutput = exports.playerOutput || (exports.playerOutput = {}));
