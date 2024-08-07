"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const gameFunctions_js_1 = __importDefault(require("./gameFunctions.js"));
const utils_1 = require("./utils");
const dotenv_1 = require("dotenv");
const Card_js_1 = __importStar(require("./gameObjects/Card.js"));
const Player_js_1 = __importDefault(require("./gameObjects/Player.js"));
const index_js_1 = require("./enums/index.js");
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
});
(0, dotenv_1.config)();
const port = process.env.PORT || 8080;
let playersSocketIDs = [];
let sessions = [];
io.on("connection", socket => {
    playersSocketIDs.push(socket.id);
    console.log("sockets: ", playersSocketIDs);
    socket.on("join_session", (sessionID) => {
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionID === sessionID) {
                socket.emit("sessionID-exists");
                socket.join(sessionID);
                sessions[i].playersSocketIDs.push(socket.id);
                const initialGameState = gameFunctions_js_1.default.startGame(gameFunctions_js_1.default.createDeck, gameFunctions_js_1.default.shuffleDeck, gameFunctions_js_1.default.dealHand, gameFunctions_js_1.default.initialPairs, Card_js_1.default, Player_js_1.default, Card_js_1.nonNumValue, Card_js_1.suit);
                socket.emit("setPlayer", 2);
                const playerTurn = Math.ceil(Math.random() * 2);
                io.sockets
                    .in(sessionID)
                    .emit("start", initialGameState, playerTurn, sessionID);
                return;
            }
        }
        socket.emit("no-sessionID");
    });
    socket.on("create_session", (sessionID) => {
        sessions.push({ sessionID, playersSocketIDs: [socket.id] });
        socket.join(sessionID);
        socket.emit("setPlayer", 1);
    });
    socket.on("recieve_sessionID", () => socket.emit("recieved_sessionID"));
    socket.on("player_request", (player, card, sessionID) => {
        const playerRequest = { player, card };
        socket.to(sessionID).emit("player_requested", playerRequest);
    });
    socket.on("player_match", (playerRequest, playerMatch, gameState, playerOutput, sessionID) => {
        const gameStateRemapped = (0, utils_1.gameStateRemap)(gameState, playerMatch.clientPlayer);
        const newGameState = gameFunctions_js_1.default.handlePlayerMatchPairs(playerRequest, playerMatch, gameStateRemapped);
        io.sockets
            .in(sessionID)
            .emit("player_match", newGameState, playerOutput, playerRequest.player);
    });
    socket.on("no_player_match", (playerRequest, sessionID) => socket.to(sessionID).emit("player_to_deal", playerRequest));
    socket.on("player_dealt", (playerRequest, gameState, sessionID) => {
        const gameStateRemapped = (0, utils_1.gameStateRemap)(gameState, playerRequest.player);
        const dealt = gameFunctions_js_1.default.handleDealCard(playerRequest, gameStateRemapped, gameFunctions_js_1.default.dealCard, index_js_1.playerOutput);
        const newGameState = dealt === null || dealt === void 0 ? void 0 : dealt.gameState;
        const playerOutput = dealt === null || dealt === void 0 ? void 0 : dealt.playerOutput;
        io.sockets
            .in(sessionID)
            .emit("player_dealt", newGameState, playerOutput, playerRequest.player);
    });
    socket.on("player_response_message", (playerOutput, sessionID) => socket.to(sessionID).emit("player_response_message", playerOutput));
    socket.on("player_turn_switch", (sessionID, playerTurn) => socket.to(sessionID).emit("player_turn_switch", playerTurn));
    socket.on("disconnect", () => {
        playersSocketIDs = playersSocketIDs.filter(player => player !== socket.id);
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].playersSocketIDs.includes(socket.id)) {
                socket.to(sessions[i].sessionID).emit("player_disconnected");
                sessions.splice(i, 1);
                break;
            }
        }
        console.log(sessions);
        console.log("sockets: ", playersSocketIDs);
    });
});
io.listen(Number(port));
console.log(`listening on port: ${port}`);
