import type { gameStateClient } from "@/types/index.d.ts"

export const gameStateRemap = (
  gameState: gameStateClient,
  clientPlayer: number
) => {
  const remappedGameState: any = {}
  let player: string
  let opp: string

  if (clientPlayer === 1) {
    player = "player1"
    opp = "player2"
  }
  if (clientPlayer === 2) {
    player = "player2"
    opp = "player1"
  }

  for (const key in gameState) {
    if (key === "player") remappedGameState[player] = gameState[key]
    else if (key === "opponent") remappedGameState[opp] = gameState[key]
    else remappedGameState[key] = gameState[key]
  }
  return remappedGameState
}
