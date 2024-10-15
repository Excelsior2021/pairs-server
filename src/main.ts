import { Server } from "socket.io"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import { Card, Player, nonNumValue, suit } from "@/game-objects/index.ts"
import { playerOutput as playerOutputEnum } from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  session,
  playerRequest,
  gameStateClient,
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
  playerSocketsIDs.push(socket.id)
  console.log("sockets: ", playerSocketsIDs)

  socket.on("join_session", (sessionID: string) => {
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].sessionID === sessionID) {
        socket.emit("sessionID-exists")
        socket.join(sessionID)
        sessions[i].playerSocketsIDs.push(socket.id)
        const initialGameState = game.startGame(
          game.createDeck,
          game.shuffleDeck,
          game.dealHand,
          game.initialPairs,
          Card,
          Player,
          nonNumValue,
          suit
        )
        socket.emit("setPlayer", 2)
        const playerTurn = Math.ceil(Math.random() * 2)
        io.sockets
          .in(sessionID)
          .emit("start", initialGameState, playerTurn, sessionID)
        return
      }
    }
    socket.emit("no-sessionID")
  })

  socket.on("create_session", (sessionID: string) => {
    sessions.push({ sessionID, playerSocketsIDs: [socket.id] })
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
      playerMatch: any,
      gameState: gameStateClient,
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
    (
      playerRequest: playerRequest,
      gameState: gameStateClient,
      sessionID: string
    ) => {
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
