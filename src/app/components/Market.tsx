import React, { useState } from 'react';
import { ArrowLeft, Check, Zap } from 'lucide-react';
import { MedievalPanel, MedievalButton, medievalBg, goldText, parchmentText, mutedText } from './MedievalPanel';

interface Spear { id: string; name: string; price: number; gradient: string; coinBonus: number; }
interface MapItem { id: string; name: string; price: number; coinBonus: number; preview: string; }
interface Upgrade { id: string; name: string; description: string; price: number; spearCount: number; }
interface TargetUpgrade { id: string; name: string; description: string; price: number; type: 'size' | 'count'; value: number; }

interface MarketProps {
  onBack: () => void;
  coins: number;
  onPurchaseSpear: (spearId: string, price: number) => void;
  onPurchaseMap: (mapId: string, price: number) => void;
  onPurchaseUpgrade: (upgradeId: string, price: number) => void;
  onPurchaseTargetUpgrade: (upgradeId: string, price: number) => void;
  selectedUpgrade: string | null;
  onSelectUpgrade: (upgradeId: string) => void;
  selectedTargetSizeUpgrade: string | null;
  selectedTargetCountUpgrade: string | null;
  onSelectTargetUpgrade: (upgradeId: string) => void;
  ownedSpears: string[];
  ownedMaps: string[];
  ownedUpgrades: string[];
  ownedTargetUpgrades: string[];
  selectedSpear: string;
  selectedMap: string;
  onSelectSpear: (spearId: string) => void;
  onSelectMap: (mapId: string) => void;
}

const SPEARS: Spear[] = [
  { id: 'classic', name: 'Wooden Spear', price: 0, gradient: 'linear-gradient(90deg, #8B4513, #A0522D)', coinBonus: 0 },
  { id: 'iron', name: 'Iron Spear', price: 100, gradient: 'linear-gradient(90deg, #708090, #A9A9A9)', coinBonus: 2 },
  { id: 'steel', name: 'Steel Spear', price: 200, gradient: 'linear-gradient(90deg, #4682B4, #5F9EA0)', coinBonus: 3 },
  { id: 'silver', name: 'Silver Spear', price: 400, gradient: 'linear-gradient(90deg, #C0C0C0, #E8E8E8)', coinBonus: 5 },
  { id: 'gold', name: 'Golden Spear', price: 800, gradient: 'linear-gradient(90deg, #FFD700, #FFA500)', coinBonus: 10 },
  { id: 'crystal', name: 'Crystal Spear', price: 600, gradient: 'linear-gradient(90deg, #87CEEB, #00BFFF)', coinBonus: 7 },
  { id: 'obsidian', name: 'Obsidian Spear', price: 1500, gradient: 'linear-gradient(90deg, #2C2C2C, #1C1C1C)', coinBonus: 15 },
  { id: 'rainbow', name: 'Rainbow Spear', price: 2500, gradient: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)', coinBonus: 20 },
];

const MAPS: MapItem[] = [
  { id: 'classic', name: 'Sunny Day', price: 0, coinBonus: 0, preview: 'linear-gradient(to bottom, #60a5fa, #93c5fd, #4ade80)' },
  { id: 'sunset', name: 'Sunset Field', price: 300, coinBonus: 5, preview: 'linear-gradient(to bottom, #fb923c, #f472b6, #a855f7)' },
  { id: 'night', name: 'Night Arena', price: 500, coinBonus: 8, preview: 'linear-gradient(to bottom, #312e81, #581c87, #111827)' },
  { id: 'desert', name: 'Desert Heat', price: 700, coinBonus: 10, preview: 'linear-gradient(to bottom, #fde047, #fb923c, #ca8a04)' },
  { id: 'space', name: 'Space Station', price: 1000, coinBonus: 12, preview: 'linear-gradient(to bottom, #000000, #581c87, #1e3a8a)' },
  { id: 'neon', name: 'Neon City', price: 1500, coinBonus: 15, preview: 'linear-gradient(to bottom, #22d3ee, #a855f7, #db2777)' },
];

const THROW_UPGRADES: Upgrade[] = [
  { id: 'double', name: 'Double Throw', description: 'Throw 2 spears at once', price: 500, spearCount: 2 },
  { id: 'triple', name: 'Triple Throw', description: 'Throw 3 spears at once', price: 1200, spearCount: 3 },
  { id: 'quad', name: 'Quad Throw', description: 'Throw 4 spears at once', price: 2000, spearCount: 4 },
  { id: 'penta', name: 'Penta Throw', description: 'Throw 5 spears at once', price: 3500, spearCount: 5 },
];

const TARGET_UPGRADES: TargetUpgrade[] = [
  { id: 'target_large', name: 'Large Target', description: 'Target grows to 150px', price: 300, type: 'size', value: 150 },
  { id: 'target_giant', name: 'Giant Target', description: 'Target grows to 200px', price: 800, type: 'size', value: 200 },
  { id: 'target_double', name: 'Double Target', description: '2 targets appear at once', price: 600, type: 'count', value: 2 },
  { id: 'target_triple', name: 'Triple Target', description: '3 targets appear at once', price: 1500, type: 'count', value: 3 },
  { id: 'target_quad', name: 'Quad Target', description: '4 targets — chaos mode!', price: 3000, type: 'count', value: 4 },
];

type Tab = 'spears' | 'maps' | 'upgrades' | 'targets';

const card: React.CSSProperties = { background: 'rgba(20,12,4,0.55)', border: '1px solid rgba(155,122,26,0.3)', borderRadius: 10, display: 'flex', flexDirection: 'column', position: 'relative' };
const cardSel: React.CSSProperties = { border: '1px solid #C9A227', boxShadow: '0 0 10px rgba(201,162,39,0.25)' };

export function Market({
  onBack, coins,
  onPurchaseSpear, onPurchaseMap, onPurchaseUpgrade, onPurchaseTargetUpgrade,
  ownedSpears, ownedMaps, ownedUpgrades, ownedTargetUpgrades,
  selectedSpear, selectedMap, onSelectSpear, onSelectMap,
  selectedUpgrade, onSelectUpgrade,
  selectedTargetSizeUpgrade, selectedTargetCountUpgrade, onSelectTargetUpgrade,
}: MarketProps) {
  const [activeTab, setActiveTab] = useState<Tab>('spears');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'spears', label: 'Spears', icon: '⚔' },
    { key: 'maps', label: 'Maps', icon: '🗺' },
    { key: 'upgrades', label: 'Throw', icon: '⚡' },
    { key: 'targets', label: 'Targets', icon: '🎯' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }} />

      {/* Coin display */}
      <div className="absolute top-6 right-8 flex items-center gap-2 px-4 py-1.5 rounded-full z-20" style={{ background: 'linear-gradient(to right, #3D2508, #5C3A10)', border: '1px solid #9B6A20' }}>
        <span style={{ fontSize: 15 }}>🪙</span>
        <span style={{ ...goldText, fontSize: 14 }}>{coins.toLocaleString()}</span>
      </div>

      <MedievalPanel className="flex flex-col w-full max-w-5xl mx-4" style={{ maxHeight: '90vh' }}>
        {/* Header + tabs */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <h1 style={{ ...goldText, fontSize: 20, letterSpacing: '0.14em', textAlign: 'center', marginBottom: 12 }}>⚔ MARKET ⚔</h1>
          <div className="flex gap-2 justify-center">
            {tabs.map(({ key, label, icon }) => {
              const active = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)} className="px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  style={{ background: active ? 'linear-gradient(to bottom, #8B1A1A, #5C0808)' : 'rgba(0,0,0,0.3)', border: active ? '1px solid #C84040' : '1px solid rgba(155,122,26,0.3)', color: active ? '#F5D090' : '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 11, letterSpacing: '0.06em' }}>
                  <span>{icon}</span><span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-4 overflow-y-auto flex-1">

          {/* — SPEARS — */}
          {activeTab === 'spears' && (
            <div className="grid grid-cols-4 gap-2">
              {SPEARS.map((spear) => {
                const isOwned = ownedSpears.includes(spear.id);
                const isSel = selectedSpear === spear.id;
                const canAfford = coins >= spear.price;
                return (
                  <div key={spear.id} className="p-2.5" style={{ ...card, ...(isSel ? cardSel : {}) }}>
                    {isSel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                    <div className="flex justify-center mb-2 pt-1">
                      <div className="w-16 h-2.5 rounded" style={{ background: spear.gradient, boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }} />
                    </div>
                    <p style={{ ...parchmentText, fontSize: 9, textAlign: 'center', marginBottom: 3, lineHeight: 1.3 }}>{spear.name}</p>
                    <div className="flex items-center justify-center h-4 mb-2">
                      {spear.coinBonus > 0 && <span style={{ color: '#C9A227', fontSize: 9, fontFamily: '"Cinzel", serif' }}>+{spear.coinBonus} 🪙</span>}
                    </div>
                    {isOwned ? (
                      <MedievalButton onClick={() => onSelectSpear(spear.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1" disabled={isSel}>
                        <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                      </MedievalButton>
                    ) : (
                      <MedievalButton onClick={() => canAfford && onPurchaseSpear(spear.id, spear.price)} variant="primary" className="w-full py-1" disabled={!canAfford}>
                        <span style={{ fontSize: 9 }}>🪙 {spear.price}</span>
                      </MedievalButton>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* — MAPS — */}
          {activeTab === 'maps' && (
            <div className="grid grid-cols-3 gap-3">
              {MAPS.map((map) => {
                const isOwned = ownedMaps.includes(map.id);
                const isSel = selectedMap === map.id;
                const canAfford = coins >= map.price;
                return (
                  <div key={map.id} className="p-2.5" style={{ ...card, ...(isSel ? cardSel : {}) }}>
                    {isSel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                    <div className="mb-2 rounded overflow-hidden" style={{ height: 72, background: map.preview }} />
                    <p style={{ ...parchmentText, fontSize: 9, textAlign: 'center', marginBottom: 3, lineHeight: 1.3 }}>{map.name}</p>
                    <div className="flex items-center justify-center h-4 mb-2">
                      {map.coinBonus > 0 && <span style={{ color: '#C9A227', fontSize: 9, fontFamily: '"Cinzel", serif' }}>+{map.coinBonus} 🪙</span>}
                    </div>
                    {isOwned ? (
                      <MedievalButton onClick={() => onSelectMap(map.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1" disabled={isSel}>
                        <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                      </MedievalButton>
                    ) : (
                      <MedievalButton onClick={() => canAfford && onPurchaseMap(map.id, map.price)} variant="primary" className="w-full py-1" disabled={!canAfford}>
                        <span style={{ fontSize: 9 }}>🪙 {map.price}</span>
                      </MedievalButton>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* — THROW UPGRADES — */}
          {activeTab === 'upgrades' && (
            <div className="grid grid-cols-4 gap-3">
              {THROW_UPGRADES.map((upgrade) => {
                const isOwned = ownedUpgrades.includes(upgrade.id);
                const isSel = selectedUpgrade === upgrade.id;
                const canAfford = coins >= upgrade.price;
                return (
                  <div key={upgrade.id} className="p-3 flex flex-col" style={{ ...card, ...(isSel ? cardSel : {}) }}>
                    {isSel && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                    <div className="flex justify-center mb-2">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: isSel ? 'linear-gradient(135deg, #8B1A1A, #5C0808)' : 'rgba(60,30,10,0.6)', border: '1px solid rgba(155,122,26,0.4)' }}>
                        <Zap size={28} style={{ color: '#C9A227' }} />
                      </div>
                    </div>
                    <p style={{ ...parchmentText, fontSize: 11, textAlign: 'center', marginBottom: 3 }}>{upgrade.name}</p>
                    <p style={{ ...mutedText, fontSize: 9, textAlign: 'center', marginBottom: 6, lineHeight: 1.4 }}>{upgrade.description}</p>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {Array.from({ length: upgrade.spearCount }).map((_, i) => (
                        <div key={i} className="w-5 h-1 rounded-full" style={{ background: isSel ? 'linear-gradient(90deg, #9B7A1A, #C9A227)' : 'rgba(155,122,26,0.4)' }} />
                      ))}
                    </div>
                    <div className="mt-auto">
                      {isOwned ? (
                        <MedievalButton onClick={() => onSelectUpgrade(upgrade.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1.5">
                          <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                        </MedievalButton>
                      ) : (
                        <MedievalButton onClick={() => canAfford && onPurchaseUpgrade(upgrade.id, upgrade.price)} variant="primary" className="w-full py-1.5" disabled={!canAfford}>
                          <span style={{ fontSize: 9 }}>🪙 {upgrade.price}</span>
                        </MedievalButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* — TARGET UPGRADES — */}
          {activeTab === 'targets' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1" style={{ background: 'rgba(155,122,26,0.3)' }} />
                <span style={{ ...mutedText, fontSize: 9, letterSpacing: '0.2em' }}>TARGET SIZE</span>
                <div className="h-px flex-1" style={{ background: 'rgba(155,122,26,0.3)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {TARGET_UPGRADES.filter(u => u.type === 'size').map((upgrade) => {
                  const isOwned = ownedTargetUpgrades.includes(upgrade.id);
                  const isSel = selectedTargetSizeUpgrade === upgrade.id;
                  const canAfford = coins >= upgrade.price;
                  return (
                    <div key={upgrade.id} className="p-3 flex flex-col" style={{ ...card, ...(isSel ? cardSel : {}) }}>
                      {isSel && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                      <div className="flex justify-center items-center mb-2 h-16">
                        <div className="relative" style={{ width: 56, height: 56 }}>
                          <div className="absolute rounded-full bg-red-600" style={{ inset: 0 }} />
                          <div className="absolute rounded-full bg-white" style={{ inset: '14%' }} />
                          <div className="absolute rounded-full bg-blue-600" style={{ inset: '28%' }} />
                          <div className="absolute rounded-full" style={{ inset: '42%', background: '#C9A227' }} />
                        </div>
                      </div>
                      <p style={{ ...parchmentText, fontSize: 11, textAlign: 'center', marginBottom: 2 }}>{upgrade.name}</p>
                      <p style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 9, textAlign: 'center', marginBottom: 3 }}>{upgrade.value}px</p>
                      <p style={{ ...mutedText, fontSize: 9, textAlign: 'center', marginBottom: 6, lineHeight: 1.4 }}>{upgrade.description}</p>
                      {isOwned ? (
                        <MedievalButton onClick={() => onSelectTargetUpgrade(upgrade.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1.5">
                          <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                        </MedievalButton>
                      ) : (
                        <MedievalButton onClick={() => canAfford && onPurchaseTargetUpgrade(upgrade.id, upgrade.price)} variant="primary" className="w-full py-1.5" disabled={!canAfford}>
                          <span style={{ fontSize: 9 }}>🪙 {upgrade.price}</span>
                        </MedievalButton>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1" style={{ background: 'rgba(155,122,26,0.3)' }} />
                <span style={{ ...mutedText, fontSize: 9, letterSpacing: '0.2em' }}>TARGET COUNT</span>
                <div className="h-px flex-1" style={{ background: 'rgba(155,122,26,0.3)' }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TARGET_UPGRADES.filter(u => u.type === 'count').map((upgrade) => {
                  const isOwned = ownedTargetUpgrades.includes(upgrade.id);
                  const isSel = selectedTargetCountUpgrade === upgrade.id;
                  const canAfford = coins >= upgrade.price;
                  return (
                    <div key={upgrade.id} className="p-3 flex flex-col" style={{ ...card, ...(isSel ? cardSel : {}) }}>
                      {isSel && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#C9A227' }}><Check size={9} color="#1C0E04" /></div>}
                      <div className="flex justify-center gap-1 flex-wrap mb-2 min-h-[36px] items-center">
                        {Array.from({ length: upgrade.value }).map((_, i) => (
                          <div key={i} className="relative" style={{ width: 24, height: 24 }}>
                            <div className="absolute rounded-full bg-red-600" style={{ inset: 0 }} />
                            <div className="absolute rounded-full bg-white" style={{ inset: '16%' }} />
                            <div className="absolute rounded-full bg-blue-600" style={{ inset: '32%' }} />
                            <div className="absolute rounded-full" style={{ inset: '48%', background: '#C9A227' }} />
                          </div>
                        ))}
                      </div>
                      <p style={{ ...parchmentText, fontSize: 11, textAlign: 'center', marginBottom: 3 }}>{upgrade.name}</p>
                      <p style={{ ...mutedText, fontSize: 9, textAlign: 'center', marginBottom: 6, lineHeight: 1.4, flex: 1 }}>{upgrade.description}</p>
                      {isOwned ? (
                        <MedievalButton onClick={() => onSelectTargetUpgrade(upgrade.id)} variant={isSel ? 'gold' : 'secondary'} className="w-full py-1.5">
                          <span style={{ fontSize: 9 }}>{isSel ? '✓ Equipped' : 'Equip'}</span>
                        </MedievalButton>
                      ) : (
                        <MedievalButton onClick={() => canAfford && onPurchaseTargetUpgrade(upgrade.id, upgrade.price)} variant="primary" className="w-full py-1.5" disabled={!canAfford}>
                          <span style={{ fontSize: 9 }}>🪙 {upgrade.price}</span>
                        </MedievalButton>
                      )}
                    </div>
                  );
                })}
              </div>
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
