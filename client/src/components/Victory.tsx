import { motion } from 'motion/react';
import { Player } from '../types';

interface VictoryProps {
  players: Player[];
  restartGame: () => void;
}

export default function Victory({ players, restartGame }: VictoryProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="cyber-layout flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className="text-7xl mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]"
      >
        🏆
      </motion.div>

      {/* Winner card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="relative bg-slate-900/90 border border-cyan-400/60 rounded-3xl p-10 flex flex-col items-center gap-3 shadow-[0_0_60px_rgba(34,211,238,0.25)] backdrop-blur-md w-full max-w-sm mb-10"
      >
        {/* Pulsing border glow */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-3xl border border-cyan-400/40 pointer-events-none"
        />

        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
          Campeón
        </span>

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="text-4xl font-black text-white tracking-wide text-center"
        >
          {winner.name}
        </motion.h2>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.7 }}
          className="flex flex-col items-center mt-2"
        >
          <span className="text-6xl font-black tabular-nums text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]">
            {winner.score}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">
            Créditos
          </span>
        </motion.div>
      </motion.div>

      {/* Rest of players */}
      {rest.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="w-full max-w-sm bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md"
        >
          <div className="px-6 py-4 border-b border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Clasificación Final
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {rest.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.35 }}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg border border-slate-700 text-slate-500">
                    {index + 2}
                  </span>
                  <span className="text-sm font-bold text-slate-300">
                    {player.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black tabular-nums text-slate-400">
                    {player.score}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black">
                    Créditos
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Restart button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rest.length > 0 ? 1.1 + rest.length * 0.1 : 1.0, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={restartGame}
        className="mt-8 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-colors"
      >
        Volver a Jugar
      </motion.button>
    </div>
  );
}
