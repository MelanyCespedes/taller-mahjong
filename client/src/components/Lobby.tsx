import { useState } from 'react';

interface LobbyProps {
  joinGame: (name: string) => void;
  gameFull: boolean;
}

export default function Lobby({ joinGame, gameFull }: LobbyProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (name.trim() === '') {
      setError('Ingresa tu nombre antes de unirte.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center">
      <div className="bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-sm rounded-2xl p-10 w-full max-w-md flex flex-col items-center gap-6">

        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
          🀄
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black tracking-widest text-white uppercase italic">
            Mahjong Multijugador
          </h1>
          <p className="text-xs text-white/60 font-bold uppercase tracking-[0.2em] mt-1">
            Introduce tu nombre para unirte al juego
          </p>
        </div>

        {gameFull ? (
          <div className="w-full bg-pink-900/30 border border-pink-500/50 rounded-xl px-5 py-4 text-center">
            <p className="text-pink-400 text-sm font-black uppercase tracking-widest">
              Partida llena
            </p>
            <p className="text-pink-300/70 text-xs font-bold mt-1">
              Ya hay 5 jugadores conectados. Intenta más tarde.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={20}
              className="w-full bg-slate-800/80 border border-cyan-500/30 text-white placeholder-slate-500 rounded-xl px-4 py-3 font-bold tracking-wide focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95 shadow-lg"
            >
              Únete al juego
            </button>
            {error && (
              <p className="text-pink-400 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
