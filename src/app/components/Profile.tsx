import React from 'react';
import { ArrowLeft, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { MedievalPanel, MedievalDivider, MedievalButton, medievalBg, goldText, parchmentText, mutedText } from './MedievalPanel';

interface ProfileProps {
  onBack: () => void;
  totalBaskets: number;
  totalMisses: number;
  coins: number;
}

export function Profile({ onBack, totalBaskets, totalMisses, coins }: ProfileProps) {
  const totalShots = totalBaskets + totalMisses;
  const accuracy = totalShots > 0 ? Math.round((totalBaskets / totalShots) * 100) : 0;

  const getRank = () => {
    if (totalBaskets >= 200) return { title: 'Legendary Lancer', color: '#FFD700' };
    if (totalBaskets >= 100) return { title: 'Master Spearman', color: '#C9A227' };
    if (totalBaskets >= 50) return { title: 'Knight of the Lance', color: '#A8A8C0' };
    if (totalBaskets >= 20) return { title: 'Spear Squire', color: '#CD7F32' };
    return { title: 'Recruit', color: '#9B7A40' };
  };

  const rank = getRank();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)' }} />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.1) 0%, transparent 70%)', transform: 'translate(40%,-40%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.1) 0%, transparent 70%)', transform: 'translate(-40%,40%)' }} />

      <MedievalPanel className="px-8 py-6 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #5C3A10, #9B7A1A)', border: '2px solid #C9A227', boxShadow: '0 0 20px rgba(200,162,39,0.3)' }}>
            <span style={{ fontSize: 28 }}>⚔</span>
          </div>
          <h1 style={{ ...goldText, fontSize: 22, letterSpacing: '0.14em' }}>WARRIOR PROFILE</h1>
          <p style={{ color: rank.color, fontFamily: '"Cinzel", serif', fontSize: 12, marginTop: 4, letterSpacing: '0.1em' }}>{rank.title}</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9B7A1A)' }} />
            <span style={{ color: '#9B7A1A', fontSize: 12 }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9B7A1A)' }} />
          </div>
        </div>

        {/* Coins */}
        <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(155,122,26,0.3)' }}>
          <span style={{ fontSize: 16 }}>🪙</span>
          <span style={{ ...goldText, fontSize: 16 }}>{coins.toLocaleString()} Gold</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: <Target size={18} />, label: 'Accuracy', value: `${accuracy}%`, color: '#4ade80', bg: 'rgba(20,80,20,0.45)', border: 'rgba(74,222,128,0.3)' },
            { icon: <TrendingUp size={18} />, label: 'Hits', value: totalBaskets, color: '#60a5fa', bg: 'rgba(15,40,90,0.5)', border: 'rgba(96,165,250,0.3)' },
            { icon: <TrendingDown size={18} />, label: 'Misses', value: totalMisses, color: '#f87171', bg: 'rgba(90,15,15,0.5)', border: 'rgba(248,113,113,0.3)' },
          ].map(({ icon, label, value, color, bg, border }) => (
            <div key={label} className="flex flex-col items-center py-3 rounded-lg" style={{ background: bg, border: `1px solid ${border}` }}>
              <div style={{ color }}>{icon}</div>
              <p style={{ color, fontFamily: '"Cinzel", serif', fontSize: 18, marginTop: 4 }}>{value}</p>
              <p style={{ ...mutedText, fontSize: 10, letterSpacing: '0.08em', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>

        <MedievalDivider />

        {/* Career stats */}
        <div className="mb-4 space-y-2">
          {[
            { label: 'Total Throws', value: totalShots },
            { label: 'Gold Earned', value: `${coins.toLocaleString()} 🪙` },
            { label: 'Battle Rating', value: accuracy >= 70 ? '🔥 Formidable' : accuracy >= 40 ? '⚔ Capable' : '🛡 Training' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-1">
              <span style={{ ...mutedText, fontSize: 12, fontFamily: '"Cinzel", serif' }}>{label}</span>
              <span style={{ ...parchmentText, fontSize: 12, fontFamily: '"Cinzel", serif' }}>{value}</span>
            </div>
          ))}
        </div>

        <MedievalButton onClick={onBack} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-2">
          <ArrowLeft size={14} />
          <span style={{ fontSize: 12 }}>Back to Menu</span>
        </MedievalButton>
      </MedievalPanel>
    </div>
  );
}
