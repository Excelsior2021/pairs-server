import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import game from "./gameFunctions/gameFunctions.js"

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

  socket.on("join_session", sessionID => {
    socket.join(sessionID)
    const initialGameState = game.startGame()
    const playerTurn = "player1"
    socket.emit("setPlayer", 2)
    io.sockets
      .in(sessionID)
      .emit("start", initialGameState, playerTurn, sessionID)
    // console.log(socket.rooms)
  })

  socket.on("create_session", sessionID => {
    let sessionPlayers = []
    socket.join(sessionID.toString())
    sessionPlayers.push(socket.id)

    console.log("sessionPlayers: ", sessionPlayers)
    // console.log(sessionID)

    if (sessionPlayers.length <= 2) socket.emit("setPlayer", 1)
  })

  socket.on("player_request", (player, card, sessionID) => {
    console.log(sessionID)
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

      io.in(sessionID).emit(
        "player_match",
        newGameState,
        playerOutput,
        playerRequest.player
      )
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
    console.log("disconnected", players)
  })
})

httpServer.listen(port, () => console.log(`listening on port: ${port}`))
