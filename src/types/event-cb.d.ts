import type { Server, Socket } from "socket.io"
import type {
  nonNumValue as nonNumValueType,
  playerID as playerIDType,
  playerOutput,
  playerServer as playerServerType,
  socketEvent as socketEventType,
  suit as suitType,
} from "@/enums/index.ts"
import type {
  game,
  session,
  playerRequest as playerRequestObj,
  playerMatch as playerMatchType,
  gameStateClient,
  gameStateRemap,
} from "@/types/index.d.ts"

type createSession = (
  socket: Socket,
  sessions: session,
  sessionID: string,
  playerID: typeof playerIDType,
  socketEvent: typeof socketEventType
) => void

type joinSession = (
  io: Server,
  socket: Socket,
  sessions: session,
  sessionID: string,
  game: game,
  playerID: typeof playerIDType,
  nonNumValue: typeof nonNumValueType,
  suit: typeof suitType,
  socketEvent: typeof socketEventType
) => void

type playerRequest = (
  socket: Socket,
  sessionID: string,
  playerRequestObj: playerRequestObj,
  socketEvent: typeof socketEventType
) => void

type playerMatch = (
  io: Server,
  gameStateRemap: gameStateRemap,
  sessionID: string,
  game: game,
  playerRequestObj: playerRequestObj,
  playerMatch: playerMatchType,
  gameStateClient: gameStateClient,
  playerOutput: playerOutput,
  playerID: typeof playerIDType,
  playerServer: typeof playerServerType,
  socketEvent: typeof socketEventType
) => void
