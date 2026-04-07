import { useState } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import LiveChart from './components/LiveChart';
import { Tile, Player, ScoreSnapshot } from './types';

/**
 * Main Application Component
 * Integrates the Mahjong game components for preview.
 */
export default function App() {
  // Mock current player
  const currentPlayerId = "1";

  // Mock Players
  const [players] = useState<Player[]>([
    { id: "1", name: "Tú (Jugador A)", score: 12, isConnected: true },
    { id: "2", name: "Jugador B", score: 8, isConnected: true },
    { id: "3", name: "Jugador C", score: 15, isConnected: false },
    { id: "4", name: "Jugador D", score: 5, isConnected: true },
    { id: "5", name: "Jugador E", score: 10, isConnected: true },
  ]);

  // Mock Tiles
  const [tiles, setTiles] = useState<Tile[]>([
    { id: 't1', symbol: '🀄', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't2', symbol: '🀅', isFlipped: true, isMatched: false, lockedBy: null },
    { id: 't3', symbol: '🀆', isFlipped: false, isMatched: true, lockedBy: null },
    { id: 't4', symbol: '🀇', isFlipped: false, isMatched: false, lockedBy: '2' },
    { id: 't5', symbol: '🀈', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't6', symbol: '🀄', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't7', symbol: '🀉', isFlipped: true, isMatched: false, lockedBy: '1' },
    { id: 't8', symbol: '🀊', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't9', symbol: '🀋', isFlipped: false, isMatched: true, lockedBy: null },
    { id: 't10', symbol: '🀌', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't11', symbol: '🀍', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't12', symbol: '🀎', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't13', symbol: '🀅', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't14', symbol: '🀆', isFlipped: false, isMatched: true, lockedBy: null },
    { id: 't15', symbol: '🀇', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't16', symbol: '🀈', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't17', symbol: '🀉', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't18', symbol: '🀊', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't19', symbol: '🀋', isFlipped: false, isMatched: true, lockedBy: null },
    { id: 't20', symbol: '🀌', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't21', symbol: '🀍', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't22', symbol: '🀎', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't23', symbol: '🀏', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't24', symbol: '🀏', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't25', symbol: '🀐', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't26', symbol: '🀐', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't27', symbol: '🀑', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't28', symbol: '🀑', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't29', symbol: '🀒', isFlipped: false, isMatched: false, lockedBy: null },
    { id: 't30', symbol: '🀒', isFlipped: false, isMatched: false, lockedBy: null },
  ]);

  // Mock Score History
  const [scoreHistory] = useState<ScoreSnapshot[]>([
    { timestamp: Date.now() - 5000, scores: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } },
    { timestamp: Date.now() - 4000, scores: { "1": 2, "2": 2, "3": 4, "4": 0, "5": 2 } },
    { timestamp: Date.now() - 3000, scores: { "1": 5, "2": 4, "3": 8, "4": 2, "5": 4 } },
    { timestamp: Date.now() - 2000, scores: { "1": 8, "2": 6, "3": 12, "4": 4, "5": 7 } },
    { timestamp: Date.now() - 1000, scores: { "1": 12, "2": 8, "3": 15, "4": 5, "5": 10 } },
  ]);

  const handleSelectTile = (tileId: string) => {
    console.log(`Tile selected: ${tileId}`);
    // Simple local toggle for preview interaction
    setTiles(prev => prev.map(t => 
      t.id === tileId ? { ...t, isFlipped: !t.isFlipped } : t
    ));
  };

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
              <p className="cyber-header-subtitle">Enlace Activo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">ID del Sector</span>
              <span className="text-sm font-mono font-bold text-white">MAHJ-77-XQ</span>
            </div>
            <button className="cyber-header-btn">
              Sincronizar Aliados
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Top Section: Board and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
          {/* Left: Board */}
          <div className="cyber-board-container h-full">
            <Board 
              tiles={tiles} 
              currentPlayerId={currentPlayerId} 
              selectTile={handleSelectTile} 
            />
          </div>

          {/* Right: Scoreboard & Logs */}
          <div className="flex flex-col gap-6 h-full">
            <Scoreboard players={players} />
            
            <div className="cyber-logs-container flex-1">
              <h3 className="cyber-logs-title">Registros</h3>
              <div className="space-y-4">
                <div className="cyber-logs-item">
                  <span className="cyber-logs-dot bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                  <span className="text-slate-300 font-medium"><strong className="text-cyan-400">Jugador C</strong> sincronizó 🀆 🀆</span>
                  <span className="text-slate-500 ml-auto font-mono">02m</span>
                </div>
                <div className="cyber-logs-item">
                  <span className="cyber-logs-dot bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
                  <span className="text-slate-300 font-medium"><strong className="text-purple-400">Sistema</strong> emparejó 🀋 🀋</span>
                  <span className="text-slate-500 ml-auto font-mono">05m</span>
                </div>
                <div className="cyber-logs-item">
                  <span className="cyber-logs-dot bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,1)]"></span>
                  <span className="text-slate-400 font-medium italic"><strong>Jugador C</strong> enlace cortado</span>
                  <span className="text-slate-500 ml-auto font-mono">10m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Score Trajectory (Full Width) */}
        <LiveChart scoreHistory={scoreHistory} players={players} />
      </main>
    </div>
  );
}
