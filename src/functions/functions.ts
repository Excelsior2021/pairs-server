import { gameStateClient } from "../types/types"

export const gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: number
) => {
  const remappedGameState: any = {}
  for (let key in gameState) {
    if (clientPlayer === 1) {
      if (key === "player") remappedGameState.player1 = gameState[key]
      else if (key === "opponent") remappedGameState.player2 = gameState[key]
      else remappedGameState[key] = gameState[key]
    }
    if (clientPlayer === 2) {
      if (key === "player") remappedGameState.player2 = gameState[key]
      else if (key === "opponent") remappedGameState.player1 = gameState[key]
      else remappedGameState[key] = gameState[key]
    }
  }
  return remappedGameState
}
