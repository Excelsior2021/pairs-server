"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateRemap = void 0;
const gameStateRemap = (gameState, clientPlayer) => {
    const remappedGameState = {};
    for (let key in gameState) {
        if (clientPlayer === 1) {
            if (key === "player")
                remappedGameState.player1 = gameState[key];
            else if (key === "opponent")
                remappedGameState.player2 = gameState[key];
            else
                remappedGameState[key] = gameState[key];
        }
        if (clientPlayer === 2) {
            if (key === "player")
                remappedGameState.player2 = gameState[key];
            else if (key === "opponent")
                remappedGameState.player1 = gameState[key];
            else
                remappedGameState[key] = gameState[key];
        }
    }
    return remappedGameState;
};
exports.gameStateRemap = gameStateRemap;
