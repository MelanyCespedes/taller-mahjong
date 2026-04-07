import { Server as SocketIOServer, Socket } from 'socket.io';
import { createGame, addPlayer, removePlayer, selectTile, checkMatch } from './game';
import { GameState } from './types';


let gameState: GameState = createGame(15); 


export function setupSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    
    socket.on('player:join', (name: string) => {
      gameState = addPlayer(gameState, socket.id, name);
      io.emit('game:state', gameState);
      console.log(`Player joined: ${name} (${socket.id})`);
    });

  
    socket.on('tile:select', (tileId: string) => {
      const { newState, event } = selectTile(gameState, tileId, socket.id);
      gameState = newState;

      
      io.emit('game:state', gameState);

      if (event !== null) {
        
        const parts = event.split(':');
        const tileAId = parts[2];
        const tileBId = parts[3];

        setTimeout(() => {
          const { newState: resolvedState, isMatch } = checkMatch(
            gameState,
            tileAId,
            tileBId,
            socket.id
          );
          gameState = resolvedState;
          io.emit('game:state', gameState);
          io.emit('match:result', { isMatch, playerId: socket.id });
          console.log(`Match result: ${isMatch ? 'HIT' : 'MISS'} by ${socket.id}`);
        }, 1000);
      }
    });

    
    socket.on('disconnect', () => {
      gameState = removePlayer(gameState, socket.id);
      io.emit('game:state', gameState);
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}