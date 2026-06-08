import React, { useState } from 'react';
import { Spear } from './Spear';
import { Target } from './Target';
import { MainMenu } from './MainMenu';
import { Settings } from './Settings';
import { Profile } from './Profile';
import { Leaderboard } from './Leaderboard';
import { Market } from './Market';
import { Inventory } from './Inventory';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LoadingScreen } from './LoadingScreen';
import { Thrower } from './Thrower';

export function Game() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'settings' | 'profile' | 'leaderboard' | 'market' | 'inventory'>('menu');
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [coins, setCoins] = useState(1000);
  const [totalBaskets, setTotalBaskets] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);
  const [ownedSpears, setOwnedSpears] = useState<string[]>(['classic']);
  const [selectedSpear, setSelectedSpear] = useState('classic');
  const [ownedMaps, setOwnedMaps] = useState<string[]>(['classic']);
  const [selectedMap, setSelectedMap] = useState('classic');
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);
  const [ownedTargetUpgrades, setOwnedTargetUpgrades] = useState<string[]>([]);
  const [selectedTargetSizeUpgrade, setSelectedTargetSizeUpgrade] = useState<string | null>(null);
  const [selectedTargetCountUpgrade, setSelectedTargetCountUpgrade] = useState<string | null>(null);
  const [targetPositions, setTargetPositions] = useState([{ horizontal: 70, vertical: 180 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [armAngle, setArmAngle] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'hit' | 'miss' | 'combo'; id: number } | null>(null);

  const getSpearCoinBonus = (spearId: string) => {
    const bonuses: Record<string, number> = { classic: 0, iron: 2, steel: 3, silver: 5, gold: 10, crystal: 7, obsidian: 15, rainbow: 20 };
    return bonuses[spearId] || 0;
  };

  const getMapCoinBonus = (mapId: string) => {
    const bonuses: Record<string, number> = { classic: 0, sunset: 5, night: 8, desert: 10, space: 12, neon: 15 };
    return bonuses[mapId] || 0;
  };

  const getSpearCount = () => {
    const counts: Record<string, number> = { double: 2, triple: 3, quad: 4, penta: 5 };
    if (selectedUpgrade && counts[selectedUpgrade]) return counts[selectedUpgrade];
    return 1;
  };

  const getTargetSize = () => selectedTargetSizeUpgrade ? 150 : 100;

  const getTargetCount = () => {
    const counts: Record<string, number> = { target_double: 2, target_triple: 3, target_quad: 4 };
    return counts[selectedTargetCountUpgrade ?? ''] ?? 1;
  };

  const generateSingleTargetPosition = (): { horizontal: number; vertical: number } => {
    let h: number, v: number, dist: number;
    const minDistance = 400;
    do {
      h = Math.random() * 50 + 40;
      v = Math.random() * 250 + 80;
      const launchX = window.innerWidth * 0.1;
      const targetX = window.innerWidth * (h / 100);
      dist = Math.sqrt((targetX - launchX) ** 2 + (v - 400) ** 2);
    } while (dist < minDistance);
    return { horizontal: h, vertical: v };
  };

  const randomizeTargetPositions = () => {
    const count = getTargetCount();
    const positions: { horizontal: number; vertical: number }[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(generateSingleTargetPosition());
    }
    setTargetPositions(positions);
  };

  const showFeedback = (text: string, type: 'hit' | 'miss' | 'combo') => {
    setFeedbackMsg({ text, type, id: Date.now() });
    setTimeout(() => setFeedbackMsg(null), 1200);
  };

  const handleScore = () => {
    setScore(prev => prev + 1);
    setShots(prev => prev + 1);
    setTotalBaskets(prev => prev + 1);
    setCombo(prev => {
      const next = prev + 1;
      const multiplier = next >= 25 ? 5 : next >= 10 ? 2 : next >= 3 ? 1.5 : 1;
      const base = 10 + getSpearCoinBonus(selectedSpear) + getMapCoinBonus(selectedMap);
      setCoins(c => c + Math.round(base * multiplier));
      if (next >= 3) {
        showFeedback(`${next}x COMBO!`, 'combo');
      } else {
        showFeedback('HIT!', 'hit');
      }
      return next;
    });
    setTimeout(() => randomizeTargetPositions(), 1000);
  };

  const handleReset = () => {
    setShots(prev => prev + 1);
    setTotalMisses(prev => prev + 1);
    setCombo(0);
    showFeedback('MISS', 'miss');
    randomizeTargetPositions();
  };

  const resetGame = () => { setScore(0); setShots(0); setCombo(0); };

  const handleStartGame = () => {
    const count = getTargetCount();
    const positions = Array.from({ length: count }, () => generateSingleTargetPosition());
    setTargetPositions(positions);
    resetGame();
    setGameState('playing');
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleBackToMenu = () => setGameState('menu');

  const handlePurchaseSpear = (spearId: string, price: number) => {
    if (coins >= price && !ownedSpears.includes(spearId)) {
      setCoins(prev => prev - price);
      setOwnedSpears(prev => [...prev, spearId]);
      setSelectedSpear(spearId);
    }
  };

  const handleSelectSpear = (spearId: string) => { if (ownedSpears.includes(spearId)) setSelectedSpear(spearId); };

  const handlePurchaseMap = (mapId: string, price: number) => {
    if (coins >= price && !ownedMaps.includes(mapId)) {
      setCoins(prev => prev - price);
      setOwnedMaps(prev => [...prev, mapId]);
      setSelectedMap(mapId);
    }
  };

  const handleSelectMap = (mapId: string) => { if (ownedMaps.includes(mapId)) setSelectedMap(mapId); };

  const handlePurchaseUpgrade = (upgradeId: string, price: number) => {
    if (coins >= price && !ownedUpgrades.includes(upgradeId)) {
      setCoins(prev => prev - price);
      setOwnedUpgrades(prev => [...prev, upgradeId]);
      setSelectedUpgrade(upgradeId);
    }
  };

  const handleSelectUpgrade = (upgradeId: string) => {
    if (ownedUpgrades.includes(upgradeId)) {
      setSelectedUpgrade(prev => prev === upgradeId ? null : upgradeId);
    }
  };

  const handlePurchaseTargetUpgrade = (upgradeId: string, price: number) => {
    if (coins >= price && !ownedTargetUpgrades.includes(upgradeId)) {
      setCoins(prev => prev - price);
      setOwnedTargetUpgrades(prev => [...prev, upgradeId]);
      const sizeIds = ['target_large', 'target_giant'];
      const countIds = ['target_double', 'target_triple', 'target_quad'];
      if (sizeIds.includes(upgradeId)) setSelectedTargetSizeUpgrade(upgradeId);
      if (countIds.includes(upgradeId)) setSelectedTargetCountUpgrade(upgradeId);
    }
  };

  const handleSelectTargetUpgrade = (upgradeId: string) => {
    const sizeIds = ['target_large', 'target_giant'];
    const countIds = ['target_double', 'target_triple', 'target_quad'];
    if (sizeIds.includes(upgradeId)) {
      setSelectedTargetSizeUpgrade(prev => prev === upgradeId ? null : upgradeId);
    }
    if (countIds.includes(upgradeId)) {
      setSelectedTargetCountUpgrade(prev => prev === upgradeId ? null : upgradeId);
    }
  };

  const getSpearGradient = (spearId: string) => {
    const gradients: Record<string, string> = {
      classic: 'linear-gradient(90deg, #8B4513, #A0522D)',
      iron: 'linear-gradient(90deg, #708090, #A9A9A9)',
      steel: 'linear-gradient(90deg, #4682B4, #5F9EA0)',
      silver: 'linear-gradient(90deg, #C0C0C0, #E8E8E8)',
      gold: 'linear-gradient(90deg, #FFD700, #FFA500)',
      crystal: 'linear-gradient(90deg, #87CEEB, #00BFFF)',
      obsidian: 'linear-gradient(90deg, #2C2C2C, #1C1C1C)',
      rainbow: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
    };
    return gradients[spearId] || gradients.classic;
  };

  const getMapGradient = (mapId: string) => {
    const gradients: Record<string, string> = {
      classic: 'bg-gradient-to-b from-blue-400 via-blue-300 to-green-400',
      sunset: 'bg-gradient-to-b from-orange-400 via-pink-400 to-purple-500',
      night: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900',
      desert: 'bg-gradient-to-b from-yellow-300 via-orange-400 to-yellow-600',
      space: 'bg-gradient-to-b from-black via-purple-900 to-blue-900',
      neon: 'bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-600',
    };
    return gradients[mapId] || gradients.classic;
  };

  const targetSize = getTargetSize();

  // Spear div is 80x12px, transformOrigin center → center is at (originX+40, originY+6)
  // Thrower SVG hand is at (84, 47); thrower top = innerHeight - 128 - 160 = innerHeight - 288
  // Hand screen y = innerHeight - 288 + 47 = innerHeight - 241
  // Align spear center with hand: originX+40 = handScreenX, originY+6 = handScreenY
  // → originY = handScreenY - 6 = innerHeight - 247
  // → throwerLeft = handScreenX - 84 = originX + 40 - 84 = originX - 44
  const originX = 80;
  const originY = window.innerHeight - 237;
  const throwerLeft = originX - 44; // = 36, so hand SVG(84) lands at originX+40

  const renderPage = () => {
    switch (gameState) {
      case 'settings':
        return <Settings onBack={handleBackToMenu} />;
      case 'market':
        return (
          <Market
            onBack={handleBackToMenu}
            coins={coins}
            onPurchaseSpear={handlePurchaseSpear}
            onPurchaseMap={handlePurchaseMap}
            onPurchaseUpgrade={handlePurchaseUpgrade}
        selectedUpgrade={selectedUpgrade}
        onSelectUpgrade={handleSelectUpgrade}
            onPurchaseTargetUpgrade={handlePurchaseTargetUpgrade}
        selectedTargetSizeUpgrade={selectedTargetSizeUpgrade}
        selectedTargetCountUpgrade={selectedTargetCountUpgrade}
        onSelectTargetUpgrade={handleSelectTargetUpgrade}
            ownedSpears={ownedSpears}
            ownedMaps={ownedMaps}
            ownedUpgrades={ownedUpgrades}
            ownedTargetUpgrades={ownedTargetUpgrades}
            selectedSpear={selectedSpear}
            selectedMap={selectedMap}
            onSelectSpear={handleSelectSpear}
            onSelectMap={handleSelectMap}
          />
        );
      case 'inventory':
        return (
          <Inventory
            onBack={handleBackToMenu}
            ownedSpears={ownedSpears}
            ownedMaps={ownedMaps}
            selectedSpear={selectedSpear}
            selectedMap={selectedMap}
            onSelectSpear={handleSelectSpear}
            onSelectMap={handleSelectMap}
          />
        );
      case 'profile':
        return <Profile onBack={handleBackToMenu} totalBaskets={totalBaskets} totalMisses={totalMisses} coins={coins} />;
      case 'leaderboard':
        return <Leaderboard onBack={handleBackToMenu} playerScore={totalBaskets} />;
      case 'menu':
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onOpenSettings={() => setGameState('settings')}
            onOpenProfile={() => setGameState('profile')}
            onOpenLeaderboard={() => setGameState('leaderboard')}
            onOpenMarket={() => setGameState('market')}
            onOpenInventory={() => setGameState('inventory')}
            coins={coins}
            onSetCoins={setCoins}
          />
        );
      default:
        return (
          <div className={`relative w-full h-screen overflow-hidden ${getMapGradient(selectedMap)}`}>
            {/* Back button */}
            <button
              onClick={handleBackToMenu}
              className="absolute top-6 left-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
              style={{ transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, #5C3A10, #3D2508)', border: '1px solid #9B6A20', color: '#F5D090', fontFamily: '"Cinzel", serif', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', letterSpacing: '0.06em' }}
            >
              <ArrowLeft size={15} />
              <span>Menu</span>
            </button>

            <div className="absolute top-10 left-20 w-16 h-8 bg-white rounded-full opacity-70" />
            <div className="absolute top-16 left-32 w-12 h-6 bg-white rounded-full opacity-70" />
            <div className="absolute top-8 right-32 w-20 h-10 bg-white rounded-full opacity-70" />
            <div className="absolute top-20 right-16 w-14 h-7 bg-white rounded-full opacity-70" />
            <div className="absolute bottom-0 w-full h-32 bg-green-500" />

            {/* HUD panel */}
            <div className="absolute top-6 left-6 rounded-xl p-3 shadow-2xl" style={{ background: 'linear-gradient(160deg, rgba(30,18,5,0.92), rgba(20,12,3,0.95))', border: '1px solid rgba(155,122,26,0.5)', minWidth: 155 }}>
              <div className="flex items-center gap-1.5 mb-2 pb-2" style={{ borderBottom: '1px solid rgba(155,122,26,0.25)' }}>
                <span style={{ fontSize: 14 }}>🪙</span>
                <span style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 14 }}>{coins.toLocaleString()}</span>
              </div>
              <div className="space-y-1 mb-2">
                <div className="flex justify-between gap-4">
                  <span style={{ color: '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 10 }}>Score</span>
                  <span style={{ color: '#EDD9A3', fontFamily: '"Cinzel", serif', fontSize: 11 }}>{score}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 10 }}>Throws</span>
                  <span style={{ color: '#EDD9A3', fontFamily: '"Cinzel", serif', fontSize: 11 }}>{shots}</span>
                </div>
                {shots > 0 && (
                  <div className="flex justify-between gap-4">
                    <span style={{ color: '#9B7A40', fontFamily: '"Cinzel", serif', fontSize: 10 }}>Accuracy</span>
                    <span style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 11 }}>{Math.round((score / shots) * 100)}%</span>
                  </div>
                )}
              </div>
              <div className="pt-2 mb-2" style={{ borderTop: '1px solid rgba(155,122,26,0.25)' }}>
                {combo >= 3 && (
                  <p style={{ color: combo >= 25 ? '#ff4444' : combo >= 10 ? '#ff6600' : '#ff9900', fontFamily: '"Cinzel", serif', fontSize: 10, marginBottom: 2 }}>
                    🔥 {combo}x COMBO
                  </p>
                )}
                <p style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 10 }}>
                  +{Math.round((10 + getSpearCoinBonus(selectedSpear) + getMapCoinBonus(selectedMap)) * (combo >= 25 ? 5 : combo >= 10 ? 2 : combo >= 3 ? 1.5 : 1))} 🪙 per hit
                  {combo >= 25 && <span style={{ color: '#ff4444', fontSize: 9 }}> (5×)</span>}
                  {combo >= 10 && combo < 25 && <span style={{ color: '#ff6600', fontSize: 9 }}> (2×)</span>}
                  {combo >= 3 && combo < 10 && <span style={{ color: '#ff9900', fontSize: 9 }}> (1.5×)</span>}
                </p>
              </div>
              <button onClick={resetGame} className="w-full py-1.5 rounded transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(to bottom, #8B1A1A, #5C0808)', border: '1px solid #C84040', color: '#F5D090', fontFamily: '"Cinzel", serif', fontSize: 9, letterSpacing: '0.06em' }}>
                Reset
              </button>
            </div>

            <Spear
              onScore={handleScore}
              onReset={handleReset}
              spearGradient={getSpearGradient(selectedSpear)}
              targets={targetPositions}
              targetRadius={targetSize}
              spearCount={getSpearCount()}
              onDragChange={setArmAngle}
              originX={originX}
              originY={originY}
            />

            {targetPositions.map((pos, i) => (
              <Target key={i} horizontalPosition={pos.horizontal} verticalPosition={pos.vertical} size={targetSize} />
            ))}

            <Thrower throwAngle={armAngle} left={throwerLeft} />

            {/* Feedback message */}
            <AnimatePresence>
              {feedbackMsg && (
                <motion.div
                  key={feedbackMsg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-40 left-1/2 pointer-events-none flex flex-col items-center"
                  style={{ transform: 'translateX(-50%)', zIndex: 40 }}
                >
                  <span style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: feedbackMsg.type === 'combo' ? 32 : 26,
                    letterSpacing: '0.12em',
                    color: feedbackMsg.type === 'miss' ? '#e05050' : feedbackMsg.type === 'combo' ? '#ff9900' : '#7fff7f',
                    textShadow: feedbackMsg.type === 'miss'
                      ? '0 0 16px rgba(220,50,50,0.8)'
                      : feedbackMsg.type === 'combo'
                      ? '0 0 20px rgba(255,153,0,0.9)'
                      : '0 0 16px rgba(100,255,100,0.8)',
                    WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                  }}>
                    {feedbackMsg.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  return (
    <div className="size-full overflow-hidden" style={{ background: '#000' }}>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
