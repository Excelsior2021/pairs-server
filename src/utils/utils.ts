import { gameStateClient } from "../types/types"

const remap = (gameState: gameStateClient, remappedGameState, key: string) => {
  if (key === "player") remappedGameState.player1 = gameState[key]
  else if (key === "opponent") remappedGameState.player2 = gameState[key]
  else remappedGameState[key] = gameState[key]
}

export const gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: number
) => {
  const remappedGameState: any = {}
  for (const key in gameState) {
    if (clientPlayer === 1) remap(gameState, remappedGameState, key)
    if (clientPlayer === 2) remap(gameState, remappedGameState, key)
  }
  return remappedGameState
}
