import { playerClient, playerID, playerServer } from "@/enums/index.ts"
import type {
  gameStateServer,
  gameStateRemap as gameStateRemapType,
} from "@/types/index.d.ts"

export const gameStateRemap: gameStateRemapType = (
  gameStateClient,
  clientPlayer
) => {
  const remappedGameState = <gameStateServer>{}
  let player: playerServer
  let opp: playerServer

  if (clientPlayer === playerID.player1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (clientPlayer === playerID.player2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else throw new Error("clientPlayer can not be determined")

  remappedGameState[player] = gameStateClient[playerClient.player]
  remappedGameState[opp] = gameStateClient[playerClient.opponent]
  remappedGameState.shuffledDeck = gameStateClient.shuffledDeck

  return remappedGameState
}
