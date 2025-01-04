import { Server } from "socket.io"
import eventCb from "@/event-cb/index.ts"
import deck from "@/deck/index.ts"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import {
  playerOutput as playerOutputEnum,
  PlayerID,
  socketEvent,
  playerOutput,
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

io.on(socketEvent.connectiton, socket => {
  console.log(`socket ${socket.id} connected`)

  //creates a session for socket
  socket.on(socketEvent.create_session, (sessionID: string) =>
    eventCb.createSession(socket, sessions, sessionID)
  )

  //socket joins existing session and game starts
  socket.on(socketEvent.join_session, (sessionID: string) =>
    eventCb.joinSession(
      io,
      socket,
      sessions,
      sessionID,
      [...deck],
      game,
      socketEvent
    )
  )

  //card request from player to opponent
  socket.on(
    socketEvent.player_request,
    (playerRequest: playerRequest, sessionID: string) =>
      eventCb.playerRequest(socket, sessionID, playerRequest, socketEvent)
  )

  //player has a match with opponent
  socket.on(
    socketEvent.player_match,
    (
      playerRequest: playerRequest,
      playerMatch: playerMatch,
      gameStateClient: gameStateClient,
      playerOutput: number,
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
        playerOutput,
        socketEvent
      )
  )

  //player does not have a match with opponent
  socket.on(
    socketEvent.no_player_match,
    (playerRequest: playerRequest, sessionID: string) =>
      eventCb.noPlayerMatch(socket, sessionID, playerRequest, socketEvent)
  )

  //player deals card from the deck
  socket.on(
    socketEvent.player_dealt,
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
        socketEvent
      )
  )

  socket.on(
    socketEvent.player_response_message,
    (playerOutput: playerOutput, sessionID: string) =>
      eventCb.playerResponseMessage(
        socket,
        sessionID,
        playerOutput,
        socketEvent
      )
  )

  socket.on(
    socketEvent.player_turn_switch,
    (sessionID: string, playerTurn: PlayerID) =>
      eventCb.playerTurnSwitch(socket, sessionID, playerTurn, socketEvent)
  )

  //remove socket from playerSocketsIDs and delete session
  socket.on(socketEvent.disconnect, () =>
    eventCb.disconnect(socket, sessions, socketEvent)
  )
})
