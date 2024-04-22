"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateRemap = void 0;
const remap = (gameState, remappedGameState, key) => {
    if (key === "player")
        remappedGameState.player1 = gameState[key];
    else if (key === "opponent")
        remappedGameState.player2 = gameState[key];
    else
        remappedGameState[key] = gameState[key];
};
const gameStateRemap = (gameState, clientPlayer) => {
    const remappedGameState = {};
    for (const key in gameState) {
        if (clientPlayer === 1)
            remap(gameState, remappedGameState, key);
        if (clientPlayer === 2)
            remap(gameState, remappedGameState, key);
    }
    return remappedGameState;
};
exports.gameStateRemap = gameStateRemap;
