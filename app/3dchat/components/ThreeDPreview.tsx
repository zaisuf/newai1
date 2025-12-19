
import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, AgentConfig, ChatMessage } from '../../../types';
import { Send, MoreVertical } from 'lucide-react';
import { sendMessageToGemini } from '../../../services/geminiService';

interface ThreeDPreviewProps {
  theme: ThemeConfig;
  agentConfig?: AgentConfig;
  onClose?: () => void;
}

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({ theme, agentConfig, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', text: 'Check my delivery status.', timestamp: new Date() },
    { role: 'model', text: "Your package is processed. It's arriving today by 5 PM.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(
        input,
        agentConfig?.model || 'gemini-3-flash-preview',
        agentConfig?.systemInstruction,
        agentConfig?.temperature
      );
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sync error.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Neumorphic Styling Constants
  const baseBg = theme.chatBg || '#e0e5ec';
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* 3D Neumorphic Slab Container */}
      <div 
        className="w-full h-full rounded-[3rem] p-6 flex flex-col relative transition-all duration-500 overflow-hidden"
        style={{
          backgroundColor: baseBg,
          boxShadow: '18px 18px 30px #bebebe, -18px -18px 30px #ffffff',
        }}
      >
        
        {/* Header Area - Clean & Minimal */}
        <div className="flex items-center justify-between mb-4 px-2 shrink-0">
           <div className="flex flex-col">
              <h3 className="text-[14px] font-black tracking-tight text-gray-700" style={{ color: theme.headerText }}>
                 {theme.launcherTagText || 'Support Terminal'}
              </h3>
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Connected</p>
              </div>
           </div>
           <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] active:shadow-inner transition-all">
              <MoreVertical className="w-3.5 h-3.5" />
           </button>
        </div>

        {/* Recessed Message Area (Inner 3D) */}
        <div 
          className="flex-1 overflow-y-auto p-4 rounded-[2rem] space-y-4 custom-scrollbar mb-4"
          style={{
            backgroundColor: baseBg,
            boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff',
          }}
        >
           {messages.map((msg, i) => (
             <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                   className={`p-3.5 text-[11px] font-bold leading-relaxed transition-all duration-500 ${
                     msg.role === 'user' 
                     ? 'shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] rounded-2xl rounded-tr-none' 
                     : 'shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] rounded-2xl rounded-tl-none bg-white/40'
                   }`}
                   style={{
                     backgroundColor: msg.role === 'user' ? theme.userBubbleBg : baseBg,
                     color: msg.role === 'user' ? theme.userBubbleText : theme.botBubbleText,
                     maxWidth: '85%'
                   }}
                >
                   {msg.text}
                </div>
             </div>
           ))}

           {isLoading && (
              <div className="flex items-start">
                 <div className="p-3 px-4 rounded-2xl bg-white/20 flex gap-1.5 items-center">
                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Recessed Input Tray */}
        <div 
          className="flex items-center gap-2 p-1.5 rounded-[1.5rem] shrink-0"
          style={{
            backgroundColor: baseBg,
            boxShadow: 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff',
          }}
        >
           <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={theme.inputPlaceholder || "Type..."}
              className="flex-1 bg-transparent border-none text-[11px] font-bold focus:ring-0 outline-none px-3"
              style={{ color: theme.inputBarText }}
           />
           <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] active:shadow-inner active:scale-95 disabled:opacity-40"
              style={{ 
                backgroundColor: theme.sendButtonBg || baseBg, 
                color: theme.sendButtonIconColor || '#2563eb' 
              }}
           >
              <Send className="w-4 h-4 fill-current" />
           </button>
        </div>

        {/* Bottom Slab Branding - Minimal */}
        <div className="mt-4 flex justify-center opacity-20 shrink-0">
           <span className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-600">Neumorphic Core v3</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDPreview;
