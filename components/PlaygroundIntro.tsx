
import React, { useEffect, useState } from 'react';

interface PlaygroundIntroProps {
  onComplete: () => void;
}

const PlaygroundIntro: React.FC<PlaygroundIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    // Wait for transition to finish before unmounting
    setTimeout(onComplete, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-[5500] bg-[#FAF9F6] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleComplete}
    >
      {/* Background Texture - Dot Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
            backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
            backgroundSize: '30px 30px'
        }}
      />

      {/* Background Elements - Floating Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full border-2 border-black/5 animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full border-2 border-black/5 animate-[float_10s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[40%] right-[25%] w-4 h-4 rounded-full bg-black/5 animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute bottom-[30%] left-[20%] w-6 h-6 rounded-full bg-black/5 animate-[float_7s_ease-in-out_infinite_0.5s]" />
          {/* A playful scribble line */}
          <svg className="absolute top-1/4 left-1/4 w-64 h-64 opacity-[0.03] animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2">
             <path d="M10,50 Q25,25 50,50 T90,50" />
          </svg>
      </div>

      <div className="flex flex-col items-center transform -translate-y-8 select-none relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold lowercase tracking-tight text-black mb-[-1vw] relative z-10 font-sans">
          welcome to maansi's
        </h2>
        <h1 className="text-[18vw] leading-[0.8] font-black lowercase tracking-tighter text-black font-anton scale-y-110">
          playground!
        </h1>
      </div>
      
      <div className="absolute bottom-12 text-center z-10">
        <p className="text-gray-400 font-bold text-xs md:text-sm tracking-widest uppercase animate-pulse font-sans">
          Press Enter to move to the next page
        </p>
      </div>
    </div>
  );
};

export default PlaygroundIntro;
