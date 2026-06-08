import React, { useState, useRef, useCallback } from 'react';

interface BasketballProps {
  onScore: () => void;
  onReset: () => void;
  ballGradient: string;
  hoopHorizontal: number;
  hoopVertical: number;
}

export function Basketball({ onScore, onReset, ballGradient, hoopHorizontal, hoopVertical }: BasketballProps) {
  const [position, setPosition] = useState({ x: 100, y: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const ballRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const resetBall = useCallback(() => {
    setPosition({ x: 100, y: 400 });
    setIsFlying(false);
    setIsDragging(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFlying) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isFlying) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limit drag distance for slingshot effect
    const maxDistance = 150;
    const distance = Math.sqrt((newX - 100) ** 2 + (newY - 400) ** 2);
    
    if (distance <= maxDistance) {
      setPosition({ x: newX, y: newY });
    } else {
      const angle = Math.atan2(newY - 400, newX - 100);
      setPosition({
        x: 100 + Math.cos(angle) * maxDistance,
        y: 400 + Math.sin(angle) * maxDistance
      });
    }
  }, [isDragging, isFlying, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isFlying) return;
    
    setIsDragging(false);
    setIsFlying(true);

    // Calculate velocity based on drag distance
    const deltaX = 100 - position.x;
    const deltaY = 400 - position.y;
    const velocityX = deltaX * 0.4;
    const velocityY = deltaY * 0.4;

    // Physics animation
    let currentX = position.x;
    let currentY = position.y;
    let vx = velocityX;
    let vy = velocityY;
    const gravity = 0.8;
    const airFriction = 0.99;
    const groundFriction = 0.85;
    const bounceDamping = 0.7; // Energy loss on bounce (70% retained)
    const groundLevel = window.innerHeight - 150; // Ground position (above the green ground visual)
    const ballRadius = 28; // Half of ball size

    const animate = () => {
      // Apply air friction and gravity
      vx *= airFriction;
      vy += gravity;
      currentX += vx;
      currentY += vy;

      // Ground collision and bounce
      if (currentY + ballRadius >= groundLevel) {
        currentY = groundLevel - ballRadius; // Position on ground
        vy = -vy * bounceDamping; // Reverse and dampen velocity
        vx *= groundFriction; // Apply ground friction

        // Stop bouncing if velocity is too low
        if (Math.abs(vy) < 2) {
          vy = 0;
          // Reset if ball is stopped on ground and moving slowly
          if (Math.abs(vx) < 1) {
            setTimeout(() => {
              resetBall();
              onReset();
            }, 500);
            return;
          }
        }
      }

      setPosition({ x: currentX, y: currentY });

      // Check for hoop collision (rough approximation)
      const hoopX = window.innerWidth * (hoopHorizontal / 100);
      const hoopY = hoopVertical + 55; // Center of the hoop
      const distance = Math.sqrt((currentX - hoopX) ** 2 + (currentY - hoopY) ** 2);

      if (distance < 60 && vy > 0 && currentY > hoopY - 30 && currentY < hoopY + 30) {
        onScore();
        setTimeout(resetBall, 1000);
        return;
      }

      // Reset if ball goes off screen horizontally
      if (currentX < -100 || currentX > window.innerWidth + 100) {
        setTimeout(() => {
          resetBall();
          onReset();
        }, 500);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [isDragging, isFlying, position, onScore, onReset, resetBall]);

  // Add event listeners
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

  // Calculate trajectory direction
  const calculateTrajectory = () => {
    const deltaX = 100 - position.x;
    const deltaY = 400 - position.y;
    const velocityX = deltaX * 0.4;
    const velocityY = deltaY * 0.4;

    // Calculate arrow position (extended from ball in opposite direction of pull)
    const arrowDistance = 150;
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (magnitude === 0) return null;

    const normalizedX = velocityX / magnitude;
    const normalizedY = velocityY / magnitude;

    const arrowEndX = position.x + 28 + normalizedX * arrowDistance;
    const arrowEndY = position.y + 28 + normalizedY * arrowDistance;

    // Calculate pull strength (0 to 150 max distance)
    const pullDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxPullDistance = 150;
    const pullStrength = Math.min(pullDistance / maxPullDistance, 1); // 0 to 1

    // Color based on pull strength: green -> yellow -> red
    let arrowColor;
    if (pullStrength < 0.5) {
      // Green to Yellow (0 to 0.5)
      const t = pullStrength * 2; // 0 to 1
      const r = Math.round(0 + (255 - 0) * t);
      const g = 255;
      const b = 0;
      arrowColor = `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to Red (0.5 to 1)
      const t = (pullStrength - 0.5) * 2; // 0 to 1
      const r = 255;
      const g = Math.round(255 - 255 * t);
      const b = 0;
      arrowColor = `rgb(${r}, ${g}, ${b})`;
    }

    return { arrowEndX, arrowEndY, angle: Math.atan2(velocityY, velocityX) * (180 / Math.PI), arrowColor, pullStrength };
  };

  const trajectory = isDragging ? calculateTrajectory() : null;

  return (
    <>
      {/* Slingshot line */}
      {isDragging && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <line
            x1={100 + 28}
            y1={400 + 28}
            x2={position.x + 28}
            y2={position.y + 28}
            stroke="#654321"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Trajectory arrow */}
      {isDragging && trajectory && (
        <svg
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9,
            overflow: 'visible'
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
            >
              <polygon points="0 0, 12 6, 0 12, 3 6" fill={trajectory.arrowColor} stroke="#000000" strokeWidth="0.5" />
            </marker>
          </defs>

          {/* Trajectory line (dashed) */}
          <line
            x1={position.x + 28}
            y1={position.y + 28}
            x2={trajectory.arrowEndX}
            y2={trajectory.arrowEndY}
            stroke={trajectory.arrowColor}
            strokeWidth="3"
            strokeDasharray="8,4"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
            opacity="0.9"
          />
        </svg>
      )}
      
      {/* Basketball */}
      <div
        ref={ballRef}
        className={`absolute w-14 h-14 rounded-full cursor-pointer transition-transform ${
          isDragging ? 'scale-110' : 'scale-100'
        }`}
        style={{
          left: position.x,
          top: position.y,
          background: ballGradient,
          boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.25), inset 6px 6px 12px rgba(255,200,150,0.4), 0 8px 16px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
        onMouseDown={handleMouseDown}
      >
      </div>
    </>
  );
}