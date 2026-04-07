"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const game_1 = require("./game");
let gameState = (0, game_1.createGame)(15);
function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on('player:join', (name) => {
            const isReconnecting = gameState.players.some(p => p.name === name && !p.isConnected);
            if (!isReconnecting && gameState.players.length >= 5) {
                socket.emit('game:full');
                return;
            }
            gameState = (0, game_1.addPlayer)(gameState, socket.id, name);
            io.emit('game:state', gameState);
            console.log(`Player joined: ${name} (${socket.id})`);
        });
        socket.on('tile:select', (tileId) => {
            const { newState, event } = (0, game_1.selectTile)(gameState, tileId, socket.id);
            gameState = newState;
            io.emit('game:state', gameState);
            if (event !== null) {
                const parts = event.split(':');
                const tileAId = parts[2];
                const tileBId = parts[3];
                setTimeout(() => {
                    const { newState: resolvedState, isMatch } = (0, game_1.checkMatch)(gameState, tileAId, tileBId, socket.id);
                    gameState = resolvedState;
                    io.emit('game:state', gameState);
                    io.emit('match:result', { isMatch, playerId: socket.id });
                    console.log(`Match result: ${isMatch ? 'HIT' : 'MISS'} by ${socket.id}`);
                }, 1000);
            }
        });
        socket.on('game:restart', () => {
            gameState = (0, game_1.createGame)(15);
            io.emit('game:state', gameState);
            console.log(`Game restarted by ${socket.id}`);
        });
        socket.on('disconnect', () => {
            gameState = (0, game_1.removePlayer)(gameState, socket.id);
            io.emit('game:state', gameState);
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
