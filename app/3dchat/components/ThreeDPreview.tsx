
import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, AgentConfig, ChatMessage } from '../../../types';
import { Send, Phone, Video, Smile, Plus } from 'lucide-react';
import { sendMessageToGemini } from '../../../services/geminiService';

interface ThreeDPreviewProps {
  theme: ThemeConfig;
  agentConfig?: AgentConfig;
  onClose?: () => void;
}

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({ theme, agentConfig, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', text: 'Where is my delivery?', timestamp: new Date() },
    { role: 'model', text: "Hi! I'm tracking your order now. It's just two blocks away from your location.", timestamp: new Date() },
    { role: 'user', text: 'Great, thanks! Can I change the drop-off point?', timestamp: new Date() }
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
      setMessages(prev => [...prev, { role: 'model', text: 'Network calibration error.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative group">
      {/* iPhone Frame */}
      <div className="absolute inset-0 bg-white rounded-[3.5rem] border-[10px] border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-10">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-3xl z-30"></div>
        
        {/* Status Bar Mock */}
        <div className="h-10 flex items-center justify-between px-8 pt-2 shrink-0 bg-white">
           <span className="text-[10px] font-black">9:41</span>
           <div className="flex gap-1.5 items-center">
              <div className="w-3.5 h-2 bg-slate-300 rounded-[2px]"></div>
              <div className="w-3 h-3 border border-slate-300 rounded-full"></div>
           </div>
        </div>

        {/* Header - Configurable via Theme */}
        <div className="border-b border-slate-100 p-6 pt-2 flex items-center justify-between shrink-0" style={{ backgroundColor: theme.headerBg }}>
           <div className="flex items-center gap-3">
              <div 
                 className="w-12 h-12 rounded-full overflow-hidden border-2 p-0.5 bg-white shadow-sm"
                 style={{ borderColor: theme.profileBorderColor || '#f97316' }}
              >
                 <img 
                    src={theme.launcherLogoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=mark"} 
                    alt="profile" 
                    className="w-full h-full object-cover rounded-full" 
                 />
              </div>
              <div className="flex flex-col">
                 <h3 className="text-sm font-black tracking-tight leading-none mb-1" style={{ color: theme.headerText }}>
                    {theme.launcherTagText || 'Mark Hendry'}
                 </h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {theme.profileSubtitle || 'Delivery Executive'}
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              {theme.showPhoneButton !== false && (
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform" style={{ backgroundColor: theme.sendButtonBg }}>
                   <Phone className="w-4 h-4 fill-current" />
                </button>
              )}
              {theme.showVideoButton !== false && (
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform" style={{ backgroundColor: theme.sendButtonBg }}>
                   <Video className="w-4 h-4 fill-current" />
                </button>
              )}
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar" style={{ backgroundColor: theme.chatBg }}>
           {messages.map((msg, i) => (
             <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'model' && (
                   <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 mb-1">
                      <img src={theme.launcherLogoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=mark"} alt="mark" className="w-full h-full object-cover" />
                   </div>
                )}
                <div 
                   className={`p-4 text-xs font-semibold leading-relaxed shadow-sm transition-all duration-500 ${
                     msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none border border-slate-100'
                   }`}
                   style={{
                     backgroundColor: msg.role === 'user' ? theme.userBubbleBg : theme.botBubbleBg,
                     color: msg.role === 'user' ? theme.userBubbleText : theme.botBubbleText,
                     borderRadius: '24px',
                     maxWidth: msg.role === 'user' ? '80%' : '85%'
                   }}
                >
                   {msg.text}
                </div>
             </div>
           ))}

           {isLoading && (
              <div className="flex flex-col items-start">
                 <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 mb-1">
                    <img src={theme.launcherLogoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=mark"} alt="mark" className="w-full h-full object-cover" />
                 </div>
                 <div 
                   className="p-3 px-4 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1.5 items-center shadow-sm"
                   style={{ backgroundColor: theme.botBubbleBg }}
                 >
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.loadingColor }}></div>
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: theme.loadingColor }}></div>
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: theme.loadingColor }}></div>
                 </div>
              </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-5 pb-10 bg-white border-t border-slate-50 shrink-0">
           <div 
             className="flex items-center gap-3 p-2 pl-4 rounded-full border border-slate-100"
             style={{ backgroundColor: theme.inputBarBg }}
           >
              <button className="text-slate-400 hover:text-slate-600"><Smile className="w-5 h-5" /></button>
              <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder={theme.inputPlaceholder || "Type here..."}
                 className="flex-1 bg-transparent border-none text-xs font-bold focus:ring-0 outline-none"
                 style={{ color: theme.inputBarText }}
              />
              <button 
                 onClick={handleSend}
                 disabled={!input.trim()}
                 className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-50"
                 style={{ backgroundColor: theme.sendButtonBg, color: theme.sendButtonIconColor }}
              >
                 <Send className="w-4 h-4 fill-current ml-0.5" />
              </button>
           </div>
        </div>
      </div>

      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/5 blur-2xl rounded-full"></div>
    </div>
  );
};

export default ThreeDPreview;
