
import React, { useEffect, useState } from 'react';
import { X, Gamepad2 } from 'lucide-react';

interface PlaygroundGuideProps {
  onClose: () => void;
  isOpen: boolean;
}

const PlaygroundGuide: React.FC<PlaygroundGuideProps> = ({ onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[6000] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 w-full max-w-xl rounded-3xl p-8 md:p-12 relative shadow-2xl transform transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
        >
          <X size={24} className="text-black dark:text-white group-hover:rotate-90 transition-transform" />
        </button>

        <div className="space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
               <Gamepad2 size={32} className="text-white" />
            </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
               Welcome to the<br/>Playground
             </h2>
             <p className="text-gray-500 text-lg font-light max-w-md mx-auto leading-relaxed">
               An experimental space where design meets AI. Explore the map to discover interactive zones.
             </p>
          </div>

          <button 
            onClick={onClose}
            className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-xl mt-4"
          >
            Enter Playground
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundGuide;
