import { Tile, Player, GameState, ScoreSnapshot } from './types';

const SYMBOLS = [
  '🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏',
  '🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡',
  '🀀','🀁','🀂','🀃','🀄','🀅','🀆',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(pairCount: number): GameState {
  if (pairCount > SYMBOLS.length) {
    throw new Error(`No hay suficientes símbolos para ${pairCount} pares`);
  }

  const selectedSymbols = SYMBOLS.slice(0, pairCount);

  const rawTiles: Tile[] = selectedSymbols.flatMap((symbol, idx) => [
    { id: `tile-${idx}-a`, symbol, isFlipped: false, isMatched: false, lockedBy: null },
    { id: `tile-${idx}-b`, symbol, isFlipped: false, isMatched: false, lockedBy: null },
  ]);

  const tiles = shuffle(rawTiles);

  return {
    tiles,
    players: [],
    scoreHistory: [],
    isGameOver: false,
    startTime: null,
  };
}

export function addPlayer(state: GameState, id: string, name: string): GameState {
  const existing = state.players.find(p => p.id === id);
  if (existing) {
    return {
      ...state,
      players: state.players.map(p =>
        p.id === id ? { ...p, isConnected: true } : p
      ),
    };
  }

  const newPlayer: Player = { id, name, score: 0, isConnected: true };

  const startTime = state.startTime ?? Date.now();

  return {
    ...state,
    players: [...state.players, newPlayer],
    startTime,
  };
}

export function removePlayer(state: GameState, id: string): GameState {
  const tilesUnlocked = state.tiles.map(t =>
    t.lockedBy === id ? { ...t, lockedBy: null, isFlipped: false } : t
  );

  return {
    ...state,
    tiles: tilesUnlocked,
    players: state.players.map(p =>
      p.id === id ? { ...p, isConnected: false } : p
    ),
  };
}

export function selectTile(
  state: GameState,
  tileId: string,
  playerId: string
): { newState: GameState; event: string | null } {
  const tile = state.tiles.find(t => t.id === tileId);

  if (!tile) return { newState: state, event: null };
  if (tile.isMatched) return { newState: state, event: null };
  if (tile.lockedBy && tile.lockedBy !== playerId) return { newState: state, event: null };
  if (tile.lockedBy === playerId) return { newState: state, event: null };

  const alreadyLocked = state.tiles.find(
    t => t.lockedBy === playerId && !t.isMatched
  );

  const tilesAfterSelect = state.tiles.map(t =>
    t.id === tileId ? { ...t, lockedBy: playerId, isFlipped: true } : t
  );

  const newState: GameState = { ...state, tiles: tilesAfterSelect };

  if (alreadyLocked) {

    return {
      newState,
      event: `check:match:${alreadyLocked.id}:${tileId}`,
    };
  }

  return { newState, event: null };
}

export function checkMatch(
  state: GameState,
  t1Id: string,
  t2Id: string,
  playerId: string
): { newState: GameState; isMatch: boolean } {
  const t1 = state.tiles.find(t => t.id === t1Id);
  const t2 = state.tiles.find(t => t.id === t2Id);

  if (!t1 || !t2) return { newState: state, isMatch: false };

  const isMatch = t1.symbol === t2.symbol;

  let tiles: Tile[];
  let players: Player[];

  if (isMatch) {
    tiles = state.tiles.map(t =>
      t.id === t1Id || t.id === t2Id
        ? { ...t, isMatched: true, lockedBy: null, isFlipped: true }
        : t
    );

    players = state.players.map(p =>
      p.id === playerId ? { ...p, score: p.score + 1 } : p
    );
  } else {
    tiles = state.tiles.map(t =>
      t.id === t1Id || t.id === t2Id
        ? { ...t, isFlipped: false, lockedBy: null }
        : t
    );
    players = state.players;
  }

  const snapshot: ScoreSnapshot = {
    timestamp: Date.now(),
    scores: Object.fromEntries(players.map(p => [p.name, p.score])),
  };

  const isGameOver = tiles.every(t => t.isMatched);

  const newState: GameState = {
    ...state,
    tiles,
    players,
    scoreHistory: [...state.scoreHistory, snapshot],
    isGameOver,
  };

  return { newState, isMatch };
}