"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateRemap = void 0;
const gameStateRemap = (gameState, clientPlayer) => {
    const remappedGameState = {};
    let player;
    let opp;
    if (clientPlayer === 1) {
        player = "player1";
        opp = "player2";
    }
    if (clientPlayer === 2) {
        player = "player2";
        opp = "player1";
    }
    for (const key in gameState) {
        if (key === "player")
            remappedGameState[player] = gameState[key];
        else if (key === "opponent")
            remappedGameState[opp] = gameState[key];
        else
            remappedGameState[key] = gameState[key];
    }
    return remappedGameState;
};
exports.gameStateRemap = gameStateRemap;
