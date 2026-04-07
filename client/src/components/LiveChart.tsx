import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Player, ScoreSnapshot } from '../types';

/**
 * Props for the LiveChart component.
 */
interface LiveChartProps {
  scoreHistory: ScoreSnapshot[];
  players: Player[];
}

/**
 * A LiveChart component for a real-time multiplayer Mahjong-style game.
 * Visualizes player score history over time using Recharts.
 */
const LiveChart: React.FC<LiveChartProps> = ({ scoreHistory, players }) => {
  // Mock data for preview purposes
  const mockPlayers: Player[] = [
    { id: "1", name: "Jugador A", score: 2, isConnected: true },
    { id: "2", name: "Jugador B", score: 1, isConnected: true }
  ];

  const mockHistory: ScoreSnapshot[] = [
    {
      timestamp: Date.now() - 3000,
      scores: { "1": 0, "2": 0 }
    },
    {
      timestamp: Date.now() - 2000,
      scores: { "1": 1, "2": 0 }
    },
    {
      timestamp: Date.now() - 1000,
      scores: { "1": 1, "2": 1 }
    },
    {
      timestamp: Date.now(),
      scores: { "1": 2, "2": 1 }
    }
  ];

  // Use props if available, otherwise fallback to mock data
  const effectivePlayers = players?.length ? players : mockPlayers;
  const effectiveHistory = scoreHistory?.length ? scoreHistory : mockHistory;

  // Transform effectiveHistory into chart data
  const data = effectiveHistory.map(snapshot => ({
    time: snapshot.timestamp,
    ...snapshot.scores
  }));

  // Consistent color palette for players (Neon colors)
  const colors = ['#22d3ee', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  /**
   * Formats the timestamp for the X-axis.
   * Assuming timestamp is in milliseconds.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTime = (time: any) => {
    const date = new Date(Number(time));
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="cyber-chart-container">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="cyber-chart-title">Trayectoria de Puntuación</h3>
        {(!scoreHistory?.length && !players?.length) && (
          <span className="cyber-chart-badge">
            Simulación
          </span>
        )}
      </div>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime} 
              stroke="#475569" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              labelFormatter={formatTime}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderRadius: '12px', 
                border: '1px solid rgba(34,211,238,0.3)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                color: '#f1f5f9'
              }}
              itemStyle={{ fontSize: '11px', fontWeight: 800, padding: '2px 0' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="rect"
              wrapperStyle={{ fontSize: '10px', paddingBottom: '25px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            />
            {effectivePlayers.map((player, index) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.id}
                name={player.name}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: colors[index % colors.length] }}
                animationDuration={500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveChart;
