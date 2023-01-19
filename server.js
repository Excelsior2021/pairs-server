import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import pairs from "./gameFunctions/pairsFunctions.js"
import deck, { shuffleDeck } from "./gameFunctions/deckFunctions.js"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
})
const port = 8080

let players = []

io.on("connection", socket => {
  players.push(socket.id)
  console.log(players)

  if (players.length <= 2) socket.emit("setPlayer", players.length)

  if (players.length === 2) {
    const initialGameState = pairs.startGame()
    const playerTurn = "player1"
    io.emit("start", initialGameState, playerTurn)
  }

  socket.on("player_request", (player, card) => {
    const playerRequest = { player, card }
    socket.broadcast.emit("player_requested", playerRequest)
  })

  socket.on(
    "player_match",
    (playerRequest, playerMatch, gameState, playerOutput) => {
      const newGameState = pairs.handlePlayerMatchPairs(
        playerRequest,
        playerMatch,
        gameState
      )

      io.emit("player_match", newGameState, playerOutput, playerRequest.player)
    }
  )

  socket.on("no_player_match", playerRequest =>
    socket.broadcast.emit("player_to_deal", playerRequest)
  )

  socket.on(
    "player_dealt",
    (dealtCard, shuffledDeck, playerRequest, gameState) => {
      const { gameState: newGameState, playerOutput } = pairs.handleDealtCard(
        dealtCard,
        shuffledDeck,
        playerRequest,
        gameState
      )

      io.emit("player_dealt", newGameState, playerOutput, playerRequest.player)
    }
  )

  socket.on("player_response_message", playerOutput =>
    socket.broadcast.emit("player_response_message", playerOutput)
  )

  socket.on("player_turn_switch", player => {
    let playerTurn
    player === "player1" ? (playerTurn = "player2") : (playerTurn = player)
    socket.broadcast.emit("player_turn_switch", playerTurn)
  })

  socket.on("disconnect", () => {
    players = players.filter(player => player !== socket.id)
    console.log(socket.connected, "disconnected", players)
  })
})

httpServer.listen(port, () => console.log(`listening on port: ${port}`))
