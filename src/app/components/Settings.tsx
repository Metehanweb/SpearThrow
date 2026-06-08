import React, { useState } from 'react';
import { ArrowLeft, Music, Volume2, Globe } from 'lucide-react';
import { MedievalPanel, MedievalDivider, MedievalButton, medievalBg, goldText, parchmentText, mutedText } from './MedievalPanel';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState(70);
  const [soundVolume, setSoundVolume] = useState(80);
  const [language, setLanguage] = useState('tr');

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={medievalBg}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)' }} />
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.1) 0%, transparent 70%)', transform: 'translate(-40%,-40%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,130,20,0.1) 0%, transparent 70%)', transform: 'translate(40%,40%)' }} />

      <MedievalPanel className="px-8 py-6 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 style={{ ...goldText, fontSize: 26, letterSpacing: '0.14em' }}>SETTINGS</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9B7A1A)' }} />
            <span style={{ color: '#9B7A1A', fontSize: 12 }}>⚙</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9B7A1A)' }} />
          </div>
        </div>

        {/* Music Volume */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Music size={18} style={{ color: '#C9A227' }} />
            <span style={{ ...parchmentText, fontSize: 13 }}>Music Volume</span>
            <span className="ml-auto" style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 13 }}>{musicVolume}%</span>
          </div>
          <div className="relative h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(155,122,26,0.3)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${musicVolume}%`, background: 'linear-gradient(to right, #9B7A1A, #C9A227)' }} />
            <input type="range" min="0" max="100" value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
          </div>
        </div>

        <MedievalDivider />

        {/* Sound Effects Volume */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={18} style={{ color: '#C9A227' }} />
            <span style={{ ...parchmentText, fontSize: 13 }}>Sound Effects</span>
            <span className="ml-auto" style={{ color: '#C9A227', fontFamily: '"Cinzel", serif', fontSize: 13 }}>{soundVolume}%</span>
          </div>
          <div className="relative h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(155,122,26,0.3)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${soundVolume}%`, background: 'linear-gradient(to right, #9B7A1A, #C9A227)' }} />
            <input type="range" min="0" max="100" value={soundVolume} onChange={(e) => setSoundVolume(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
          </div>
        </div>

        <MedievalDivider />

        {/* Language */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} style={{ color: '#C9A227' }} />
            <span style={{ ...parchmentText, fontSize: 13 }}>Language</span>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg outline-none cursor-pointer"
            style={{ background: 'rgba(30,20,5,0.8)', border: '1px solid #9B7A1A', color: '#EDD9A3', fontFamily: '"Cinzel", serif', fontSize: 12 }}
          >
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="pt">🇵🇹 Português</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>

        <div className="flex gap-3">
          <MedievalButton onClick={onBack} variant="secondary" className="flex-1 py-2.5 flex items-center justify-center gap-1.5">
            <ArrowLeft size={14} />
            <span style={{ fontSize: 12 }}>Back</span>
          </MedievalButton>
          <MedievalButton onClick={onBack} variant="gold" className="flex-1 py-2.5">
            <span style={{ fontSize: 12 }}>Save</span>
          </MedievalButton>
        </div>
      </MedievalPanel>
    </div>
  );
}
