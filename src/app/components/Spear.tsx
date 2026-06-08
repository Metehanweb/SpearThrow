import React, { useState, useRef, useCallback } from 'react';

interface SpearState {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

interface TargetInfo {
  horizontal: number;
  vertical: number;
}

interface SpearProps {
  onScore: () => void;
  onReset: () => void;
  spearGradient: string;
  targets: TargetInfo[];
  targetRadius: number;
  spearCount: number;
  onDragChange?: (angle: number | null) => void;
  originX: number;
  originY: number;
}

export function Spear({ onScore, onReset, spearGradient, targets, targetRadius, spearCount, onDragChange, originX, originY }: SpearProps) {
  const [position, setPosition] = useState({ x: originX, y: originY });
  const [flyingSpears, setFlyingSpears] = useState<SpearState[]>([]);
  // Default arm angle is ~-40deg (upper-right), spear starts aligned with arm
  const [rotation, setRotation] = useState(-40);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const spearRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const resetSpear = useCallback(() => {
    setPosition({ x: originX, y: originY });
    setFlyingSpears([]);
    setRotation(-40);
    setIsFlying(false);
    setIsDragging(false);
    onDragChange?.(null);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, [onDragChange, originX, originY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFlying) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isFlying) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const maxDistance = 150;
    const distance = Math.sqrt((newX - originX) ** 2 + (newY - originY) ** 2);
    if (distance <= maxDistance) {
      setPosition({ x: newX, y: newY });
    } else {
      const angle = Math.atan2(newY - originY, newX - originX);
      setPosition({ x: originX + Math.cos(angle) * maxDistance, y: originY + Math.sin(angle) * maxDistance });
    }
    const deltaX = originX - newX;
    const deltaY = originY - newY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    setRotation(angle);
    onDragChange?.(angle);
  }, [isDragging, isFlying, dragStart, onDragChange, originX, originY]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isFlying) return;
    setIsDragging(false);
    setIsFlying(true);
    onDragChange?.(null);

    const deltaX = originX - position.x;
    const deltaY = originY - position.y;
    const velocityX = deltaX * 0.4;
    const velocityY = deltaY * 0.4;

    const spreadAngle = 10;
    const baseAngle = Math.atan2(velocityY, velocityX);
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    const spearsData: Array<{ id: number; x: number; y: number; vx: number; vy: number; rotation: number; stuck: boolean }> = [];
    for (let i = 0; i < spearCount; i++) {
      const angleOffset = ((i - (spearCount - 1) / 2) * spreadAngle * Math.PI) / 180;
      const adj = baseAngle + angleOffset;
      spearsData.push({
        id: i,
        x: position.x,
        y: position.y,
        vx: Math.cos(adj) * magnitude,
        vy: Math.sin(adj) * magnitude,
        rotation: adj * (180 / Math.PI),
        stuck: false,
      });
    }

    const gravity = 0.8;
    const airFriction = 0.99;
    const groundFriction = 0.85;
    const bounceDamping = 0.7;
    const groundLevel = window.innerHeight - 150;
    const spearLength = 40;
    const hitTargets = new Set<number>();

    const animate = () => {
      let anyActive = false;

      spearsData.forEach((spear) => {
        if (spear.stuck) return;

        spear.vx *= airFriction;
        spear.vy += gravity;
        spear.x += spear.vx;
        spear.y += spear.vy;
        spear.rotation = Math.atan2(spear.vy, spear.vx) * (180 / Math.PI);

        if (spear.y + spearLength >= groundLevel) {
          spear.y = groundLevel - spearLength;
          spear.vy = -spear.vy * bounceDamping;
          spear.vx *= groundFriction;
          if (Math.abs(spear.vy) < 2) {
            spear.vy = 0;
            if (Math.abs(spear.vx) < 1) return;
          }
        }

        targets.forEach((t, idx) => {
          if (hitTargets.has(idx)) return;
          const tx = window.innerWidth * (t.horizontal / 100);
          const ty = t.vertical;
          const dist = Math.sqrt((spear.x - tx) ** 2 + (spear.y - ty) ** 2);
          if (dist < targetRadius * 0.5) {
            hitTargets.add(idx);
            spear.stuck = true;
            spear.vx = 0;
            spear.vy = 0;
            onScore();
          }
        });

        if (!spear.stuck && spear.x >= -100 && spear.x <= window.innerWidth + 100 && spear.y <= window.innerHeight + 100) {
          anyActive = true;
        }
      });

      setFlyingSpears(spearsData.map((s) => ({ id: s.id, x: s.x, y: s.y, rotation: s.rotation })));

      const allDone = spearsData.every(s => s.stuck || s.x < -100 || s.x > window.innerWidth + 100 || s.y > window.innerHeight + 100);

      if (!anyActive || allDone) {
        const anyHit = hitTargets.size > 0;
        setTimeout(() => {
          resetSpear();
          if (!anyHit) onReset();
        }, anyHit ? 1200 : 500);
        return;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [isDragging, isFlying, position, onScore, onReset, resetSpear, targets, targetRadius, spearCount, originX, originY]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const calculateTrajectory = () => {
    const deltaX = originX - position.x;
    const deltaY = originY - position.y;
    const velocityX = deltaX * 0.4;
    const velocityY = deltaY * 0.4;
    const arrowDistance = 150;
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (magnitude === 0) return null;
    const nx = velocityX / magnitude;
    const ny = velocityY / magnitude;
    const arrowEndX = position.x + 20 + nx * arrowDistance;
    const arrowEndY = position.y + 20 + ny * arrowDistance;
    const pullDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const pullStrength = Math.min(pullDistance / 150, 1);
    let arrowColor: string;
    if (pullStrength < 0.5) {
      const t = pullStrength * 2;
      arrowColor = `rgb(${Math.round(255 * t)}, 255, 0)`;
    } else {
      const t = (pullStrength - 0.5) * 2;
      arrowColor = `rgb(255, ${Math.round(255 - 255 * t)}, 0)`;
    }
    return { arrowEndX, arrowEndY, arrowColor };
  };

  const trajectory = isDragging ? calculateTrajectory() : null;

  const renderSpear = (x: number, y: number, rot: number, key: string | number) => (
    <div
      key={key}
      className="absolute"
      style={{ left: x, top: y, width: '80px', height: '12px', transform: `rotate(${rot}deg)`, transformOrigin: 'center', zIndex: 10, pointerEvents: 'none' }}
    >
      <div className="absolute" style={{ left: 0, top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '20px solid #C0C0C0' }} />
      <div className="absolute" style={{ left: '20px', top: '3px', width: '50px', height: '6px', background: spearGradient, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)' }} />
      <div className="absolute" style={{ left: '68px', top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '12px solid #8B4513' }} />
    </div>
  );

  return (
    <>
      {isDragging && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <line x1={originX + 20} y1={originY + 6} x2={position.x + 20} y2={position.y + 6} stroke="#654321" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}

      {isDragging && trajectory && (
        <svg className="absolute pointer-events-none" style={{ left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 9, overflow: 'visible' }}>
          <defs>
            <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
              <polygon points="0 0, 12 6, 0 12, 3 6" fill={trajectory.arrowColor} stroke="#000000" strokeWidth="0.5" />
            </marker>
          </defs>
          <line
            x1={position.x + 20} y1={position.y + 20}
            x2={trajectory.arrowEndX} y2={trajectory.arrowEndY}
            stroke={trajectory.arrowColor} strokeWidth="3" strokeDasharray="8,4" strokeLinecap="round" markerEnd="url(#arrowhead)" opacity="0.9"
          />
        </svg>
      )}

      {!isFlying && (
        <div
          ref={spearRef}
          className={`absolute cursor-pointer ${isDragging ? 'scale-110' : 'scale-100'}`}
          style={{ left: position.x, top: position.y, width: '80px', height: '12px', transform: `rotate(${rotation}deg)`, transformOrigin: 'center', zIndex: 10 }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute" style={{ left: 0, top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '20px solid #C0C0C0' }} />
          <div className="absolute" style={{ left: '20px', top: '3px', width: '50px', height: '6px', background: spearGradient, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)' }} />
          <div className="absolute" style={{ left: '68px', top: 0, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '12px solid #8B4513' }} />
        </div>
      )}

      {isFlying && flyingSpears.map((spear) => renderSpear(spear.x, spear.y, spear.rotation, spear.id))}
    </>
  );
}
