import React from 'react';

/** Shared parchment panel used across all medieval screens */
export function MedievalPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(160deg, #F7EDD0 0%, #EDD9A3 40%, #F2E4BF 70%, #E8D090 100%)',
        border: '2px solid #9B7A1A',
        boxShadow: '0 12px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,230,130,0.4), inset 0 -1px 0 rgba(100,60,0,0.3)',
      }}
    >
      {/* corner ornaments */}
      <div className="absolute top-2 left-2 w-4 h-4 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #9B7A1A 1.5px, transparent 1.5px)', backgroundSize: '4px 4px' }} />
      <div className="absolute top-2 right-2 w-4 h-4 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #9B7A1A 1.5px, transparent 1.5px)', backgroundSize: '4px 4px' }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #9B7A1A 1.5px, transparent 1.5px)', backgroundSize: '4px 4px' }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #9B7A1A 1.5px, transparent 1.5px)', backgroundSize: '4px 4px' }} />
      {children}
    </div>
  );
}

export function MedievalDivider() {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9B7A1A)' }} />
      <span style={{ color: '#9B7A1A', fontSize: 14 }}>✦</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9B7A1A)' }} />
    </div>
  );
}

export const medievalBg = {
  background: 'linear-gradient(175deg, #0D0B06 0%, #1C1409 25%, #141A0C 55%, #1A1208 80%, #0D0B06 100%)',
};

export const parchmentText = { color: '#2D1A06', fontFamily: '"Cinzel", serif' };
export const goldText = { color: '#C9A227', fontFamily: '"Cinzel", serif' };
export const mutedText = { color: '#6B4E1A' };

export function MedievalButton({
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    primary: {
      background: disabled
        ? 'linear-gradient(to bottom, #4A3020, #2E1C0C)'
        : 'linear-gradient(to bottom, #8B1A1A 0%, #6B1010 50%, #5C0808 100%)',
      border: '1px solid #C84040',
      color: disabled ? '#6B5030' : '#F5D090',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(139,26,26,0.5), inset 0 1px 0 rgba(255,180,100,0.25)',
    },
    secondary: {
      background: 'linear-gradient(to bottom, #5C3A10 0%, #3D2508 100%)',
      border: '1px solid #9B6A20',
      color: '#F5D090',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(200,160,60,0.2)',
    },
    gold: {
      background: 'linear-gradient(to bottom, #C9A227 0%, #9B7A10 100%)',
      border: '1px solid #FFD700',
      color: '#1C0E04',
      boxShadow: '0 4px 12px rgba(200,160,30,0.4), inset 0 1px 0 rgba(255,240,140,0.4)',
    },
    danger: {
      background: disabled
        ? 'linear-gradient(to bottom, #3A2820, #2A1A10)'
        : 'linear-gradient(to bottom, #6B1A10 0%, #4A0A08 100%)',
      border: '1px solid #9B3020',
      color: disabled ? '#5A4030' : '#F5C0A0',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(107,26,16,0.4)',
    },
    ghost: {
      background: 'rgba(60,40,10,0.3)',
      border: '1px solid rgba(180,140,40,0.4)',
      color: '#D4A840',
      boxShadow: 'none',
    },
  };
  const s = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 ${disabled ? 'cursor-not-allowed' : 'hover:brightness-110 hover:-translate-y-0.5'} ${className}`}
      style={{ ...s, fontFamily: '"Cinzel", serif', letterSpacing: '0.04em', fontSize: 13 }}
    >
      {children}
    </button>
  );
}
