import React, { useState, useEffect } from 'react';
import { Shield, BrainCircuit, History, Target, Loader2 } from 'lucide-react';

const IdentityWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const response = await fetch('http://localhost:3001/identity');
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch identity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdentity();
  }, []);

  if (loading) return (
    <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
      <Loader2 className="animate-spin text-indigo-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* SOUL Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Shield size={80} className="text-indigo-400" />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit size={20} className="text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Identity & Soul</h2>
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-indigo-400 prose-strong:text-slate-100 prose-p:text-slate-400">
          <p className="text-sm font-light leading-relaxed">
            {data?.soul ? data.soul.split('\n\n')[1]?.replace('## 1. Identity & Purpose\n', '') : 'Loading core protocols...'}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-800/50 flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Resilience</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1">
              <div className="w-[90%] h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Growth</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1">
              <div className="w-[75%] h-full bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* MEMORY Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <History size={20} className="text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Memory Log</h2>
        </div>
        
        <div className="space-y-3">
          {data?.memory ? data.memory.split('\n\n').slice(-3).reverse().map((log, i) => (
            <div key={i} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                {log.replace(/- \[Auto-Log .*\] /, '')}
              </p>
              <span className="text-[9px] text-slate-600 block mt-1 uppercase">
                {log.match(/\[Auto-Log (.*)\]/)?.[1]?.split('T')[0] || 'Recent'}
              </span>
            </div>
          )) : <p className="text-slate-600 text-xs italic">Searching for recall data...</p>}
        </div>
      </div>
      
      {/* STRATEGIC GOAL & STATUS */}
      <div className="space-y-4">
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6 flex gap-4 items-center">
          <div className="bg-indigo-500/20 p-3 rounded-xl">
            <Target className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Huidig Doel</h3>
            <p className="text-slate-200 text-sm font-medium mt-1">Financiële Onafhankelijkheid & Re-integratie</p>
          </div>
        </div>

        {data?.lastAction && (
          <div className={`border rounded-2xl p-4 flex justify-between items-center bg-slate-900/50 ${
            data.lastAction.status === 'success' ? 'border-emerald-500/30' : 'border-rose-500/30'
          }`}>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter mb-1">Last AI Action</span>
              <span className={`text-xs font-bold uppercase ${
                data.lastAction.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {data.lastAction.name.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-600 block">
                {new Date(data.lastAction.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-bold uppercase ${
                data.lastAction.status === 'success' ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {data.lastAction.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityWidget;
