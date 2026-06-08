import React, { useState, useRef, useEffect } from 'react';
import { Play, Settings, Package, User, Trophy, ShoppingCart, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { MedievalPanel, MedievalButton, medievalBg, goldText, mutedText } from './MedievalPanel';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  onOpenMarket: () => void;
  onOpenInventory: () => void;
  coins: number;
  onSetCoins: (coins: number) => void;
}

const PRESET_AMOUNTS = [0, 500, 1000, 5000, 10000, 50000, 99999];

export function MainMenu({ onStartGame, onOpenSettings, onOpenProfile, onOpenLeaderboard, onOpenMarket, onOpenInventory, coins, onSetCoins }: MainMenuProps) {
  const [devOpen, setDevOpen] = useState(false);
  const [inputValue, setInputValue] = useState(String(coins));
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(String(coins)); }, [coins]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setDevOpen(false);
    }
    if (devOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [devOpen]);

  const applyInput = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 0) onSetCoins(val);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      {/* Stone texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)' }} />

      {/* Torch glow effects */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.12) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.08) 0%, transparent 70%)', transform: 'translate(-50%, 30%)' }} />

      {/* Dev coin panel */}
      <div ref={panelRef} className="absolute top-3 left-3 z-50">
        <button
          onClick={() => setDevOpen(v => !v)}
          className="flex items-center gap-1.5 bg-black bg-opacity-60 hover:bg-opacity-80 text-green-400 text-xs font-mono px-3 py-1.5 rounded-lg border border-green-500 border-opacity-50 transition-all"
        >
          <FlaskConical size={13} />
          <span>DEV</span>
          {devOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {devOpen && (
          <div className="mt-1 bg-gray-900 border border-green-500 border-opacity-40 rounded-xl p-3 shadow-2xl w-56">
            <p className="text-green-400 text-xs font-mono mb-2 opacity-70">💰 Coin Ayarla</p>
            <div className="flex gap-1 mb-2">
              <input type="number" min={0} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyInput()} className="flex-1 bg-gray-800 text-green-300 text-xs font-mono px-2 py-1 rounded border border-gray-600 focus:border-green-500 outline-none w-0" />
              <button onClick={applyInput} className="bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded font-mono transition-colors">Set</button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {PRESET_AMOUNTS.map(amount => (
                <button key={amount} onClick={() => { onSetCoins(amount); setInputValue(String(amount)); }} className={`text-xs font-mono px-2 py-1 rounded transition-colors ${coins === amount ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-300 hover:bg-gray-700'}`}>{amount.toLocaleString()}</button>
              ))}
              <button onClick={() => { const v = coins + 1000; onSetCoins(v); setInputValue(String(v)); }} className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-yellow-300 hover:bg-gray-700 transition-colors col-span-2">+1,000</button>
            </div>
          </div>
        )}
      </div>

      {/* Title area */}
      <div className="flex flex-col items-center mb-8">
        {/* Decorative top border with spear shapes */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A227)' }} />
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon points="11,1 13,8 21,8 15,13 17,21 11,16 5,21 7,13 1,8 9,8" fill="none" stroke="#C9A227" strokeWidth="1.2" />
          </svg>
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A227)' }} />
        </div>

        <h1 style={{ ...goldText, fontSize: 52, letterSpacing: '0.12em', textShadow: '0 2px 16px rgba(200,160,30,0.5), 0 0 40px rgba(200,130,10,0.2)' }}>
          SPEAR THROW
        </h1>
        <p style={{ color: '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 13, letterSpacing: '0.3em', marginTop: 6 }}>
          AIM · PULL · STRIKE
        </p>

        <div className="flex items-center gap-3 mt-4">
          {/* Left spear pointing right */}
          <svg width="60" height="10" viewBox="0 0 60 10">
            <polygon points="0,5 8,1 8,4 54,4 54,3 60,5 54,7 54,6 8,6 8,9" fill="#C9A227" opacity="0.85" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="none" stroke="#C9A227" strokeWidth="1.2" />
            <circle cx="6" cy="6" r="1.5" fill="#C9A227" />
          </svg>
          {/* Right spear pointing left */}
          <svg width="60" height="10" viewBox="0 0 60 10">
            <polygon points="60,5 52,1 52,4 6,4 6,3 0,5 6,7 6,6 52,6 52,9" fill="#C9A227" opacity="0.85" />
          </svg>
        </div>
      </div>

      {/* Coin display */}
      <div className="flex items-center gap-2 mb-8 px-6 py-2 rounded-full" style={{ background: 'linear-gradient(to right, #3D2508, #5C3A10, #3D2508)', border: '1px solid #9B6A20' }}>
        <span style={{ fontSize: 18 }}>🪙</span>
        <span style={{ ...goldText, fontSize: 20, letterSpacing: '0.08em' }}>{coins.toLocaleString()}</span>
      </div>

      {/* Menu buttons */}
      <MedievalPanel className="px-8 py-6 w-full max-w-sm">
        <div className="flex flex-col gap-3">
          <MedievalButton onClick={onStartGame} variant="primary" className="w-full py-4 flex items-center justify-center gap-3">
            <Play size={20} fill="currentColor" />
            <span style={{ fontSize: 16, letterSpacing: '0.12em' }}>PLAY</span>
          </MedievalButton>

          <MedievalButton onClick={onOpenMarket} variant="gold" className="w-full py-3 flex items-center justify-center gap-2">
            <ShoppingCart size={16} />
            <span>Market</span>
          </MedievalButton>

          <div className="grid grid-cols-2 gap-2">
            <MedievalButton onClick={onOpenInventory} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-1.5">
              <Package size={14} />
              <span style={{ fontSize: 12 }}>Inventory</span>
            </MedievalButton>
            <MedievalButton onClick={onOpenSettings} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-1.5">
              <Settings size={14} />
              <span style={{ fontSize: 12 }}>Settings</span>
            </MedievalButton>
            <MedievalButton onClick={onOpenProfile} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-1.5">
              <User size={14} />
              <span style={{ fontSize: 12 }}>Profile</span>
            </MedievalButton>
            <MedievalButton onClick={onOpenLeaderboard} variant="secondary" className="w-full py-2.5 flex items-center justify-center gap-1.5">
              <Trophy size={14} />
              <span style={{ fontSize: 12 }}>Rankings</span>
            </MedievalButton>
          </div>
        </div>
      </MedievalPanel>

      <p style={{ ...mutedText, fontSize: 11, letterSpacing: '0.2em', marginTop: 24, fontFamily: '"Cinzel", serif' }}>
        VERSION 1.0
      </p>
    </div>
  );
}
