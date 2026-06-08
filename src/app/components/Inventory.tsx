import React, { useState } from 'react';
import { ArrowLeft, Check, Package } from 'lucide-react';
import { MedievalPanel, MedievalButton, medievalBg, goldText, parchmentText, mutedText } from './MedievalPanel';

interface InventoryProps {
  onBack: () => void;
  ownedSpears: string[];
  ownedMaps: string[];
  selectedSpear: string;
  selectedMap: string;
  onSelectSpear: (spearId: string) => void;
  onSelectMap: (mapId: string) => void;
}

const ALL_SPEARS = [
  { id: 'classic', name: 'Wooden Spear', gradient: 'linear-gradient(90deg, #8B4513, #A0522D)', coinBonus: 0 },
  { id: 'iron', name: 'Iron Spear', gradient: 'linear-gradient(90deg, #708090, #A9A9A9)', coinBonus: 2 },
  { id: 'steel', name: 'Steel Spear', gradient: 'linear-gradient(90deg, #4682B4, #5F9EA0)', coinBonus: 3 },
  { id: 'silver', name: 'Silver Spear', gradient: 'linear-gradient(90deg, #C0C0C0, #E8E8E8)', coinBonus: 5 },
  { id: 'gold', name: 'Golden Spear', gradient: 'linear-gradient(90deg, #FFD700, #FFA500)', coinBonus: 10 },
  { id: 'crystal', name: 'Crystal Spear', gradient: 'linear-gradient(90deg, #87CEEB, #00BFFF)', coinBonus: 7 },
  { id: 'obsidian', name: 'Obsidian Spear', gradient: 'linear-gradient(90deg, #2C2C2C, #1C1C1C)', coinBonus: 15 },
  { id: 'rainbow', name: 'Rainbow Spear', gradient: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)', coinBonus: 20 },
];

const ALL_MAPS = [
  { id: 'classic', name: 'Sunny Day', coinBonus: 0, preview: 'linear-gradient(to bottom, #60a5fa, #93c5fd, #4ade80)' },
  { id: 'sunset', name: 'Sunset Field', coinBonus: 5, preview: 'linear-gradient(to bottom, #fb923c, #f472b6, #a855f7)' },
  { id: 'night', name: 'Night Arena', coinBonus: 8, preview: 'linear-gradient(to bottom, #312e81, #581c87, #111827)' },
  { id: 'desert', name: 'Desert Heat', coinBonus: 10, preview: 'linear-gradient(to bottom, #fde047, #fb923c, #ca8a04)' },
  { id: 'space', name: 'Space Station', coinBonus: 12, preview: 'linear-gradient(to bottom, #000000, #581c87, #1e3a8a)' },
  { id: 'neon', name: 'Neon City', coinBonus: 15, preview: 'linear-gradient(to bottom, #22d3ee, #a855f7, #db2777)' },
];

const card: React.CSSProperties = { background: 'rgba(20,12,4,0.55)', border: '1px solid rgba(155,122,26,0.3)', borderRadius: 10, display: 'flex', flexDirection: 'column', position: 'relative' };
const cardSel: React.CSSProperties = { border: '1px solid #C9A227', boxShadow: '0 0 10px rgba(201,162,39,0.25)' };

export function Inventory({ onBack, ownedSpears, ownedMaps, selectedSpear, selectedMap, onSelectSpear, onSelectMap }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'spears' | 'maps'>('spears');

  const ownedSpearsList = ALL_SPEARS.filter(s => ownedSpears.includes(s.id));
  const ownedMapsList = ALL_MAPS.filter(m => ownedMaps.includes(m.id));

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }} />

      <MedievalPanel className="flex flex-col w-full max-w-4xl mx-4" style={{ maxHeight: '88vh' }}>
        {/* Header + tabs */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <h1 style={{ ...goldText, fontSize: 20, letterSpacing: '0.14em', textAlign: 'center', marginBottom: 12 }}>⚔ INVENTORY ⚔</h1>
          <div className="flex gap-2 justify-center">
            {(['spears', 'maps'] as const).map((tab) => {
              const active = activeTab === tab;
              const label = tab === 'spears' ? `⚔ Spears (${ownedSpearsList.length})` : `🗺 Maps (${ownedMapsList.length})`;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-1.5 rounded-lg transition-all"
                  style={{ background: active ? 'linear-gradient(to bottom, #8B1A1A, #5C0808)' : 'rgba(0,0,0,0.3)', border: active ? '1px solid #C84040' : '1px solid rgba(155,122,26,0.3)', color: active ? '#F5D090' : '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 11, letterSpacing: '0.06em' }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-4 overflow-y-auto" style={{ height: 320 }}>

          {/* Empty states */}
          {activeTab === 'spears' && ownedSpearsList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Package size={40} style={{ color: '#6B4E1A', marginBottom: 12 }} />
              <p style={{ ...mutedText, fontFamily: '"Cinzel", serif', fontSize: 13 }}>No spears in your arsenal</p>
              <p style={{ color: '#4A3010', fontSize: 10, fontFamily: '"Cinzel", serif', marginTop: 4 }}>Visit the Market to acquire weapons</p>
            </div>
          )}

          {activeTab === 'maps' && ownedMapsList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Package size={40} style={{ color: '#6B4E1A', marginBottom: 12 }} />
              <p style={{ ...mutedText, fontFamily: '"Cinzel", serif', fontSize: 13 }}>No maps unlocked</p>
              <p style={{ color: '#4A3010', fontSize: 10, fontFamily: '"Cinzel", serif', marginTop: 4 }}>Visit the Market to unlock battlegrounds</p>
            </div>
          )}

          {/* Spears grid */}
          {activeTab === 'spears' && ownedSpearsList.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {ownedSpearsList.map((spear) => {
                const isSel = selectedSpear === spear.id;
                return (
                  <div key={spear.id} className="p-2 flex flex-col" style={{ ...card, ...(isSel ? cardSel : {}), height: 130 }}>
                    {isSel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                    <div className="flex justify-center items-center flex-1">
                      <div className="w-16 h-2.5 rounded" style={{ background: spear.gradient, boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }} />
                    </div>
                    <p style={{ ...parchmentText, fontSize: 9, textAlign: 'center', marginTop: 4, marginBottom: 2, lineHeight: 1.3 }}>{spear.name}</p>
                    <div className="flex items-center justify-center h-4 mb-1.5">
                      {spear.coinBonus > 0 && <span style={{ color: '#C9A227', fontSize: 9, fontFamily: '"Cinzel", serif' }}>+{spear.coinBonus} 🪙</span>}
                    </div>
                    <MedievalButton onClick={() => onSelectSpear(spear.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1" disabled={isSel}>
                      <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                    </MedievalButton>
                  </div>
                );
              })}
            </div>
          )}

          {/* Maps grid */}
          {activeTab === 'maps' && ownedMapsList.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {ownedMapsList.map((map) => {
                const isSel = selectedMap === map.id;
                return (
                  <div key={map.id} className="p-2 flex flex-col" style={{ ...card, ...(isSel ? cardSel : {}), height: 130 }}>
                    {isSel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                    <div className="rounded overflow-hidden flex-1" style={{ background: map.preview, minHeight: 0 }} />
                    <p style={{ ...parchmentText, fontSize: 9, textAlign: 'center', marginTop: 5, marginBottom: 2, lineHeight: 1.3 }}>{map.name}</p>
                    <div className="flex items-center justify-center h-4 mb-1.5">
                      {map.coinBonus > 0 && <span style={{ color: '#C9A227', fontSize: 9, fontFamily: '"Cinzel", serif' }}>+{map.coinBonus} 🪙</span>}
                    </div>
                    <MedievalButton onClick={() => onSelectMap(map.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1" disabled={isSel}>
                      <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                    </MedievalButton>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 pb-5 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(155,122,26,0.2)' }}>
          <MedievalButton onClick={onBack} variant="secondary" className="flex items-center gap-2 px-5 py-2">
            <ArrowLeft size={14} />
            <span style={{ fontSize: 11 }}>Back to Menu</span>
          </MedievalButton>
        </div>
      </MedievalPanel>
    </div>
  );
}
