import React from 'react';

interface ThrowerProps {
  throwAngle?: number | null;
  left?: number;
}

// Default arm direction in SVG: shoulder(48,78) → hand(84,48) ≈ -40°
const DEFAULT_ARM_ANGLE = -40;

export function Thrower({ throwAngle = null, left = 20 }: ThrowerProps) {
  // Rotate the forward arm to match throw direction
  const armRotation = throwAngle !== null ? throwAngle - DEFAULT_ARM_ANGLE : 0;

  return (
    <div
      className="absolute"
      style={{ left: `${left}px`, bottom: '118px', width: '90px', height: '160px', zIndex: 8 }}
    >
      <svg
        viewBox="0 0 90 160"
        width="90"
        height="160"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="45" cy="158" rx="22" ry="5" fill="rgba(0,0,0,0.18)" />

        {/* Back leg */}
        <line x1="44" y1="112" x2="30" y2="150" stroke="#2d1a0e" strokeWidth="7" strokeLinecap="round" />
        <line x1="30" y1="150" x2="18" y2="152" stroke="#2d1a0e" strokeWidth="6" strokeLinecap="round" />

        {/* Front leg */}
        <line x1="44" y1="112" x2="58" y2="148" stroke="#3d2410" strokeWidth="7" strokeLinecap="round" />
        <line x1="58" y1="148" x2="72" y2="146" stroke="#3d2410" strokeWidth="6" strokeLinecap="round" />

        {/* Body */}
        <line x1="44" y1="72" x2="44" y2="112" stroke="#8B4513" strokeWidth="9" strokeLinecap="round" />
        <line x1="44" y1="75" x2="44" y2="108" stroke="#A0522D" strokeWidth="5" strokeLinecap="round" />

        {/* Back arm (winds up opposite to throw direction) */}
        <g
          style={{
            transformOrigin: '40px 78px',
            transform: `rotate(${armRotation * 0.4}deg)`,
            transition: throwAngle !== null ? 'transform 0.08s ease-out' : 'transform 0.3s ease',
          }}
        >
          <line x1="40" y1="78" x2="15" y2="65" stroke="#2d1a0e" strokeWidth="6" strokeLinecap="round" />
          <line x1="15" y1="65" x2="8" y2="50" stroke="#2d1a0e" strokeWidth="5" strokeLinecap="round" />
          <circle cx="8" cy="49" r="4" fill="#c68642" />
        </g>

        {/* Forward arm — follows spear angle */}
        <g
          style={{
            transformOrigin: '48px 78px',
            transform: `rotate(${armRotation}deg)`,
            transition: throwAngle !== null ? 'transform 0.08s ease-out' : 'transform 0.3s ease',
          }}
        >
          {/* upper arm */}
          <line x1="48" y1="78" x2="68" y2="65" stroke="#3d2410" strokeWidth="6" strokeLinecap="round" />
          {/* forearm */}
          <line x1="68" y1="65" x2="84" y2="48" stroke="#3d2410" strokeWidth="5" strokeLinecap="round" />
          {/* hand gripping spear */}
          <circle cx="84" cy="47" r="5" fill="#c68642" />
          <circle cx="84" cy="47" r="3" fill="#b8703a" />
        </g>

        {/* Neck */}
        <line x1="44" y1="56" x2="44" y2="68" stroke="#c68642" strokeWidth="7" strokeLinecap="round" />

        {/* Head */}
        <circle cx="44" cy="46" r="16" fill="#c68642" />
        <circle cx="44" cy="46" r="14" fill="#d4956a" />

        {/* Knight helmet — dome */}
        <ellipse cx="44" cy="40" rx="17" ry="18" fill="#5a6a7a" />
        <ellipse cx="44" cy="40" rx="15" ry="16" fill="#6e8090" />

        {/* Helmet top crest base */}
        <rect x="41" y="22" width="6" height="4" rx="2" fill="#4a5a6a" />
        {/* Crest plume */}
        <path d="M44,10 Q48,14 46,22 L42,22 Q40,14 44,10Z" fill="#8B1A1A" />
        <path d="M44,10 Q46,16 44.5,22 L43.5,22 Q42,16 44,10Z" fill="#C84040" opacity="0.6" />

        {/* Brow ridge */}
        <path d="M28,40 Q44,36 60,40" stroke="#4a5a6a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Cheek guards */}
        <path d="M29,40 Q27,50 30,56 Q36,60 44,60 Q52,60 58,56 Q61,50 59,40" fill="#5a6a7a" stroke="#4a5a6a" strokeWidth="1" />

        {/* Visor dark recess */}
        <rect x="30" y="41" width="28" height="11" rx="3" fill="#1a2530" />

        {/* Visor horizontal bars */}
        <rect x="30" y="41"   width="28" height="2.4" rx="1.2" fill="#364655" />
        <rect x="30" y="44.8" width="28" height="2.4" rx="1.2" fill="#364655" />
        <rect x="30" y="48.6" width="28" height="2.4" rx="1.2" fill="#364655" />

        {/* Eyes glowing amber through visor slits */}
        <circle cx="38" cy="45.5" r="1.6" fill="#ffaa00" opacity="0.8" />
        <circle cx="50" cy="45.5" r="1.6" fill="#ffaa00" opacity="0.8" />

        {/* Nose guard */}
        <rect x="42" y="52" width="4" height="9" rx="2" fill="#5a6a7a" stroke="#4a5a6a" strokeWidth="0.5" />

        {/* Helmet highlight */}
        <ellipse cx="37" cy="31" rx="5" ry="7" fill="rgba(255,255,255,0.13)" transform="rotate(-20,37,31)" />

        {/* Belt */}
        <rect x="36" y="107" width="16" height="5" rx="2" fill="#2d1a0e" />
        <rect x="42" y="106" width="5" height="7" rx="1" fill="#8B6914" />
      </svg>
    </div>
  );
}
