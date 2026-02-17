
import React from 'react';
import { ViewType } from '../types';
import { ArrowLeft, Map } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType | 'map';
  onViewChange: (view: ViewType | 'map') => void;
  onBack: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onBack }) => {
  
  const isMapMode = activeView === 'map';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Header */}
      <header className="h-20 glass absolute top-0 left-0 w-full z-50 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={isMapMode ? onBack : () => onViewChange('map')}
            className="group flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/10 text-white transition-all border border-transparent hover:border-white/10"
            title={isMapMode ? "Back to Portfolio" : "Back to Playground Map"}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                 <ArrowLeft size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">
                {isMapMode ? "Portfolio" : "Map"}
            </span>
          </button>

          <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white/90">
                Playground <span className="text-blue-500">2026</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
            {!isMapMode && (
                <div className="hidden md:flex gap-2">
                    <button onClick={() => onViewChange('map')} className="p-2 text-white/50 hover:text-white transition-colors" title="View Map">
                        <Map size={20} />
                    </button>
                </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">Gemini Online</span>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative pt-20">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
