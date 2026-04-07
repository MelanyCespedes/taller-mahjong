import React from 'react';
import Tile from './Tile';
import { Tile as TileType } from '../types';

/**
 * Props for the Board component.
 */
interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  selectTile: (tileId: string) => void;
}

/**
 * A Board component for a multiplayer Mahjong-style game.
 * Renders a grid of tiles and handles tile selection.
 */
const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, selectTile }) => {
  if (tiles.length === 0) {
    return (
      <div className="cyber-board-empty">
        No hay flujos de datos disponibles
      </div>
    );
  }

  return (
    <div className="cyber-board-grid">
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          currentPlayerId={currentPlayerId}
          onSelect={selectTile}
        />
      ))}
    </div>
  );
};

export default Board;
