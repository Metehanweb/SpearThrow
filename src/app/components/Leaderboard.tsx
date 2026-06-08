import React from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { MedievalPanel, MedievalDivider, MedievalButton, medievalBg, goldText, parchmentText, mutedText } from './MedievalPanel';

interface LeaderboardProps {
  onBack: () => void;
  playerScore: number;
}

interface Player {
  name: string;
  score: number;
  rank: number;
}

export function Leaderboard({ onBack, playerScore }: LeaderboardProps) {
  const leaderboardData: Player[] = [
    { name: 'ProShooter99', score: 487, rank: 1 },
    { name: 'BasketMaster', score: 456, rank: 2 },
    { name: 'DunkKing', score: 423, rank: 3 },
    { name: 'SlamDunk', score: 398, rank: 4 },
    { name: 'HoopStar', score: 367, rank: 5 },
    { name: 'NetSwish', score: 342, rank: 6 },
    { name: 'AirJordan', score: 318, rank: 7 },
    { name: 'You', score: playerScore, rank: 8 },
  ];

  const rankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const podiumHeight = (rank: number) => {
    if (rank === 1) return 72;
    if (rank === 2) return 52;
    return 40;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)' }} />
      <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,162,39,0.12) 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }} />

      <MedievalPanel className="px-6 py-5 w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy size={22} style={{ color: '#C9A227' }} />
            <h1 style={{ ...goldText, fontSize: 22, letterSpacing: '0.14em' }}>HALL OF GLORY</h1>
            <Trophy size={22} style={{ color: '#C9A227' }} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9B7A1A)' }} />
            <span style={{ color: '#9B7A1A', fontSize: 12 }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9B7A1A)' }} />
          </div>
        </div>

        {/* Podium top 3 */}
        <div className="flex items-end justify-center gap-2 mb-5">
          {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((player, i) => {
            const displayRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isFirst = displayRank === 1;
            const podColor = isFirst ? 'linear-gradient(to bottom, #B8860B, #8B6914)' : displayRank === 2 ? 'linear-gradient(to bottom, #808080, #606060)' : 'linear-gradient(to bottom, #8B4513, #6B340E)';
            return (
              <div key={player.rank} className="flex flex-col items-center" style={{ marginBottom: isFirst ? 0 : 0 }}>
                <span style={{ fontSize: isFirst ? 16 : 13 }}>{rankMedal(displayRank)}</span>
                <p style={{ ...parchmentText, fontSize: isFirst ? 11 : 10, textAlign: 'center', marginTop: 2, maxWidth: 70 }}>{player.name}</p>
                <p style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 10 }}>{player.score} pts</p>
                <div className="w-20 flex items-center justify-center rounded-t-sm" style={{ height: podiumHeight(displayRank), background: podColor, border: '1px solid rgba(155,122,26,0.4)', borderBottom: 'none' }}>
                  <span style={{ color: 'rgba(255,220,120,0.8)', fontFamily: '"Cinzel", serif', fontSize: 20 }}>{displayRank}</span>
                </div>
              </div>
            );
          })}
        </div>

        <MedievalDivider />

        {/* Rest */}
        <div className="space-y-1.5">
          {leaderboardData.slice(3).map((player) => {
            const isYou = player.name === 'You';
            return (
              <div key={player.rank} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: isYou ? 'linear-gradient(to right, #5C3A10, #8B5A1A)' : 'rgba(0,0,0,0.25)', border: isYou ? '1px solid #C9A227' : '1px solid rgba(155,122,26,0.2)' }}>
                <div className="flex items-center gap-3">
                  <span style={{ color: '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 12, minWidth: 24 }}>#{player.rank}</span>
                  <span style={{ color: isYou ? '#EDD9A3' : '#C8A878', fontFamily: '"Cinzel", serif', fontSize: 12 }}>{player.name}{isYou && ' 👤'}</span>
                </div>
                <span style={{ color: isYou ? '#FFD700' : '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 12 }}>{player.score} pts</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <MedievalButton onClick={onBack} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-2">
            <ArrowLeft size={14} />
            <span style={{ fontSize: 12 }}>Back to Menu</span>
          </MedievalButton>
        </div>
      </MedievalPanel>
    </div>
  );
}
