import type {
  createSession,
  joinSession,
  playerMatch,
  playerRequest,
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
  playerRequestObj,
  socketEvent
) => socket.to(sessionID).emit(socketEvent.player_requested, playerRequestObj)

const playerMatch: playerMatch = (
  io,
  gameStateRemap,
  sessionID,
  game,
  playerRequestObj,
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

    const newGameStateClient = game.handleplayerMatchPairs(
      playerRequestObj,
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
        playerRequestObj.clientPlayer
      )
  } catch (error) {
    console.error(error)
  }
}

export default {
  createSession,
  joinSession,
  playerRequest,
  playerMatch,
}
