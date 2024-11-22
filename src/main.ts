import { Server } from "socket.io"
import game from "@/game-functions/index.ts"
import { gameStateRemap } from "@/utils/index.ts"
import {
  nonNumValue,
  suit,
  playerOutput as playerOutputEnum,
  playerID,
  playerServer,
} from "@/enums/index.ts"
import "@std/dotenv/load"
import type {
  card,
  playerRequest,
  gameState,
  playerMatch,
  session,
} from "@/types/index.d.ts"

const port = Deno.env.get("PORT") || 8080
const io = new Server(Number(port), {
  cors: {
    origin: Deno.env.get("CLIENT_DOMAIN"),
  },
})
console.log(`listening on port: ${port}`)

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
    console.log(sessions)
  })

  //socket joins existing session and game starts
  socket.on("join_session", (sessionID: string) => {
    const session = sessions[sessionID]
    if (session) {
      socket.join(sessionID)
      socket.emit("sessionID_exists")
      session.playerSocketsIDs.push(socket.id)
      const initialGameState = game.startGame(
        game.createSuits,
        game.createDeck,
        game.shuffleDeck,
        game.dealHand,
        game.initialPairs,
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

  //card request from one player to the other
  socket.on(
    "player_request",
    (player: number, card: card, sessionID: string) => {
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
            "player_match",
            newGameStateClient,
            playerOutput,
            playerRequest.player
          )
      } catch (error) {
        console.error(error)
      }
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

  //remove socket from playerSocketsIDs and delete session
  socket.on("disconnect", () => {
    for (const session in sessions)
      if (sessions[session].playerSocketsIDs.includes(socket.id)) {
        socket.to(session).emit("player_disconnected")
        delete sessions[session]
      }

    playerSocketsIDs.splice(playerSocketsIDs.indexOf(socket.id), 1)
    console.log("sockets: ", playerSocketsIDs)
    console.log(`sessions: ${JSON.stringify(sessions)}`)
  })
})
