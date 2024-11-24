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

const createSession: createSession = (
  socket,
  sessions,
  sessionID,
  playerID,
  socketEvent
) => {
  sessions[sessionID] = { playerSocketsIDs: [socket.id] }
  socket.join(sessionID)
  socket.emit(socketEvent.set_player, playerID.player1)
  console.log(sessions)
}

const joinSession: joinSession = (
  io,
  socket,
  sessions,
  sessionID,
  game,
  playerID,
  nonNumValue,
  suit,
  socketEvent
) => {
  const session = sessions[sessionID]
  if (session) {
    socket.join(sessionID)
    socket.emit(socketEvent.sessionID_exists)
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
    socket.emit(socketEvent.set_player, playerID.player2)
    const playerTurn = Math.ceil(Math.random() * 2)
    io.sockets
      .in(sessionID)
      .emit(socketEvent.start, initialGameState, playerTurn, sessionID)
  }
  //if requested session ID does not exist
  else socket.emit(socketEvent.no_sessionID)
  console.log(sessions)
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
  playerID,
  playerServer,
  socketEvent
) => {
  try {
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
        socketEvent.player_match,
        newGameStateClient,
        playerOutput,
        playerRequest.clientPlayer
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
  playerID,
  playerServer,
  socketEvent
) => {
  const gameStateServer = gameStateRemap(
    gameStateClient,
    playerRequest.clientPlayer
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
      socketEvent.player_dealt,
      newGameStateClient,
      playerOutput,
      playerRequest.clientPlayer
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
