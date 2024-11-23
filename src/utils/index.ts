import { playerClient, playerID, playerServer } from "@/enums/index.ts"
import type {
  gameState,
  gameStateRemap as gameStateRemapType,
} from "@/types/index.d.ts"

export const gameStateRemap: gameStateRemapType = (
  gameStateClient,
  clientPlayer
) => {
  const remappedGameState = <gameState>{}
  let player: string
  let opp: string

  if (clientPlayer === playerID.player1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (clientPlayer === playerID.player2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else throw new Error("clientPlayer can not be determined")

  for (const key in gameStateClient) {
    if (key === playerClient.player)
      remappedGameState[player] = gameStateClient[key]
    else if (key === playerClient.opponent)
      remappedGameState[opp] = gameStateClient[key]
    else remappedGameState[key] = gameStateClient[key]
  }

  return remappedGameState
}
