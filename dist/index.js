"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const gameFunctions_js_1 = __importDefault(require("./gameFunctions.js"));
const dotenv_1 = require("dotenv");
const utils_js_1 = require("./utils/utils.js");
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
                const initialGameState = gameFunctions_js_1.default.startGame();
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
        const gameStateRemapped = (0, utils_js_1.gameStateRemap)(gameState, playerMatch.clientPlayer);
        const newGameState = gameFunctions_js_1.default.handlePlayerMatchPairs(playerRequest, playerMatch, gameStateRemapped);
        io.sockets
            .in(sessionID)
            .emit("player_match", newGameState, playerOutput, playerRequest.player);
    });
    socket.on("no_player_match", (playerRequest, sessionID) => socket.to(sessionID).emit("player_to_deal", playerRequest));
    socket.on("player_dealt", (playerRequest, gameState, sessionID) => {
        const gameStateRemapped = (0, utils_js_1.gameStateRemap)(gameState, playerRequest.player);
        const dealt = gameFunctions_js_1.default.handleDealCard(playerRequest, gameStateRemapped);
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
