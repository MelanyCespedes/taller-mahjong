import React from 'react';
import { Player } from '../types';

/**
 * Props for the Scoreboard component.
 */
interface ScoreboardProps {
  players: Player[];
  className?: string;
}

/**
 * A Scoreboard component for a multiplayer Mahjong-style game.
 * Displays a sorted list of players with their scores and connection status.
 */
const Scoreboard: React.FC<ScoreboardProps> = ({ players, className = "" }) => {
  // Handle the case where there are no players
  if (players.length === 0) {
    return (
      <div className={`cyber-board-empty ${className}`}>
        No se han establecido enlaces
      </div>
    );
  }

  // Sort players by score descending (highest first) without mutating the original array
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topScore = sortedPlayers[0]?.score;

  return (
    <div className={`cyber-scoreboard-container ${className}`}>
      <div className="cyber-scoreboard-header">
        <h2 className="cyber-scoreboard-title">Clasificación</h2>
      </div>
      
      <div className="divide-y divide-slate-800">
        {sortedPlayers.map((player, index) => {
          const isTopPlayer = player.score === topScore && player.score > 0;
          
          return (
            <div 
              key={player.id} 
              className={`cyber-scoreboard-row ${
                isTopPlayer ? 'cyber-scoreboard-row-top' : 'cyber-scoreboard-row-normal'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank indicator */}
                <span className={`cyber-scoreboard-rank ${
                  index === 0 ? 'cyber-scoreboard-rank-top' : ''
                }`}>
                  {index + 1}
                </span>
                
                <div className="flex flex-col">
                  <span className={`cyber-scoreboard-name ${isTopPlayer ? 'cyber-scoreboard-name-top' : ''}`}>
                    {player.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`cyber-scoreboard-status-dot ${
                        player.isConnected ? 'cyber-scoreboard-status-dot-active' : ''
                      }`} 
                      aria-hidden="true"
                    />
                    <span className="cyber-scoreboard-status-text">
                      {player.isConnected ? 'Enlace Activo' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`cyber-scoreboard-score ${
                  isTopPlayer ? 'cyber-scoreboard-score-top' : ''
                }`}>
                  {player.score}
                </span>
                <span className="cyber-scoreboard-label">
                  Créditos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scoreboard;
