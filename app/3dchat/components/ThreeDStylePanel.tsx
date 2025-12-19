
import React from 'react';
import { ThemeConfig } from '../../../types';
import { Layout, Smartphone, Phone, Video } from 'lucide-react';

interface ThreeDStylePanelProps {
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}

const ThreeDStylePanel: React.FC<ThreeDStylePanelProps> = ({ theme, setTheme }) => {
  const updateTheme = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col z-10 shadow-sm">
      <div className="h-14 flex items-center px-5 border-b border-gray-200 bg-white sticky top-0 z-20">
        <h2 className="text-xs font-bold text-gray-800 tracking-wide uppercase flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-600" /> Mobile Configuration
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="mb-8">
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Agent Profile</div>
           <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase mb-1.5 block">Display Name</label>
                <input 
                  type="text" 
                  value={theme.launcherTagText || 'Mark Hendry'}
                  onChange={(e) => updateTheme('launcherTagText', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase mb-1.5 block">Professional Title</label>
                <input 
                  type="text" 
                  value={theme.profileSubtitle || 'Delivery executive'}
                  onChange={(e) => updateTheme('profileSubtitle', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
           </div>
        </div>

        <div className="h-px bg-gray-100 my-6" />

        <div className="mb-8">
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Interaction Buttons</div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Phone className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Audio Call</span>
                 </div>
                 <input 
                    type="checkbox" 
                    checked={theme.showPhoneButton !== false}
                    onChange={(e) => updateTheme('showPhoneButton', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Video className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Video Call</span>
                 </div>
                 <input 
                    type="checkbox" 
                    checked={theme.showVideoButton !== false}
                    onChange={(e) => updateTheme('showVideoButton', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 />
              </div>
           </div>
        </div>

        <div className="mt-12 p-5 bg-blue-50 rounded-[2rem] border border-blue-100">
           <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Mobile First</span>
           </div>
           <p className="text-[10px] text-blue-900/50 leading-relaxed font-bold">
              This layout is optimized for portrait viewports. Some desktop features may be visually condensed.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDStylePanel;
