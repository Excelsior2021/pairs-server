import type { Server, Socket } from "socket.io"
import type {
  playerID as playerIDType,
  playerOutput,
  socketEvent as socketEventType,
} from "@/enums/index.ts"
import type {
  card,
  game,
  sessions,
  playerRequest as playerRequestType,
  playerMatch as playerMatchType,
  gameStateClient,
  gameStateRemap,
} from "@/types/index.d.ts"

type createSession = (
  socket: Socket,
  sessions: sessions,
  sessionID: string,
  playerID: typeof playerIDType,
  socketEvent: typeof socketEventType
) => void

type joinSession = (
  io: Server,
  socket: Socket,
  sessions: sessions,
  sessionID: string,
  deck: card[],
  game: game,
  playerID: typeof playerIDType,
  socketEvent: typeof socketEventType
) => void

type playerRequest = (
  socket: Socket,
  sessionID: string,
  playerRequest: playerRequestType,
  socketEvent: typeof socketEventType
) => void

type playerMatch = (
  io: Server,
  gameStateRemap: gameStateRemap,
  sessionID: string,
  game: game,
  playerRequestObj: playerRequestType,
  playerMatch: playerMatchType,
  gameStateClient: gameStateClient,
  playerOutput: playerOutput,
  socketEvent: typeof socketEventType
) => void

type noPlayerMatch = (
  socket: Socket,
  sessionID: string,
  playerRequest: playerRequestType,
  socketEvent: typeof socketEventType
) => void

type playerDealt = (
  io: Server,
  sessionID: string,
  gameStateRemap: gameStateRemap,
  gameStateClient: gameStateClient,
  game: game,
  playerRequest: playerRequestType,
  playerOutputEnum: typeof playerOutput,
  socketEvent: typeof socketEventType
) => void

type playerResponseMessage = (
  socket: Socket,
  sessionID: string,
  playerOutput: playerOutput,
  socketEvent: typeof socketEventType
) => void

type playerTurnSwitch = (
  socket: Socket,
  sessionID: string,
  playerTurn: playerIDType,
  socketEvent: typeof socketEventType
) => void

type disconnect = (
  socket: Socket,
  sessions: sessions,
  socketEvent: typeof socketEventType
) => void
