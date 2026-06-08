import React from 'react';

interface TargetProps {
  horizontalPosition?: number;
  verticalPosition?: number;
  size?: number;
}

export function Target({ horizontalPosition = 75, verticalPosition = 250, size = 120 }: TargetProps) {
  const s = size;
  const s75 = s * 0.75;
  const s50 = s * 0.5;
  const s25 = s * 0.25;
  const off75 = (s - s75) / 2;
  const off50 = (s - s50) / 2;
  const off25 = (s - s25) / 2;

  return (
    <div
      className="absolute transition-all duration-500"
      style={{ left: `${horizontalPosition}%`, top: `${verticalPosition}px`, transform: 'translate(-50%, -50%)' }}
    >
      <div className="relative" style={{ width: `${s}px`, height: `${s}px` }}>
        <div
          className="absolute rounded-full bg-red-500"
          style={{ width: `${s}px`, height: `${s}px`, top: 0, left: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{ width: `${s75}px`, height: `${s75}px`, top: `${off75}px`, left: `${off75}px` }}
        />
        <div
          className="absolute rounded-full bg-blue-500"
          style={{ width: `${s50}px`, height: `${s50}px`, top: `${off50}px`, left: `${off50}px` }}
        />
        <div
          className="absolute rounded-full bg-yellow-400"
          style={{ width: `${s25}px`, height: `${s25}px`, top: `${off25}px`, left: `${off25}px` }}
        />
      </div>
    </div>
  );
}
