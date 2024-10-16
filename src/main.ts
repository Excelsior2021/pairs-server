import { Server } from "socket.io"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import { Card, Player } from "@/game-objects/index.ts"
import {
  nonNumValue,
  suit,
  playerOutput as playerOutputEnum,
  playerID,
} from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  session,
  playerRequest,
  gameState,
  playerMatch,
} from "@/types/index.d.ts"

const io = new Server({
  cors: {
    origin: "*",
  },
})
const port = Deno.env.get("PORT") || 8080
const playerSocketsIDs: string[] = []
const sessions: session[] = []

io.on("connection", socket => {
  //on connection, socket is added to playerSocketsIDs
  playerSocketsIDs.push(socket.id)
  console.log("sockets: ", playerSocketsIDs)

  //creates a session for socket
  socket.on("create_session", (sessionID: string) => {
    sessions.push({ sessionID, playerSocketsIDs: [socket.id] })
    socket.join(sessionID)
    socket.emit("set_player", playerID.player1)
  })

  //socket joins existing session and game starts
  socket.on("join_session", (sessionID: string) => {
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].sessionID === sessionID) {
        socket.emit("sessionID_exists")
        socket.join(sessionID)
        sessions[i].playerSocketsIDs.push(socket.id)
        const initialGameState = game.startGame(
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
        return
      }
    }
    //if requested session ID does not exist
    socket.emit("no_sessionID")
  })

  socket.on("recieve_sessionID", () => socket.emit("recieved_sessionID"))

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
      gameState: gameState,
      playerOutput: number,
      sessionID: string
    ) => {
      const gameStateRemapped = gameStateRemap(
        gameState,
        playerMatch.clientPlayer
      )
      const newGameState = game.handlePlayerMatchPairs(
        playerRequest,
        playerMatch,
        gameStateRemapped
      )

      io.sockets
        .in(sessionID)
        .emit("player_match", newGameState, playerOutput, playerRequest.player)
    }
  )

  socket.on(
    "no_player_match",
    (playerRequest: playerRequest, sessionID: string) =>
      socket.to(sessionID).emit("player_to_deal", playerRequest)
  )

  socket.on(
    "player_dealt",
    (playerRequest: playerRequest, gameState: gameState, sessionID: string) => {
      const gameStateRemapped = gameStateRemap(gameState, playerRequest.player)
      const dealt = game.handleDealCard(
        playerRequest,
        gameStateRemapped,
        game.dealCard,
        playerOutputEnum
      )

      const newGameState = dealt?.gameState
      const playerOutput = dealt?.playerOutput

      io.sockets
        .in(sessionID)
        .emit("player_dealt", newGameState, playerOutput, playerRequest.player)
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

  socket.on("disconnect", () => {
    //remove socket from playerSocketsIDs
    playerSocketsIDs.splice(playerSocketsIDs.indexOf(socket.id), 1)

    //remove socket from session
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].playerSocketsIDs.includes(socket.id)) {
        socket.to(sessions[i].sessionID).emit("player_disconnected")
        sessions.splice(i, 1)
        break
      }
    }
    console.log(sessions)
    console.log("sockets: ", playerSocketsIDs)
  })
})

io.listen(Number(port))
console.log(`listening on port: ${port}`)
