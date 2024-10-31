import { Server } from "socket.io"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import { Card, Player } from "@/game-objects/index.ts"
import {
  nonNumValue,
  suit,
  playerOutput as playerOutputEnum,
  playerID,
  playerServer,
} from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  playerRequest,
  gameState,
  playerMatch,
  session,
} from "@/types/index.d.ts"

const io = new Server({
  cors: {
    origin: "*",
  },
})
const port = Deno.env.get("PORT") || 8080
const playerSocketsIDs: string[] = []
const sessions: session = {}

io.on("connection", socket => {
  //on connection, socket is added to playerSocketsIDs
  playerSocketsIDs.push(socket.id)
  console.log("sockets: ", playerSocketsIDs)

  //creates a session for socket
  socket.on("create_session", (sessionID: string) => {
    sessions[sessionID] = { playerSocketsIDs: [socket.id] }
    socket.join(sessionID)
    socket.emit("set_player", playerID.player1)
  })

  //socket joins existing session and game starts
  socket.on("join_session", (sessionID: string) => {
    const session = sessions[sessionID]
    if (session) {
      socket.emit("sessionID_exists")
      socket.join(sessionID)
      session.playerSocketsIDs.push(socket.id)
      const initialGameState = game.startGame(
        game.createSuits,
        game.createDeck,
        game.shuffleDeck,
        game.dealCard,
        game.dealHand,
        game.initialPairs,
        Card,
        Player,
        nonNumValue,
        suit
      )
      socket.emit("set_player", playerID.player2)
      const playerTurn = Math.ceil(Math.random() * 2)
      io.sockets
        .in(sessionID)
        .emit("start", initialGameState, playerTurn, sessionID)
    }
    //if requested session ID does not exist
    else socket.emit("no_sessionID")
  })

  socket.on("recieve_sessionID", () => socket.emit("recieved_sessionID"))

  //card request from one player to the other
  socket.on(
    "player_request",
    (player: number, card: Card, sessionID: string) => {
      const playerRequest = { player, card }
      socket.to(sessionID).emit("player_requested", playerRequest)
    }
  )

  socket.on(
    "player_match",
    (
      playerRequest: playerRequest,
      playerMatch: playerMatch,
      gameStateClient: gameState,
      playerOutput: number,
      sessionID: string
    ) => {
      const gameStateServer = gameStateRemap(
        gameStateClient,
        playerMatch.clientPlayer
      )
      const newGameStateClient = game.handlePlayerMatchPairs(
        playerRequest,
        playerMatch,
        gameStateServer,
        playerID,
        playerServer
      )

      io.sockets
        .in(sessionID)
        .emit(
          "player_match",
          newGameStateClient,
          playerOutput,
          playerRequest.player
        )
    }
  )

  socket.on(
    "no_player_match",
    (playerRequest: playerRequest, sessionID: string) =>
      socket.to(sessionID).emit("player_to_deal", playerRequest)
  )

  socket.on(
    "player_dealt",
    (
      playerRequest: playerRequest,
      gameStateClient: gameState,
      sessionID: string
    ) => {
      const gameStateServer = gameStateRemap(
        gameStateClient,
        playerRequest.player
      )

      const dealt = game.handleDealCard(
        playerRequest,
        gameStateServer,
        game.dealCard,
        playerOutputEnum,
        playerID,
        playerServer
      )

      const newGameStateClient = dealt?.gameState
      const playerOutput = dealt?.playerOutput

      io.sockets
        .in(sessionID)
        .emit(
          "player_dealt",
          newGameStateClient,
          playerOutput,
          playerRequest.player
        )
    }
  )

  socket.on(
    "player_response_message",
    (playerOutput: number, sessionID: string) =>
      socket.to(sessionID).emit("player_response_message", playerOutput)
  )

  socket.on("player_turn_switch", (sessionID: string, playerTurn: number) =>
    socket.to(sessionID).emit("player_turn_switch", playerTurn)
  )

  //remove session
  socket.on("player_disconnect", (sessionID: string) => {
    const session = sessions[sessionID]
    if (session) {
      socket.to(sessionID).emit("player_disconnected")
      delete sessions[sessionID]
    }
    console.log(`sessions: ${JSON.stringify(sessions)}`)
    socket.disconnect()
  })

  //remove socket from playerSocketsIDs
  socket.on("disconnect", () => {
    playerSocketsIDs.splice(playerSocketsIDs.indexOf(socket.id), 1)
    console.log("sockets: ", playerSocketsIDs)
  })
})

io.listen(Number(port))
console.log(`listening on port: ${port}`)
