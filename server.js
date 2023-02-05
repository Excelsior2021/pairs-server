import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import game from "./gameFunctions.js"
import { config } from "dotenv"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
})
config() // dotenv config
const port = process.env.PORT || 8080

let players = []
let sessions = []

io.on("connection", socket => {
  players.push(socket.id)
  console.log("sockets: ", players)

  socket.on("join_session", sessionID => {
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].sessionID === sessionID) {
        socket.emit("sessionID-exists")
        socket.join(sessionID)
        sessions[i].players.push(socket.id)
        const initialGameState = game.startGame()
        const playerTurn = "player1"
        socket.emit("setPlayer", sessions[i].player === 1 ? 2 : 1)
        io.sockets
          .in(sessionID)
          .emit("start", initialGameState, playerTurn, sessionID)
        return
      }
    }
    socket.emit("no-sessionID")
  })

  socket.on("create_session", sessionID => {
    const player = Math.ceil(Math.random() * 2)
    sessions.push({ sessionID, player, players: [socket.id] })
    socket.join(sessionID)
    socket.emit("setPlayer", player)
  })

  socket.on("recieve_sessionID", () => socket.emit("recieved_sessionID"))

  socket.on("player_request", (player, card, sessionID) => {
    const playerRequest = { player, card }
    socket.to(sessionID).emit("player_requested", playerRequest)
  })

  socket.on(
    "player_match",
    (playerRequest, playerMatch, gameState, playerOutput, sessionID) => {
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

  socket.on("no_player_match", (playerRequest, sessionID) =>
    socket.to(sessionID).emit("player_to_deal", playerRequest)
  )

  socket.on(
    "player_dealt",
    (dealtCard, shuffledDeck, playerRequest, gameState, sessionID) => {
      const { gameState: newGameState, playerOutput } = game.handleDealtCard(
        dealtCard,
        shuffledDeck,
        playerRequest,
        gameState
      )

      io.sockets
        .in(sessionID)
        .emit("player_dealt", newGameState, playerOutput, playerRequest.player)
    }
  )

  socket.on("player_response_message", (playerOutput, sessionID) =>
    socket.to(sessionID).emit("player_response_message", playerOutput)
  )

  socket.on("player_turn_switch", sessionID =>
    socket.to(sessionID).emit("player_turn_switch")
  )

  socket.on("disconnect", () => {
    players = players.filter(player => player !== socket.id)
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].players.includes(socket.id)) {
        socket.to(sessions[i].sessionID).emit("player_disconnected")
        sessions.splice(i, 1)
        break
      }
    }
    console.log(sessions)
    console.log("sockets: ", players)
  })
})

httpServer.listen(port, () => console.log(`listening on port: ${port}`))
