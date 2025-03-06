import { Server } from "socket.io"
import eventCb from "@/event-cb/index.ts"
import deck from "@/deck/index.ts"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import {
  PlayerOutput as playerOutputEnum,
  PlayerID,
  SocketEvent,
  PlayerOutput,
} from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  playerRequest,
  playerMatch,
  sessions,
  gameStateClient,
} from "@/types/index.d.ts"

const port = Deno.env.get("PORT") || 8080

//create  server
const io = new Server(Number(port), {
  cors: {
    origin: Deno.env.get("CLIENT_DOMAIN"),
  },
})
console.log(`listening on port: ${port}`)

//in-memory storage of sessions
const sessions: sessions = {}

io.on(SocketEvent.connectiton, socket => {
  console.log(`socket ${socket.id} connected`)

  //creates a session for socket
  socket.on(SocketEvent.create_session, (sessionID: string) =>
    eventCb.createSession(socket, sessions, sessionID)
  )

  //socket joins existing session and game starts
  socket.on(SocketEvent.join_session, (sessionID: string) =>
    eventCb.joinSession(
      io,
      socket,
      sessions,
      sessionID,
      structuredClone(deck),
      game,
      SocketEvent
    )
  )

  //card request from player to opponent
  socket.on(
    SocketEvent.player_request,
    (playerRequest: playerRequest, sessionID: string) =>
      eventCb.playerRequest(socket, sessionID, playerRequest, SocketEvent)
  )

  //player has a match with opponent
  socket.on(
    SocketEvent.player_match,
    (
      playerRequest: playerRequest,
      playerMatch: playerMatch,
      gameStateClient: gameStateClient,
      PlayerOutput: number,
      sessionID: string
    ) =>
      eventCb.playerMatch(
        io,
        gameStateRemap,
        sessionID,
        game,
        playerRequest,
        playerMatch,
        gameStateClient,
        PlayerOutput,
        SocketEvent
      )
  )

  //player does not have a match with opponent
  socket.on(
    SocketEvent.no_player_match,
    (playerRequest: playerRequest, sessionID: string) =>
      eventCb.noPlayerMatch(socket, sessionID, playerRequest, SocketEvent)
  )

  //player deals card from the deck
  socket.on(
    SocketEvent.player_dealt,
    (
      playerRequest: playerRequest,
      gameStateClient: gameStateClient,
      sessionID: string
    ) =>
      eventCb.playerDealt(
        io,
        sessionID,
        gameStateRemap,
        gameStateClient,
        game,
        playerRequest,
        playerOutputEnum,
        SocketEvent
      )
  )

  socket.on(
    SocketEvent.player_response_message,
    (PlayerOutput: PlayerOutput, sessionID: string) =>
      eventCb.playerResponseMessage(
        socket,
        sessionID,
        PlayerOutput,
        SocketEvent
      )
  )

  socket.on(
    SocketEvent.player_turn_switch,
    (sessionID: string, playerTurn: PlayerID) =>
      eventCb.playerTurnSwitch(socket, sessionID, playerTurn, SocketEvent)
  )

  //remove socket from playerSocketsIDs and delete session
  socket.on(SocketEvent.disconnect, () =>
    eventCb.disconnect(socket, sessions, SocketEvent)
  )
})
