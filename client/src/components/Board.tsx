import React from 'react';
import Tile from './Tile';
import { Tile as TileType } from '../types';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  playerColors: Record<string, string>;
  selectTile: (tileId: string) => void;
}

const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, playerColors, selectTile }) => {
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
          playerColors={playerColors}
          onSelect={selectTile}
        />
      ))}
    </div>
  );
};

export default Board;
