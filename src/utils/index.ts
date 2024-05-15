import type { gameStateClient } from "../../types"

export const remap = (
  gameState: gameStateClient,
  remappedGameState,
  player: string,
  opponent: string
) => {
  for (const key in gameState) {
    if (key === "player") remappedGameState[player] = gameState[key]
    else if (key === "opponent") remappedGameState[opponent] = gameState[key]
    else remappedGameState[key] = gameState[key]
  }
  return remappedGameState
}

export const gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: number
) => {
  const remappedGameState: any = {}
  if (clientPlayer === 1)
    return remap(gameState, remappedGameState, "player1", "player2")
  if (clientPlayer === 2)
    return remap(gameState, remappedGameState, "player2", "player1")
}
