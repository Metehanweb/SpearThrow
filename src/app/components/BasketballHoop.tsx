import React from 'react';

interface BasketballHoopProps {
  horizontalPosition?: number;
  verticalPosition?: number;
}

export function BasketballHoop({ horizontalPosition = 75, verticalPosition = 250 }: BasketballHoopProps) {
  return (
    <div className="absolute transition-all duration-500" style={{ left: `${horizontalPosition}%`, top: `${verticalPosition}px`, transform: 'translateX(-50%)' }}>
      {/* Backboard */}
      <div className="relative">
        <div 
          className="bg-white border-4 border-red-600 rounded-lg"
          style={{ width: '120px', height: '80px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
        >
          {/* Backboard square */}
          <div 
            className="absolute border-2 border-red-600"
            style={{
              width: '40px',
              height: '30px',
              top: '25px',
              left: '40px'
            }}
          ></div>
        </div>
        
        {/* Hoop */}
        <div className="absolute" style={{ top: '55px', left: '35px' }}>
          <div 
            className="border-4 border-orange-600 rounded-full"
            style={{ 
              width: '50px', 
              height: '8px',
              background: 'linear-gradient(to bottom, #FF6347, #FF4500)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            }}
          ></div>
          
          {/* Net */}
          <div className="absolute" style={{ top: '4px', left: '5px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white"
                style={{
                  width: '2px',
                  height: '30px',
                  left: `${i * 5}px`,
                  transformOrigin: 'top',
                  transform: `rotate(${(i - 3.5) * 5}deg)`,
                  opacity: 0.8
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Pole */}
        <div
          className="absolute bg-gradient-to-r from-gray-700 to-gray-600"
          style={{
            width: '8px',
            height: '200px',
            left: '56px',
            top: '80px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.3)'
          }}
        ></div>
        
        {/* Base */}
        <div
          className="absolute bg-gradient-to-b from-gray-700 to-gray-800 rounded"
          style={{
            width: '60px',
            height: '20px',
            left: '30px',
            top: '280px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
          }}
        ></div>
      </div>
    </div>
  );
}