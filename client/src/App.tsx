import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import LiveChart from './components/LiveChart';

export default function App() {
  const { socket, gameState, isConnected, joinGame, selectTile } = useSocket();

  const currentPlayer = gameState?.players.find(
    (p) => p.id === socket?.id
  );

  const hasJoined = currentPlayer !== undefined;

  if (!hasJoined) {
    return <Lobby joinGame={joinGame} />;
  }

  return (
    <div className="cyber-layout">
      {/* Header */}
      <header className="cyber-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="cyber-header-logo">
              🀄
            </div>
            <div>
              <h1 className="cyber-header-title">Mahjong Multijugador</h1>
              <p className="cyber-header-subtitle">
                {isConnected ? 'Enlace Activo' : 'Reconectando...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Jugador</span>
              <span className="text-sm font-mono font-bold text-white">{currentPlayer?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Top Section: Board and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
          {/* Left: Board */}
          <div className="cyber-board-container h-full">
            <Board
              tiles={gameState?.tiles ?? []}
              currentPlayerId={socket?.id ?? ''}
              selectTile={selectTile}
            />
          </div>

          {/* Right: Scoreboard */}
          <div className="flex flex-col gap-6 h-full">
            <Scoreboard players={gameState?.players ?? []} />
          </div>
        </div>

        {/* Bottom Section: Score Trajectory */}
        <LiveChart
          scoreHistory={gameState?.scoreHistory ?? []}
          players={gameState?.players ?? []}
        />
      </main>
    </div>
  );
}
