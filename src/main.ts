import { Server } from "socket.io"
import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import eventCb from "@/event-cb/index.ts"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import {
  nonNumValue,
  suit,
  playerOutput as playerOutputEnum,
  playerID,
  playerServer,
  socketEvent,
} from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  playerRequest,
  gameState,
  playerMatch,
  session,
  gameStateClient,
} from "@/types/index.d.ts"

const port = Deno.env.get("PORT") || 8080

//create  server
const io = new Server({
  cors: {
    origin: Deno.env.get("CLIENT_DOMAIN"),
  },
})

//in-memory storage of sessions
const sessions: session = {}

io.on(socketEvent.connectiton, socket => {
  console.log(`socket ${socket.id} connected`)

  //creates a session for socket
  socket.on(socketEvent.create_session, (sessionID: string) =>
    eventCb.createSession(socket, sessions, sessionID, playerID, socketEvent)
  )

  //socket joins existing session and game starts
  socket.on(socketEvent.join_session, (sessionID: string) =>
    eventCb.joinSession(
      io,
      socket,
      sessions,
      sessionID,
      game,
      playerID,
      nonNumValue,
      suit,
      socketEvent
    )
  )

  //card request from one player to the other
  socket.on(
    socketEvent.player_request,
    (playerRequestObj: playerRequest, sessionID: string) =>
      eventCb.playerRequest(socket, sessionID, playerRequestObj, socketEvent)
  )

  socket.on(
    socketEvent.player_match,
    (
      sessionID: string,
      playerRequest: playerRequest,
      playerMatch: playerMatch,
      gameStateClient: gameState,
      playerOutput: number
    ) => {
      try {
        const gameStateServer = gameStateRemap(
          gameStateClient,
          playerMatch.clientPlayer
        )

        const newGameStateClient = game.handleplayerMatchPairs(
          playerRequest,
          playerMatch,
          gameStateServer,
          playerID,
          playerServer
        )

        io.sockets
          .in(sessionID)
          .emit(
            socketEvent.player_match,
            newGameStateClient,
            playerOutput,
            playerRequest.clientPlayer
          )
      } catch (error) {
        console.error(error)
      }
    }
  )

  socket.on(
    socketEvent.no_player_match,
    (playerRequest: playerRequest, sessionID: string) =>
      socket.to(sessionID).emit(socketEvent.player_to_deal, playerRequest)
  )

  socket.on(
    socketEvent.player_dealt,
    (
      playerRequest: playerRequest,
      gameStateClient: gameStateClient,
      sessionID: string
    ) => {
      const gameStateServer = gameStateRemap(
        gameStateClient,
        playerRequest.clientPlayer
      )

      const dealt = game.handleDealcard(
        playerRequest,
        gameStateServer,
        game.dealcard,
        playerOutputEnum,
        playerID,
        playerServer
      )

      const newGameStateClient = dealt?.gameState
      const playerOutput = dealt?.playerOutput

      io.sockets
        .in(sessionID)
        .emit(
          socketEvent.player_dealt,
          newGameStateClient,
          playerOutput,
          playerRequest.clientPlayer
        )
    }
  )

  socket.on(
    socketEvent.player_response_message,
    (playerOutput: number, sessionID: string) =>
      socket
        .to(sessionID)
        .emit(socketEvent.player_response_message, playerOutput)
  )

  socket.on(
    socketEvent.player_turn_switch,
    (sessionID: string, playerTurn: number) =>
      socket.to(sessionID).emit(socketEvent.player_turn_switch, playerTurn)
  )

  //remove socket from playerSocketsIDs and delete session
  socket.on(socketEvent.disconnect, () => {
    for (const session in sessions)
      if (sessions[session].playerSocketsIDs.includes(socket.id)) {
        socket.to(session).emit(socketEvent.player_disconnected)
        delete sessions[session]
      }

    console.log(`socket ${socket.id} disconnected`)
    console.log(`sessions: ${JSON.stringify(sessions)}`)
  })
})

await serve(io.handler(), {
  port: Number(port),
})
