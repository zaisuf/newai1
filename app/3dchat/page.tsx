
"use client"
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Palette, Bot, ArrowLeft, Eye, Check, Loader2 } from 'lucide-react';
import ThreeDColorPanel from './components/ThreeDColorPanel';
import ThreeDStylePanel from './components/ThreeDStylePanel';
import AgentPanel from '../../components/AgentPanel';
import ThreeDPreview from './components/ThreeDPreview';
import { ThemeConfig, AgentConfig } from '../../types';
import { saveAgent, fetchPublicAgent } from '../../services/firebaseService';

const ThreeDChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  const [activeTab, setActiveTab] = useState<'design' | 'agent'>('design');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [theme, setTheme] = useState<ThemeConfig>({
    fontFamily: 'Inter',
    borderRadius: 'rounded-[3rem]',
    containerShape: 'rounded',
    chatBg: '#e0e5ec',
    headerStyle: '3D Mobile',
    headerBg: '#e0e5ec',
    headerText: '#444444',
    headerAlignment: 'left',
    showStatusIndicator: true,
    footerStyle: 'Floating Pill',
    footerBg: '#e0e5ec',
    inputBarStyle: 'Modern',
    inputBarBg: '#e0e5ec',
    inputBarText: '#1e293b',
    inputPlaceholder: 'Type message...',
    sendButtonStyle: '3D Circle',
    sendButtonBg: '#e0e5ec',
    sendButtonIconColor: '#2563eb',
    responseCardStyle: 'Modern',
    botBubbleBg: '#e0e5ec',
    botBubbleText: '#334155',
    userBubbleBg: '#e0e5ec',
    userBubbleText: '#2563eb',
    loadingStyle: 'Three Dots',
    loadingColor: '#2563eb',
    showLauncher: true,
    launcherBg: '#2563eb',
    launcherIconColor: '#ffffff',
    launcherTagBg: '#1e293b',
    launcherTagText: 'Mark Hendry',
    welcomeMessage: "Hi, I'm Mark. How can I assist you today?",
    showWelcomeBubbles: true,
    suggestedQuestions: ["Check Order Status", "Speak to Human", "Product Details"],
    profileSubtitle: 'Support Agent',
    profileBorderColor: '#e0e5ec',
    showPhoneButton: false,
    showVideoButton: false
  });

  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are Mark Hendry, a helpful support assistant in a clean neumorphic UI. Be polite and concise.',
    knowledgeBase: '',
    temperature: 0.7,
    crawledUrls: []
  });

  useEffect(() => {
    const loadExistingAgent = async () => {
      if (!agentId) {
        setIsInitialLoading(false);
        return;
      }
      try {
        const data = await fetchPublicAgent(agentId);
        if (data) {
          if (data.theme) setTheme(prev => ({ ...prev, ...data.theme }));
          if (data.agentConfig) setAgentConfig(prev => ({ ...prev, ...data.agentConfig }));
        }
      } catch (err) {
        console.error("Failed to load existing agent unit:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadExistingAgent();
  }, [agentId]);

  const handlePublish = async () => {
    if (!agentId) return;
    setIsSaving(true);
    try {
      await saveAgent(agentId, {
        name: 'iPhone Neumorphic Unit',
        type: '3dchat',
        theme,
        agentConfig
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/my-agents');
      }, 1500);
    } catch (err) {
      alert("Error deploying unit.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen bg-[#fcfcfd] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black animate-bounce shadow-2xl">3D</div>
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">
          <Loader2 className="w-4 h-4 animate-spin" /> Rendering...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#fcfcfd] flex flex-col text-slate-900 overflow-hidden font-sans">
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/agent-widgets')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <ArrowLeft className="w-4 h-4" />
           </button>
           <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shadow-sm">B</div>
              <span className="font-black text-sm tracking-tight uppercase text-slate-800">3D Builder</span>
           </div>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Style
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'agent' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Intelligence
          </button>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handlePublish}
             disabled={isSaving}
             className={`px-8 py-2.5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 min-w-[120px] justify-center ${saveSuccess ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'}`}
           >
              {isSaving ? 'Syncing...' : saveSuccess ? <><Check className="w-3.5 h-3.5 stroke-[3px]" /> Ready</> : 'Deploy Unit'}
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex w-full h-full">
            {activeTab === 'design' ? (
                <ThreeDColorPanel theme={theme} setTheme={setTheme} />
            ) : (
                <div className="hidden lg:block w-12 bg-white border-r border-slate-200"></div>
            )}
            
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-8">
                {/* Neumorphic Grid Background */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                <div className="relative z-10 transition-transform duration-500 hover:scale-[1.01] w-[380px] h-[500px]">
                   <ThreeDPreview theme={theme} agentConfig={agentConfig} />
                </div>
            </div>

            {activeTab === 'design' ? (
                <ThreeDStylePanel theme={theme} setTheme={setTheme} />
            ) : (
                <AgentPanel config={agentConfig} setConfig={setAgentConfig} />
            )}
        </div>
      </main>
    </div>
  );
};

export default ThreeDChatPage;
