import React, { memo } from 'react';
import { Tile } from '../types';

export interface TileProps {
  tile: Tile;
  currentPlayerId: string;
  playerColors: Record<string, string>;
  onSelect: (tileId: string) => void;
}

const TileComponent: React.FC<TileProps> = ({ tile, currentPlayerId, playerColors, onSelect }) => {
  const isBlocked = !!tile.lockedBy && tile.lockedBy !== currentPlayerId;
  const isClickable = !tile.isMatched && !isBlocked;
  const isFaceUp = tile.isFlipped || tile.isMatched;

  // Color of whoever locked or matched this tile
  const lockedColor = tile.lockedBy ? (playerColors[tile.lockedBy] ?? null) : null;
  const matchedColor = tile.matchedBy ? (playerColors[tile.matchedBy] ?? null) : null;

  const frontStyle: React.CSSProperties = lockedColor
    ? { borderColor: lockedColor, boxShadow: `0 0 15px ${lockedColor}99` }
    : {};

  const backStyle: React.CSSProperties = matchedColor
    ? { borderColor: matchedColor, boxShadow: `0 0 25px ${matchedColor}99` }
    : {};

  const handleClick = () => {
    if (isClickable) onSelect(tile.id);
  };

  return (
    <div
      className={`cyber-tile-container ${isClickable ? 'cyber-tile-clickable' : 'cyber-tile-not-clickable'}`}
      onClick={handleClick}
      aria-label={`Ficha ${tile.symbol}`}
      role="button"
      tabIndex={isClickable ? 0 : -1}
      style={{ perspective: '1000px' }}
    >
      <div
        className="cyber-tile-inner"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front (face-down) */}
        <div
          className={`cyber-tile-front ${isBlocked ? 'animate-pulse' : 'cyber-tile-front-normal'}`}
          style={{ backfaceVisibility: 'hidden', ...frontStyle }}
        >
          <div className="cyber-tile-pattern">
            <div className="cyber-tile-pattern-inner" />
          </div>
        </div>

        {/* Back (face-up) */}
        <div
          className={`cyber-tile-back ${tile.isMatched ? 'cyber-tile-back-matched' : ''}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', ...backStyle }}
        >
          <span className={`cyber-tile-symbol ${tile.isMatched ? 'cyber-tile-symbol-matched' : ''}`}>
            {tile.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(TileComponent);
