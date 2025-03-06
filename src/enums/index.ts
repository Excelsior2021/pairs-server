export enum PlayerOutput {
  DealtcardMatch = 1,
  HandMatch,
  NoMatch,
}

export enum Suit {
  clubs = "clubs",
  diamonds = "diamonds",
  hearts = "hearts",
  spades = "spades",
}

export enum NonNumValue {
  ace = "ace",
  jack = "jack",
  queen = "queen",
  king = "king",
}

export enum PlayerID {
  P1 = 1,
  P2,
}

export enum PlayerServer {
  player1 = "player1",
  player2 = "player2",
}

export enum PlayerClient {
  player = "player",
  opponent = "opponent",
}

export enum SocketEvent {
  connectiton = "connection",
  create_session = "create_session",
  join_session = "join_session",
  sessionID_exists = "sessionID_exists",
  no_sessionID = "no_sessionID",
  start = "start",
  player_request = "player_request",
  player_requested = "player_requested",
  player_match = "player_match",
  no_player_match = "no_player_match",
  player_to_deal = "player_to_deal",
  player_dealt = "player_dealt",
  player_response_message = "player_response_message",
  player_turn_switch = "player_turn_switch",
  disconnect = "disconnect",
  player_disconnected = "player_disconnected",
}
