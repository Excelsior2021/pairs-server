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
  SocketEvent
) => {
  const session = sessions[sessionID]
  if (session) {
    socket.join(sessionID)
    socket.emit(SocketEvent.sessionID_exists, sessionID)
    session.playerSocketsIDs.push(socket.id)
    const initialGameState = game.startGame(
      deck,
      game.shuffleDeck,
      game.initialPairs
    )
    const playerTurn = Math.ceil(Math.random() * 2)
    io.sockets
      .in(sessionID)
      .emit(SocketEvent.start, initialGameState, playerTurn)
  }
  //if requested session ID does not exist
  else socket.emit(SocketEvent.no_sessionID)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
}

const playerRequest: playerRequest = (
  socket,
  sessionID,
  playerRequest,
  SocketEvent
) => socket.to(sessionID).emit(SocketEvent.player_requested, playerRequest)

const playerMatch: playerMatch = (
  io,
  gameStateRemap,
  sessionID,
  game,
  playerRequest,
  playerMatch,
  gameStateClient,
  PlayerOutput,
  SocketEvent
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

    const gameOver = game.isGameOver(newGameStateClient)

    io.sockets
      .in(sessionID)
      .emit(
        SocketEvent.player_match,
        gameStateServer,
        PlayerOutput,
        playerRequest.playerID,
        gameOver
      )
  } catch (error) {
    console.error(error)
  }
}

const noPlayerMatch: noPlayerMatch = (
  socket,
  sessionID,
  playerRequest,
  SocketEvent
) => socket.to(sessionID).emit(SocketEvent.player_to_deal, playerRequest)

const playerDealt: playerDealt = (
  io,
  sessionID,
  gameStateRemap,
  gameStateClient,
  game,
  playerRequest,
  playerOutputEnum,
  SocketEvent
) => {
  const { newGameStateClient, PlayerOutput } = game.handleDealCard(
    playerRequest,
    gameStateClient,
    playerOutputEnum
  )

  const gameStateServer = gameStateRemap(
    newGameStateClient,
    playerRequest.playerID
  )

  const gameOver = game.isGameOver(newGameStateClient)

  io.sockets
    .in(sessionID)
    .emit(
      SocketEvent.player_dealt,
      gameStateServer,
      PlayerOutput,
      playerRequest.playerID,
      gameOver
    )
}

const playerResponseMessage: playerResponseMessage = (
  socket,
  sessionID,
  PlayerOutput,
  SocketEvent
) =>
  socket.to(sessionID).emit(SocketEvent.player_response_message, PlayerOutput)

const playerTurnSwitch: playerTurnSwitch = (
  socket,
  sessionID,
  playerTurn,
  SocketEvent
) => socket.to(sessionID).emit(SocketEvent.player_turn_switch, playerTurn)

const disconnect: disconnect = (socket, sessions, SocketEvent) => {
  for (const session in sessions)
    if (sessions[session].playerSocketsIDs.includes(socket.id)) {
      socket.to(session).emit(SocketEvent.player_disconnected)
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
