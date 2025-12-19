"use client"
import React from 'react';
import ThreeDPreview from './components/ThreeDPreview';
import { Bot, X } from 'lucide-react';

interface EmbedWrapperProps {
  agent: any;
  mode: string;
  onOpen: () => void;
  onClose: () => void;
  showWelcome: boolean;
  setShowWelcome: (val: boolean) => void;
}

const ThreeDEmbed: React.FC<EmbedWrapperProps> = ({ agent, mode, onOpen, onClose, showWelcome, setShowWelcome }) => {
  if (!agent) return null;
  
  const theme = agent.theme || {};
  
  if (mode === 'launcher') {
    return (
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        {showWelcome && theme.showWelcomeBubbles && theme.welcomeMessage && (
          <div 
            className="relative max-w-[280px] p-5 pr-12 rounded-[28px] rounded-br-none shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/20 animate-[slideUp_0.5s_ease-out] cursor-pointer bg-[#e0e5ec]"
            style={{ backgroundColor: theme.launcherTagBg || '#e0e5ec' }}
            onClick={onOpen}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setShowWelcome(false); }} 
              className="absolute top-3 right-3 w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-50" style={{ color: theme.launcherTagText }}>{theme.launcherTagText || 'Assistant'}</p>
            <p className="text-[12px] font-bold text-slate-600 leading-relaxed" style={{ color: theme.launcherTagText }}>{theme.welcomeMessage}</p>
          </div>
        )}
        <button
          onClick={onOpen}
          className="w-18 h-18 rounded-[2rem] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] flex items-center justify-center transition-all hover:scale-105 active:scale-95 group bg-[#e0e5ec] border-4 border-white/40 overflow-hidden"
          style={{ backgroundColor: theme.launcherBg || '#e0e5ec' }}
        >
           {theme.launcherLogoUrl ? (
             <img src={theme.launcherLogoUrl} alt="Logo" className="w-full h-full object-cover" />
           ) : (
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20" style={{ backgroundColor: theme.launcherBg || '#2563eb' }}>
                <Bot className="w-6 h-6" style={{ color: theme.launcherIconColor || '#ffffff' }} />
             </div>
           )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-0 m-0 overflow-hidden">
      <ThreeDPreview 
        theme={theme} 
        agentConfig={agent.agentConfig || {}} 
        onClose={onClose} 
      />
    </div>
  );
};

export default ThreeDEmbed;