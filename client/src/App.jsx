import React, { useState } from 'react';
import ChatModule from './components/ChatModule';
import IdentityWidget from './components/IdentityWidget';
import SkillMatrix from './components/SkillMatrix';
import PortfolioView from './components/PortfolioView';
import { Terminal, ShieldCheck, Activity, Settings, Layout, MessageSquare, Menu, X } from 'lucide-react';
import './style.css';

function App() {
  const [lastActivity] = useState(new Date().toLocaleTimeString());
  const [currentView, setCurrentView] = useState('brain'); // 'brain' or 'portfolio'
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="h-screen w-screen bg-midnight text-slate-100 font-mono selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col overflow-hidden">
      {/* OS Header / Status Bar */}
      <div className="bg-slate-950 border-b border-indigo-500/20 px-6 py-2 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded transition-colors mr-2 text-indigo-400"
              title={isSidebarOpen ? "Sluit navigatie" : "Open navigatie"}
            >
              {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <span className="font-bold text-indigo-400">KDClaw OS v1.0.4-stable</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Tunnel: Active</span>
            <span className="flex items-center gap-1.5"><Activity size={12} /> Brain Heartbeat: Nominal</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>{lastActivity}</span>
          <Settings size={14} className="hover:text-indigo-400 cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`bg-slate-950/50 border-r border-slate-800 flex flex-col gap-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden border-none'}`}>
          <div className="space-y-4 min-w-[210px]">
            <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-2">
              Navigation
            </h3>
            <nav className="space-y-2">
              <button 
                onClick={() => setCurrentView('brain')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentView === 'brain' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <MessageSquare size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Brain Console</span>
              </button>
              <button 
                onClick={() => setCurrentView('portfolio')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentView === 'portfolio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <Layout size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Showcase</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto min-w-[210px]">
             <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                <span className="text-[10px] text-slate-500 uppercase block mb-2">Host Identity</span>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-neon-indigo-sm">K</div>
                   <div>
                      <p className="text-[11px] font-bold">Karel</p>
                      <p className="text-[9px] text-slate-600">Re-integration</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* LEFT COLUMN: Identity & Soul (3 cols) */}
            <div className={`lg:col-span-3 h-full flex flex-col space-y-8 overflow-y-auto pr-2 scrollbar-hide ${currentView === 'portfolio' ? 'hidden lg:block' : ''}`}>
               <div className="flex items-center gap-2 mb-2 shrink-0">
                  <Terminal size={18} className="text-indigo-400" />
                  <h1 className="text-xl font-bold tracking-tighter">PROTOCOLS</h1>
               </div>
               <div className="flex-1 min-h-0">
                  <IdentityWidget />
               </div>
            </div>

            {/* CENTER COLUMN: dynamic based on currentView (6 or 9 cols) */}
            <div className={`${currentView === 'portfolio' ? 'lg:col-span-9' : 'lg:col-span-6'} flex flex-col h-full min-h-0 overflow-hidden`}>
               {currentView === 'brain' ? <ChatModule /> : <PortfolioView />}
            </div>

            {/* RIGHT COLUMN: Skill Matrix (3 cols) */}
            {currentView === 'brain' && (
              <div className="lg:col-span-3 h-full flex flex-col space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                 <div className="flex items-center gap-2 mb-2 shrink-0">
                    <span className="text-indigo-500 font-bold">/</span>
                    <h2 className="text-xl font-bold tracking-tighter uppercase">Capacities</h2>
                 </div>
                 <div className="flex-1 min-h-0">
                    <SkillMatrix />
                 </div>
                 
                 <div 
                  onClick={() => setCurrentView('portfolio')}
                  className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 hover:bg-indigo-600/10 transition-all cursor-pointer group shrink-0"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Activate Showcase</h4>
                       <Layout size={16} className="text-slate-600 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Bekijk je volledig portfolio aan sites gegenereerd in de Athena Factory. Klik om de Showcase Engine te starten.
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>
      </div>
    </main>
  );
}

export default App;
