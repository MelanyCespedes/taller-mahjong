import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '../types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
const HISTORY_KEY = 'mahjong:history';

interface GameRecord {
  date: string;
  durationSeconds: number;
  players: { name: string; score: number }[];
}

function saveGameToHistory(state: GameState): void {
  const durationSeconds = state.startTime
    ? Math.floor((Date.now() - state.startTime) / 1000)
    : 0;

  const record: GameRecord = {
    date: new Date().toLocaleDateString(),
    durationSeconds,
    players: state.players.map((p) => ({ name: p.name, score: p.score })),
  };

  const existing: GameRecord[] = JSON.parse(
    localStorage.getItem(HISTORY_KEY) ?? '[]'
  );

  localStorage.setItem(HISTORY_KEY, JSON.stringify([...existing, record]));
}

interface UseSocketReturn {
  socket: Socket | null;
  gameState: GameState | null;
  isConnected: boolean;
  lastMatchResult: { isMatch: boolean; seq: number } | null;
  gameFull: boolean;
  joinGame: (name: string) => void;
  selectTile: (tileId: string) => void;
  restartGame: () => void;
}

export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState<{ isMatch: boolean; seq: number } | null>(null);
  const [gameFull, setGameFull] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('game:state', (state: GameState) => {
      if (state.isGameOver) {
        saveGameToHistory(state);
      }
      setGameState(state);
    });

    socket.on('match:result', ({ isMatch }: { isMatch: boolean }) => {
      setLastMatchResult(prev => ({ isMatch, seq: (prev?.seq ?? 0) + 1 }));
    });

    socket.on('game:full', () => {
      setGameFull(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    socketRef.current?.emit('player:join', name);
  };

  const selectTile = (tileId: string) => {
    socketRef.current?.emit('tile:select', tileId);
  };

  const restartGame = () => {
    socketRef.current?.emit('game:restart');
  };

  return {
    socket: socketRef.current,
    gameState,
    isConnected,
    lastMatchResult,
    gameFull,
    joinGame,
    selectTile,
    restartGame,
  };
}
