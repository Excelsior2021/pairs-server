import type { Server, Socket } from "socket.io"
import type {
  PlayerID,
  PlayerOutput,
  SocketEvent as SocketEventType,
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
  sessionID: string
) => void

type joinSession = (
  io: Server,
  socket: Socket,
  sessions: sessions,
  sessionID: string,
  deck: card[],
  game: game,
  SocketEvent: typeof SocketEventType
) => void

type playerRequest = (
  socket: Socket,
  sessionID: string,
  playerRequest: playerRequestType,
  SocketEvent: typeof SocketEventType
) => void

type playerMatch = (
  io: Server,
  gameStateRemap: gameStateRemap,
  sessionID: string,
  game: game,
  playerRequestObj: playerRequestType,
  playerMatch: playerMatchType,
  gameStateClient: gameStateClient,
  PlayerOutput: PlayerOutput,
  SocketEvent: typeof SocketEventType
) => void

type noPlayerMatch = (
  socket: Socket,
  sessionID: string,
  playerRequest: playerRequestType,
  SocketEvent: typeof SocketEventType
) => void

type playerDealt = (
  io: Server,
  sessionID: string,
  gameStateRemap: gameStateRemap,
  gameStateClient: gameStateClient,
  game: game,
  playerRequest: playerRequestType,
  playerOutputEnum: typeof PlayerOutput,
  SocketEvent: typeof SocketEventType
) => void

type playerResponseMessage = (
  socket: Socket,
  sessionID: string,
  PlayerOutput: PlayerOutput,
  SocketEvent: typeof SocketEventType
) => void

type playerTurnSwitch = (
  socket: Socket,
  sessionID: string,
  playerTurn: PlayerID,
  SocketEvent: typeof SocketEventType
) => void

type disconnect = (
  socket: Socket,
  sessions: sessions,
  SocketEvent: typeof SocketEventType
) => void
