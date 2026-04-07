import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';

// TODO: Replace placeholders with real components from Integrante 5
// import Board from './components/Board';
// import Scoreboard from './components/Scoreboard';
// import LiveChart from './components/LiveChart';

export default function App() {
  const { socket, gameState, isConnected, joinGame } = useSocket();

  const currentPlayer = gameState?.players.find(
    (p) => p.id === socket?.id
  );

  const hasJoined = currentPlayer !== undefined;

  if (!hasJoined) {
    return <Lobby joinGame={joinGame} />;
  }

  return (
    <div className="game-layout">
      <header className="game-header">
        <h1>Mahjong Colaborativo</h1>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </span>
      </header>

      <main className="game-main">
        {/* Board — Integrante 5 */}
        <div className="board-placeholder">
          Board goes here
        </div>

        <aside className="game-sidebar">
          {/* Scoreboard — Integrante 5 */}
          <div className="scoreboard-placeholder">
            Scoreboard goes here
          </div>

          {/* LiveChart — Integrante 5 */}
          <div className="chart-placeholder">
            LiveChart goes here
          </div>
        </aside>
      </main>
    </div>
  );
}
