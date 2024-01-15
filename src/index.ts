import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import game from "./gameFunctions.js"
import { config } from "dotenv"
import { session, Card, playerRequest, gameState } from "./types/types"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
})
config() // dotenv config
const port = process.env.PORT || 8080

let playersSocketIDs: string[] = []
let sessions: session[] = []

io.on("connection", socket => {
  playersSocketIDs.push(socket.id)
  console.log("sockets: ", playersSocketIDs)

  socket.on("join_session", (sessionID: string) => {
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].sessionID === sessionID) {
        socket.emit("sessionID-exists")
        socket.join(sessionID)
        sessions[i].playersSocketIDs.push(socket.id)
        const initialGameState = game.startGame()
        socket.emit("setPlayer", 2)
        const playerTurn = Math.ceil(Math.random() * 2)
        console.log(playerTurn)
        io.sockets
          .in(sessionID)
          .emit("start", initialGameState, playerTurn, sessionID)
        return
      }
    }
    socket.emit("no-sessionID")
  })

  socket.on("create_session", (sessionID: string) => {
    sessions.push({ sessionID, playersSocketIDs: [socket.id] })
    socket.join(sessionID)
    socket.emit("setPlayer", 1)
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
      playerMatch: playerRequest,
      gameState: gameState,
      playerOutput: number,
      sessionID: string
    ) => {
      const newGameState = game.handlePlayerMatchPairs(
        playerRequest,
        playerMatch,
        gameState
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
    (
      dealtCard: Card,
      shuffledDeck: Card[],
      playerRequest: playerRequest,
      gameState: gameState,
      sessionID: string
    ) => {
      const dealt = game.handleDealtCard(
        dealtCard,
        shuffledDeck,
        playerRequest,
        gameState
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

  socket.on("player_turn_switch", (sessionID: string) =>
    socket.to(sessionID).emit("player_turn_switch")
  )

  socket.on("disconnect", () => {
    playersSocketIDs = playersSocketIDs.filter(player => player !== socket.id)
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].playersSocketIDs.includes(socket.id)) {
        socket.to(sessions[i].sessionID).emit("player_disconnected")
        sessions.splice(i, 1)
        break
      }
    }
    console.log(sessions)
    console.log("sockets: ", playersSocketIDs)
  })
})

httpServer.listen(port, () => console.log(`listening on port: ${port}`))
