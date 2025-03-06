import { PlayerClient, PlayerID, PlayerServer } from "@/enums/index.ts"
import type {
  gameStateServer,
  gameStateRemap as gameStateRemapType,
} from "@/types/index.d.ts"

export const gameStateRemap: gameStateRemapType = (
  gameStateClient,
  playerID
) => {
  const remappedGameState = <gameStateServer>{}
  let player: PlayerServer
  let opp: PlayerServer

  if (playerID === PlayerID.P1) {
    player = PlayerServer.player1
    opp = PlayerServer.player2
  } else if (playerID === PlayerID.P2) {
    player = PlayerServer.player2
    opp = PlayerServer.player1
  } else throw new Error("playerID can not be determined")

  remappedGameState[player] = gameStateClient[PlayerClient.player]
  remappedGameState[opp] = gameStateClient[PlayerClient.opponent]
  remappedGameState.deck = gameStateClient.deck

  return remappedGameState
}
