"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStateRemap = exports.remap = void 0;
const remap = (gameState, remappedGameState, player, opponent) => {
    for (const key in gameState) {
        if (key === "player")
            remappedGameState[player] = gameState[key];
        else if (key === "opponent")
            remappedGameState[opponent] = gameState[key];
        else
            remappedGameState[key] = gameState[key];
    }
    return remappedGameState;
};
exports.remap = remap;
const gameStateRemap = (gameState, clientPlayer) => {
    const remappedGameState = {};
    if (clientPlayer === 1)
        return (0, exports.remap)(gameState, remappedGameState, "player1", "player2");
    if (clientPlayer === 2)
        return (0, exports.remap)(gameState, remappedGameState, "player2", "player1");
};
exports.gameStateRemap = gameStateRemap;
