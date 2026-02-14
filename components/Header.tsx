
import React from 'react';
import { Rocket, Zap, Crown } from 'lucide-react';

interface HeaderProps {
  aiMode: boolean;
  onToggleAI: () => void;
}

const Header: React.FC<HeaderProps> = ({ aiMode, onToggleAI }) => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 p-2 rounded-lg">
            <Crown className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Promotor Blueprint</h1>
            <p className="text-xs font-medium text-zinc-500 tracking-widest uppercase">Misiunea ta ca CEO: <span className="text-zinc-100 font-bold">PROMOVEAZĂ</span></p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-full pl-4 pr-1">
            <span className="text-xs font-bold text-zinc-400 uppercase">Mod AI Entuziast</span>
            <button 
              onClick={onToggleAI}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${aiMode ? 'bg-purple-600' : 'bg-zinc-700'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${aiMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-zinc-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <Zap size={14} className="text-yellow-400" />
              <span>Status: ACTIV</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
