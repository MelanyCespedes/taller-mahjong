import React, { memo } from 'react';
import { Tile } from '../types';

/**
 * Props for the Tile component.
 */
export interface TileProps {
  tile: Tile;
  currentPlayerId: string;
  onSelect: (tileId: string) => void;
}

/**
 * A Tile component for a multiplayer Mahjong-style game.
 * Features smooth 3D flip animations and real-time state handling.
 */
const TileComponent: React.FC<TileProps> = ({ tile, currentPlayerId, onSelect }) => {
  // A tile is blocked if it's locked by someone else
  const isBlocked = !!tile.lockedBy && tile.lockedBy !== currentPlayerId;
  
  // A tile is clickable only if it's not already matched and not blocked by another player
  const isClickable = !tile.isMatched && !isBlocked;

  // The tile should show its face if it's flipped or already matched
  const isFaceUp = tile.isFlipped || tile.isMatched;

  const handleClick = () => {
    if (isClickable) {
      onSelect(tile.id);
    }
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
          transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Side (Face Down / Hidden) */}
        <div 
          className={`cyber-tile-front ${
            isBlocked ? 'cyber-tile-front-blocked' : 'cyber-tile-front-normal'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative pattern for the back of the tile */}
          <div className="cyber-tile-pattern">
            <div className="cyber-tile-pattern-inner" />
          </div>
        </div>

        {/* Back Side (Face Up / Symbol) */}
        <div 
          className={`cyber-tile-back ${
            tile.isMatched ? 'cyber-tile-back-matched' : ''
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <span className={`cyber-tile-symbol ${
            tile.isMatched ? 'cyber-tile-symbol-matched' : ''
          }`}>
            {tile.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

// Wrap with React.memo for performance optimization
export default memo(TileComponent);
