import { playerClient, PlayerID, playerServer } from "@/enums/index.ts"
import type {
  gameStateServer,
  gameStateRemap as gameStateRemapType,
} from "@/types/index.d.ts"

export const gameStateRemap: gameStateRemapType = (
  gameStateClient,
  playerID
) => {
  const remappedGameState = <gameStateServer>{}
  let player: playerServer
  let opp: playerServer

  if (playerID === PlayerID.P1) {
    player = playerServer.player1
    opp = playerServer.player2
  } else if (playerID === PlayerID.P2) {
    player = playerServer.player2
    opp = playerServer.player1
  } else throw new Error("playerID can not be determined")

  remappedGameState[player] = gameStateClient[playerClient.player]
  remappedGameState[opp] = gameStateClient[playerClient.opponent]
  remappedGameState.deck = gameStateClient.deck

  return remappedGameState
}
