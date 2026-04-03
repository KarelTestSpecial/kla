import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Layout, Clock, Search, Filter, Loader2 } from 'lucide-react';

const PortfolioView = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://localhost:3001/portfolio');
        const data = await response.json();
        setSites(data);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 size={40} className="animate-spin text-indigo-500" />
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Loading Factory Site Data...</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tighter uppercase">Showcase Engine</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono">Geverifieerde Athena CMS V9.2 implementaties</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Zoek in projecten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-all text-slate-300"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 overflow-y-auto pr-2 scrollbar-hide">
        {filteredSites.map((site) => (
          <div key={site.id} className="group flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all">
            {/* Mock-up Preview (Canvas based placeholder) */}
            <div className="h-48 bg-slate-950 flex items-center justify-center overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent"></div>
               <div className="p-8 transform group-hover:scale-110 transition-transform duration-500 opacity-20">
                  <Globe size={120} className="text-slate-800" />
               </div>
               <div className="absolute top-4 left-4 flex gap-1.5 font-mono">
                  <span className="text-[8px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">LIVE</span>
                  <span className="text-[8px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20">V9.2-LEGO</span>
               </div>
               <h3 className="absolute bottom-6 left-6 text-2xl font-bold tracking-tighter opacity-10 group-hover:opacity-40 transition-opacity">
                  {site.id.toUpperCase()}
               </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-100 mb-1 leading-none">{site.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-500">
                   <Clock size={10} />
                   <span className="text-[9px] uppercase tracking-wider">Laatst gebouwd: {new Date(site.lastBuild).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6 italic italic-opacity-80">
                {site.description}
              </p>

              <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800/50">
                <div className="flex flex-col">
                   <span className="text-[9px] text-slate-600 uppercase font-mono tracking-tighter">Stack</span>
                   <span className="text-[10px] text-indigo-400 font-mono">Vite + React</span>
                </div>
                <a 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-[10px] uppercase font-bold tracking-widest transition-all group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                >
                  <ExternalLink size={12} />
                  Bekijken
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;
