import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle, ExternalLink, Cpu, Code2, Search, Palette, Megaphone } from 'lucide-react';

const SkillMatrix = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:3001/skills');
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'web development': return <Code2 size={20} />;
      case 'job search': return <Search size={20} />;
      case 'web design': return <Palette size={20} />;
      case 'outreach': return <Megaphone size={20} />;
      default: return <Cpu size={20} />;
    }
  };

  if (loading) return null;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Layers size={20} className="text-indigo-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Active Skill Matrix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, i) => (
          <div key={i} className="group p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-slate-950 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                {getIcon(skill.name)}
              </div>
              {skill.type === 'static' && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <CheckCircle size={8} className="text-emerald-500" />
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Verified</span>
                </div>
              )}
            </div>
            
            <h3 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 italic italic-opacity-80">
              {skill.description}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              {skill.tools?.map((tool, j) => (
                <span key={j} className="text-[9px] px-2 py-0.5 bg-slate-950/50 border border-slate-800 rounded-md text-slate-500 font-mono">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {/* Placeholder for new skills */}
        <div className="p-4 border border-dashed border-slate-700/50 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="p-2 bg-slate-900 rounded-lg">
            <ExternalLink size={20} className="text-slate-500" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Add New Expansion</span>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
