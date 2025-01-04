import type {
  createSession,
  disconnect,
  joinSession,
  noPlayerMatch,
  playerDealt,
  playerMatch,
  playerRequest,
  playerResponseMessage,
  playerTurnSwitch,
} from "@/types/event-cb.d.ts"

const createSession: createSession = (socket, sessions, sessionID) => {
  sessions[sessionID] = { playerSocketsIDs: [socket.id] }
  socket.join(sessionID)
  console.log(sessions)
}

const joinSession: joinSession = (
  io,
  socket,
  sessions,
  sessionID,
  deck,
  game,
  socketEvent
) => {
  const session = sessions[sessionID]
  if (session) {
    socket.join(sessionID)
    socket.emit(socketEvent.sessionID_exists)
    session.playerSocketsIDs.push(socket.id)
    const initialGameState = game.startGame(
      deck,
      game.shuffleDeck,
      game.initialPairs
    )
    const playerTurn = Math.ceil(Math.random() * 2)
    io.sockets
      .in(sessionID)
      .emit(socketEvent.start, initialGameState, playerTurn, sessionID)
  }
  //if requested session ID does not exist
  else socket.emit(socketEvent.no_sessionID)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
}

const playerRequest: playerRequest = (
  socket,
  sessionID,
  playerRequest,
  socketEvent
) => socket.to(sessionID).emit(socketEvent.player_requested, playerRequest)

const playerMatch: playerMatch = (
  io,
  gameStateRemap,
  sessionID,
  game,
  playerRequest,
  playerMatch,
  gameStateClient,
  playerOutput,
  socketEvent
) => {
  try {
    const newGameStateClient = game.handlePlayerMatchPairs(
      playerRequest,
      playerMatch,
      gameStateClient
    )

    const gameStateServer = gameStateRemap(
      newGameStateClient,
      playerMatch.playerID
    )

    io.sockets
      .in(sessionID)
      .emit(
        socketEvent.player_match,
        gameStateServer,
        playerOutput,
        playerRequest.playerID
      )
  } catch (error) {
    console.error(error)
  }
}

const noPlayerMatch: noPlayerMatch = (
  socket,
  sessionID,
  playerRequest,
  socketEvent
) => socket.to(sessionID).emit(socketEvent.player_to_deal, playerRequest)

const playerDealt: playerDealt = (
  io,
  sessionID,
  gameStateRemap,
  gameStateClient,
  game,
  playerRequest,
  playerOutputEnum,
  socketEvent
) => {
  const { newGameStateClient, playerOutput } = game.handleDealCard(
    playerRequest,
    gameStateClient,
    playerOutputEnum
  )

  const gameStateServer = gameStateRemap(
    newGameStateClient,
    playerRequest.playerID
  )

  io.sockets
    .in(sessionID)
    .emit(
      socketEvent.player_dealt,
      gameStateServer,
      playerOutput,
      playerRequest.playerID
    )
}

const playerResponseMessage: playerResponseMessage = (
  socket,
  sessionID,
  playerOutput,
  socketEvent
) =>
  socket.to(sessionID).emit(socketEvent.player_response_message, playerOutput)

const playerTurnSwitch: playerTurnSwitch = (
  socket,
  sessionID,
  playerTurn,
  socketEvent
) => socket.to(sessionID).emit(socketEvent.player_turn_switch, playerTurn)

const disconnect: disconnect = (socket, sessions, socketEvent) => {
  for (const session in sessions)
    if (sessions[session].playerSocketsIDs.includes(socket.id)) {
      socket.to(session).emit(socketEvent.player_disconnected)
      delete sessions[session]
    }

  console.log(`socket ${socket.id} disconnected`)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
}

export default {
  createSession,
  joinSession,
  playerRequest,
  playerMatch,
  noPlayerMatch,
  playerDealt,
  playerResponseMessage,
  playerTurnSwitch,
  disconnect,
}
