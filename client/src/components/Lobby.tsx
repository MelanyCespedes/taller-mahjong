import { useState } from 'react';

interface LobbyProps {
  joinGame: (name: string) => void;
}

export default function Lobby({ joinGame }: LobbyProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (name.trim() === '') {
      setError('Please enter your name before joining.');
      return;
    }
    setError('');
    joinGame(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="lobby">
      <h1>Mahjong Colaborativo</h1>
      <p>Enter your name to join the game</p>

      <div className="lobby-form">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
        />
        <button onClick={handleJoin}>Join Game</button>
      </div>

      {error && <p className="lobby-error">{error}</p>}
    </div>
  );
}
