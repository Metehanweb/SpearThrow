import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TIPS = [
  "Mızrağı ne kadar geri çekersen o kadar uzağa gider.",
  "Altın mızrak her isabette +10 coin bonus verir.",
  "Birden fazla hedefe aynı atışta isabet edebilirsin!",
  "Market'ten harita alarak coin bonusunu artır.",
  "Çoklu atış yükseltmesi ile aynı anda 5 mızrak fırlat.",
  "Hedef her atıştan sonra rastgele bir konuma taşınır.",
  "Doğruluk oranını yüksek tutmaya çalış!",
  "Crystal mızrak fiyat/performans açısından iyi bir seçim.",
  "Space haritası en yüksek coin bonusunu verir.",
  "Büyük hedef yükseltmesi isabet almayı kolaylaştırır.",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const totalDuration = 5000;
    const tickInterval = 80;
    const ticks = totalDuration / tickInterval;
    let current = 0;
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const remaining = 100 - current;
      const ticksLeft = ticks - tick;
      const increment = ticksLeft > 0 ? (remaining / ticksLeft) * (0.5 + Math.random()) : remaining;
      current = Math.min(current + increment, 100);
      setProgress(Math.floor(current));
      if (tick >= ticks) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => { setDone(true); setTimeout(onComplete, 350); }, 200);
      }
    }, tickInterval);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(175deg, #0D0B06 0%, #1C1409 25%, #141A0C 55%, #1A1208 80%, #0D0B06 100%)' }}
        >
          {/* Stone texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)' }} />

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,162,39,0.08) 0%, transparent 70%)' }} />
          </div>

          <div className="flex flex-col items-center gap-6 flex-1 justify-center relative z-10">
            {/* Spinning ring with spear icon */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(155,122,26,0.2)' }} />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid transparent', borderTopColor: '#C9A227', borderRightColor: 'rgba(201,162,39,0.3)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner spear icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-10 h-3">
                  <div className="absolute" style={{ left: 0, top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '14px solid #A8A8A8' }} />
                  <div className="absolute" style={{ left: 14, top: 3, width: 28, height: 6, background: 'linear-gradient(90deg, #8B4513, #C9A227)', borderRadius: 2 }} />
                  <div className="absolute" style={{ left: 40, top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #6B3510' }} />
                </div>
              </div>
            </div>

            {/* Game title */}
            <div className="text-center">
              <p style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 11, letterSpacing: '0.4em', marginBottom: 8 }}>SPEAR THROW</p>
              <motion.p
                key={progress}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                style={{ color: '#EDD9A3', fontFamily: '"Cinzel", serif', fontSize: 44, letterSpacing: '0.04em' }}
              >
                {progress}%
              </motion.p>
              <p style={{ color: '#6B4E1A', fontFamily: '"Cinzel", serif', fontSize: 9, letterSpacing: '0.4em', marginTop: 6 }}>PREPARING FOR BATTLE</p>
            </div>

            {/* Progress bar */}
            <div className="w-64 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(155,122,26,0.15)', border: '1px solid rgba(155,122,26,0.2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(to right, #9B7A1A, #C9A227)' }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Tip at bottom */}
          <div className="mb-16 px-8 max-w-sm text-center relative z-10">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(155,122,26,0.6))' }} />
              <p style={{ color: '#9B7A1A', fontFamily: '"Cinzel", serif', fontSize: 9, letterSpacing: '0.3em' }}>SAGE'S COUNSEL</p>
              <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(155,122,26,0.6))' }} />
            </div>
            <p style={{ color: '#8B6B30', fontFamily: '"Cinzel", serif', fontSize: 11, lineHeight: 1.7 }}>
              {TIPS[tipIndex]}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
