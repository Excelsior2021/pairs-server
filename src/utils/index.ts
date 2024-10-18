import { playerClient, playerID, playerServer } from "@/enums/index.ts"
import type { gameState } from "@/types/index.d.ts"

export const gameStateRemap = (gameState: gameState, clientPlayer: number) => {
  const remappedGameState = <gameState>{}
  let player: string
  let opp: string

  if (clientPlayer === playerID.player1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (clientPlayer === playerID.player2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else return gameState //implement error handling

  for (const key in gameState) {
    if (key === playerClient.player) remappedGameState[player] = gameState[key]
    else if (key === playerClient.opponent)
      remappedGameState[opp] = gameState[key]
    else remappedGameState[key] = gameState[key]
  }
  return remappedGameState
}
