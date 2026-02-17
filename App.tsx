
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ProjectModal from './components/ProjectModal';
import AboutPage from './components/AboutPage';
import ResumePage from './components/ResumePage';
import CategoryPage from './components/CategoryPage';
import WorkGalleryPage from './components/WorkGalleryPage';
import RubikCubeTransition from './components/RubikCubeTransition';
import PenToolBackground from './components/PenToolBackground';
import StarField from './components/StarField';
import { PROJECTS } from './constants';
import { Category, Project } from './types';
import { 
  ArrowUp, Info, Loader2, SkipForward, SkipBack, Moon, Sun, Mail, ArrowUpRight
} from 'lucide-react';

const TRACKS = [
  { 
    name: 'Ocean Waves', 
    url: 'https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3',
    mood: 'Peaceful' 
  },
  { 
    name: 'Deep Sea Calm', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mood: 'Serene' 
  }
];

const TICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
const tickAudio = new Audio(TICK_SOUND_URL);
tickAudio.volume = 0.2; 
tickAudio.preload = 'auto';

const PaperFilter = () => (
  <svg className="absolute w-0 h-0 pointer-events-none">
    <defs>
      <filter id="paper-roughness">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const BackgroundTexture = () => (
  <div className="fixed inset-0 z-[50] pointer-events-none mix-blend-overlay">
    <div 
      className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
      style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
      }} 
    />
  </div>
);

interface CategoryCardProps {
  category: string;
  customTitle?: string;
  image: string;
  index: number;
  year: string;
  onClick: () => void;
  onHover: () => void;
  imageStyle?: React.CSSProperties;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, customTitle, image, index, year, onClick, onHover, imageStyle }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-1 to 1) for rotation calculation
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    
    // Max rotation in degrees
    const MAX_ROTATION = 5;
    
    setRotation({ 
      x: -normY * MAX_ROTATION, 
      y: normX * MAX_ROTATION 
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className="group cursor-pointer w-full flex flex-col gap-5"
      onClick={onClick}
      onMouseEnter={() => { setIsHovered(true); onHover(); }}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Image Container - STRICT ASPECT SQUARE USING PADDING HACK */}
      <div 
        className="w-full pt-[100%] relative perspective-[1200px]"
        onMouseMove={handleMouseMove}
      >
        <div 
          ref={cardRef}
          className="absolute inset-0 w-full h-full transition-all duration-100 ease-out transform-style-3d rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-gray-100 dark:bg-[#111]"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
            {/* Image */}
            <img 
               src={image} 
               alt={customTitle || category} 
               className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
               style={imageStyle}
            />

            {/* Gloss/Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
        </div>
      </div>

      {/* Info Below */}
      <div className="flex flex-col space-y-2 pt-1">
          {/* Discipline and Year Row */}
          <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3 pb-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                {category}
             </span>
             <span className="text-[10px] font-mono text-gray-400">
                {year}
             </span>
          </div>
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.9] break-words whitespace-pre-wrap group-hover:text-orange-500 transition-colors duration-300">
             {customTitle}
          </h3>
      </div>
    </div>
  );
};

const ViewAllCard: React.FC<{ onClick: () => void, onHover: () => void }> = ({ onClick, onHover }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="w-full flex flex-col gap-5">
            <div 
                className="w-full pt-[100%] relative group cursor-pointer perspective-[1200px]"
                onClick={onClick}
                onMouseEnter={() => { setIsHovered(true); onHover(); }}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 w-full h-full transition-all duration-100 ease-out transform-style-3d rounded-2xl bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 group-hover:-translate-y-2 shadow-xl overflow-hidden flex flex-col items-center justify-center gap-6">
                     
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                     <div className="relative z-10 w-24 h-24 rounded-full border-2 border-black dark:border-white flex items-center justify-center transition-all duration-500 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                         <ArrowUpRight size={40} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                     </div>
                     
                     <span className="relative z-10 text-sm font-black uppercase tracking-[0.2em] text-black dark:text-white group-hover:tracking-[0.3em] transition-all duration-500">
                        {isHovered ? "YAYY!" : "See More"}
                     </span>
                </div>
            </div>
            {/* Empty space to match layout of other cards */}
            <div className="h-[90px]"></div> 
        </div>
    );
};

const Controls: React.FC<{ 
  theme: 'light' | 'dark', 
  onToggleTheme: () => void
}> = ({ theme, onToggleTheme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = 0.3;
      if (isPlaying) {
        setIsLoading(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
              setHasError(false);
            })
            .catch((err) => {
              console.warn("Playback prevented:", err);
              setIsPlaying(false);
              setIsLoading(false);
            });
        }
      }
    }
  }, [currentTrackIndex]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
              setHasError(false);
            })
            .catch((err) => {
              setIsPlaying(false);
              setIsLoading(false);
              setHasError(true);
            });
        }
      }
    }
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="fixed bottom-10 right-6 md:right-10 z-[1100] flex items-center space-x-3">
      <button
        onClick={onToggleTheme}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-black dark:bg-white border border-white/10 dark:border-black/10 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 text-white dark:text-black"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="relative group">
        <button 
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-black dark:bg-white border transition-all duration-700 shadow-2xl hover:scale-110 active:scale-95 overflow-hidden ${
            isPlaying ? 'border-white dark:border-black' : 'border-white/10 dark:border-black/10'
          }`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-white dark:text-black opacity-50" />
          ) : hasError ? (
            <div className="p-2">
              <Info size={16} className="text-red-500" />
            </div>
          ) : (
            <div className="flex items-end space-x-[2px] h-4">
              <div className={`w-[2px] bg-white dark:bg-black rounded-full transition-all duration-500 ${isPlaying ? 'animate-[music-bar_0.6s_ease-in-out_infinite]' : 'h-[3px] opacity-30'}`} />
              <div className={`w-[2px] bg-white dark:bg-black rounded-full transition-all duration-500 ${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite_0.1s]' : 'h-[5px] opacity-30'}`} />
              <div className={`w-[2px] bg-white dark:bg-black rounded-full transition-all duration-500 ${isPlaying ? 'animate-[music-bar_1.1s_infinite_0.2s]' : 'h-[4px] opacity-30'}`} />
              <div className={`w-[2px] bg-white dark:bg-black rounded-full transition-all duration-500 ${isPlaying ? 'animate-[music-bar_0.7s_infinite_0.3s]' : 'h-[2px] opacity-30'}`} />
            </div>
          )}
        </button>

        <div className={`absolute -top-1 -right-1 flex items-center space-x-1 transition-all duration-700 ${
          isPlaying ? 'opacity-100 scale-100 translate-x-2' : 'opacity-0 scale-50 translate-x-0 pointer-events-none'
        }`}>
          <button onClick={prevTrack} className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <SkipBack size={10} fill="currentColor" />
          </button>
          <button onClick={nextTrack} className="group w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <SkipForward size={10} fill="currentColor" />
          </button>
        </div>
      </div>

      <audio ref={audioRef} loop src={currentTrack.url} />
    </div>
  );
};

const RollingDigit: React.FC<{ value: number, isAtEnd?: boolean, duration?: string }> = ({ value, isAtEnd = false, duration = '400ms' }) => {
  const targetIndex = (isAtEnd && value === 0) ? 10 : value;
  
  return (
    <div className="h-[40px] md:h-[60px] w-full overflow-hidden tabular-nums flex flex-col items-center">
      <div 
        className="transition-transform ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col items-center"
        style={{ 
          transform: `translateY(-${targetIndex * 9.0909}%)`,
          transitionDuration: duration
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
          <div key={i} className="h-[40px] md:h-[60px] flex items-center justify-center">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

const MetallicHello = () => {
  return (
    <div className="hello-scene">
      <div className="hello-spinner">
        {[...Array(16)].map((_, i) => (
          <span 
            key={i} 
            className="hello-text" 
            style={{ 
              transform: `translate(-50%, -50%) translateZ(-${i * 1.5}px)`,
              zIndex: 100 - i
            } as React.CSSProperties}
          >
            Hello
          </span>
        ))}
      </div>
      <style>{`
        .hello-scene {
          perspective: 1000px;
          width: 100%;
          max-width: 800px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hello-spinner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotateHello 5s infinite linear;
        }
        .hello-text {
          position: absolute;
          top: 50%;
          left: 50%;
          font-family: 'Pinyon Script', cursive;
          font-size: 280px;
          line-height: 1;
          white-space: nowrap;
          user-select: none;
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .hello-text {
            font-size: 100px;
          }
          .hello-scene {
            height: 250px;
          }
        }

        .hello-text:nth-child(1) {
          background: linear-gradient(to bottom, #ffffff 0%, #dfdfdf 25%, #8c8c8c 50%, #dfdfdf 75%, #ffffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.9);
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.7));
        }
        .hello-text:last-child {
          background: linear-gradient(to bottom, #ffffff 0%, #dfdfdf 25%, #8c8c8c 50%, #dfdfdf 75%, #ffffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.9);
        }
        .hello-text:not(:nth-child(1)):not(:last-child) {
           color: #555;
           -webkit-text-stroke: 2px #4a4a4a;
           filter: contrast(1.2);
        }
        @keyframes rotateHello {
          0% { transform: rotateY(0deg) rotateX(5deg); }
          100% { transform: rotateY(360deg) rotateX(5deg); }
        }
      `}</style>
    </div>
  );
};

const IDCard = () => {
  return (
    <div className="absolute inset-0 z-10 flex justify-center pt-0 pointer-events-none perspective-[1200px]">
      <div className="origin-top animate-[dropSwing_2.5s_ease-out_forwards] flex flex-col items-center">
        
        {/* Strap - Black - Responsive Height - ADJUSTED HEIGHTS - Gray in Dark Mode */}
        <div className="w-[42px] h-[12vh] md:h-[18vh] lg:h-[30vh] bg-[#050505] dark:bg-[#333333] transition-colors duration-500 relative z-20 flex flex-col items-center shadow-2xl">
             <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')] pointer-events-none"></div>
             <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20"></div>
             <div className="absolute inset-y-0 right-0 w-[1px] bg-white/20"></div>
        </div>

        {/* Connector - Dark Crimp */}
        <div className="w-[44px] h-8 bg-[#1a1a1a] relative z-21 rounded-sm shadow-md border-t border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#333] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Hardware & Card */}
        <div className="relative z-30 -mt-2 flex flex-col items-center origin-top animate-[pendulum_4s_ease-in-out_infinite_alternate_1s]">
            
            {/* Metal Ring */}
            <div className="w-10 h-8 -mt-2 relative z-20 border-[4px] border-[#555] rounded-b-xl border-t-0 bg-transparent shadow-sm"></div>

            {/* Lobster Clasp */}
            <div className="relative z-40 -mt-3 drop-shadow-xl scale-90">
               <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
                 <defs>
                   <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#4b5563" />
                     <stop offset="50%" stopColor="#9ca3af" />
                     <stop offset="100%" stopColor="#4b5563" />
                   </linearGradient>
                 </defs>
                 <path d="M14 0 h12 v10 h-12 z" fill="url(#metalDark)" />
                 <path d="M20 10 v10" stroke="#4b5563" strokeWidth="4" />
                 <path d="M10 20 h20 l2 30 c0 5 -5 10 -12 10 c-7 0 -12 -5 -12 -10 z" fill="none" stroke="url(#metalDark)" strokeWidth="4" />
               </svg>
            </div>

            {/* The ID Card */}
            <div className="relative -mt-[30px] mx-auto z-20">
                <div className="w-[300px] h-[480px] bg-[#080808] rounded-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden animate-[card3D_8s_ease-in-out_infinite_alternate] transform-style-3d border border-white/10">
                    
                    {/* Background Texture - Spray Paint Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                         {/* Noise Grain */}
                         <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay" 
                              style={{ 
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                              }} 
                         ></div>
                         
                         {/* Spray Paint SVG */}
                         <svg width="100%" height="100%" viewBox="0 0 300 480" className="absolute inset-0 overflow-visible opacity-70 mix-blend-screen">
                            <defs>
                                <filter id="sprayBlur" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="20" result="blur" />
                                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                                    <feDisplacementMap in="blur" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
                                </filter>
                                <linearGradient id="sprayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                     <stop offset="0%" stopColor="#ff3f34" />
                                     <stop offset="50%" stopColor="#ff9f43" />
                                     <stop offset="100%" stopColor="#ef5777" />
                                </linearGradient>
                            </defs>
                            
                            <g filter="url(#sprayBlur)">
                                <path d="M -20 120 C 80 20, 220 120, 150 220 C 80 320, 200 400, 320 300" stroke="url(#sprayGrad)" strokeWidth="80" fill="none" strokeLinecap="round" />
                                <circle cx="220" cy="180" r="60" fill="#ff5e57" opacity="0.5" />
                                <path d="M 50 350 Q 150 450 250 350" stroke="#ff3f34" strokeWidth="40" fill="none" strokeLinecap="round" opacity="0.6" />
                            </g>
                         </svg>
                    </div>

                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#080808] rounded-full border border-white/10 shadow-inner z-30"></div>

                    <div className="relative z-20 flex flex-col h-full p-8">
                        {/* Header: Portfolio / 2026 */}
                        <div className="flex justify-between items-start mt-4 border-b border-white/10 pb-4">
                           <div>
                           </div>
                           <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">2026</p>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Name in Typewriter - No Barcode */}
                            <div className="mb-6 flex items-end justify-between pr-2">
                                <div>
                                    <h1 className="text-4xl font-mono font-bold tracking-tighter text-white leading-[0.9] mix-blend-normal">
                                        Maansi
                                    </h1>
                                    <h1 className="text-4xl font-mono font-bold tracking-tighter text-white/50 leading-[0.9]">
                                        Dhamani
                                    </h1>
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-3 w-full">
                                <p className="text-[9px] font-mono text-white tracking-widest border-b border-orange-500/20 pb-1 w-fit">Interests</p>
                                <div className="grid grid-cols-2 gap-x-1 w-full">
                                    <ul className="text-[10px] font-mono text-white/80 space-y-1.5 leading-tight">
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>Typography</li>
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>Branding</li>
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>Packaging</li>
                                    </ul>
                                    <ul className="text-[10px] font-mono text-white/80 space-y-1.5 leading-tight">
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>Editorial</li>
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>Illustration</li>
                                        <li className="flex items-start"><span className="mr-2 opacity-50">•</span>AI Learning</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Footer: Discipline */}
                        <div className="border-t border-white/10 pt-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Discipline</p>
                                    <p className="text-[11px] font-bold text-white tracking-tight font-mono">Visual Communication Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-40"></div>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes dropSwing {
            0% { transform: translateY(-100vh) rotate(5deg); }
            40% { transform: translateY(10px) rotate(-3deg); }
            60% { transform: translateY(-5px) rotate(2deg); }
            80% { transform: translateY(2px) rotate(-1deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes pendulum {
            0% { transform: rotate(1deg); }
            100% { transform: rotate(-1deg); }
        }
        @keyframes card3D {
            0% { transform: rotateY(3deg); }
            100% { transform: rotateY(-3deg); }
        }
      `}</style>
    </div>
  );
}

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1; 
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 800);
      }
      setCount(current);
    }, 30); 
    return () => clearInterval(interval);
  }, [onComplete]);

  const d3 = Math.floor(count % 10);
  const d2 = Math.floor((count / 10) % 10);
  const d1 = Math.floor((count / 100) % 10);
  const isAtEnd = count === 100;

  return (
    <div className={`fixed inset-0 z-[6000] bg-[#050505] flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`relative transition-all duration-700 delay-300 transform ${count > 2 && count < 98 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-8'}`}>
        <MetallicHello />
      </div>
      <div className="fixed bottom-12 left-12 flex items-baseline">
        <div className="flex items-center h-[60px] tabular-nums">
          <div className="text-[50px] md:text-[70px] font-black text-white leading-none flex items-center">
            <div className={`transition-all duration-800 overflow-hidden flex items-center ${count >= 100 ? 'w-[0.65em] opacity-100' : 'w-0 opacity-0'}`}>
              <RollingDigit value={d1} isAtEnd={isAtEnd} duration="1000ms" />
            </div>
            <div className={`transition-all duration-600 overflow-hidden flex items-center ${count >= 10 ? 'w-[0.65em] opacity-100' : 'w-0 opacity-0'}`}>
              <RollingDigit value={d2} isAtEnd={isAtEnd} duration="600ms" />
            </div>
            <div className="w-[0.65em] flex items-center">
              <RollingDigit value={d3} isAtEnd={isAtEnd} duration="400ms" />
            </div>
          </div>
          <span className="text-[24px] font-black text-white/20 ml-2">%</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [viewState, setViewState] = useState<'loading' | 'ready'>('loading');
  const [activeView, setActiveView] = useState<'home' | 'about' | 'resume' | 'category' | 'work-gallery'>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('Packaging Design');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalScroll, setGlobalScroll] = useState(0);
  const [rawScrollY, setRawScrollY] = useState(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isTransitioningWork, setIsTransitioningWork] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });

  const unlockAudio = () => {
    setIsAudioUnlocked(true);
    const sound = tickAudio.cloneNode() as HTMLAudioElement;
    sound.volume = 0;
    sound.play().catch(() => {});
  };

  const checkReveals = useCallback(() => {
    const reveals = document.querySelectorAll('.reveal, .reveal-card, .reveal-from-top');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.90) {
        el.classList.add('active');
      } else if (rect.top > windowHeight) {
        el.classList.remove('active');
      }
    });
  }, []);

  useEffect(() => {
    const handleGlobalScroll = () => {
      const y = window.scrollY;
      setRawScrollY(y);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (y / docHeight) * 100 : 0;
      setGlobalScroll(scrolled);
      
      requestAnimationFrame(checkReveals);
    };
    
    window.addEventListener('scroll', handleGlobalScroll);
    handleGlobalScroll(); 
    
    setTimeout(checkReveals, 300);

    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [checkReveals]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkReveals();
    }, 300);
    return () => clearTimeout(timer);
  }, [viewState, activeView, checkReveals]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleNavigate = (view: 'home' | 'about' | 'resume' | 'category' | 'work-gallery', targetId?: string) => {
    const mainEl = document.getElementById('page-transition-wrapper');
    if (mainEl) mainEl.style.opacity = '0';
    
    setTimeout(() => {
      setActiveView(view);
      window.scrollTo(0, 0);

      if (view === 'home' && targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }

      if (mainEl) {
        mainEl.style.opacity = '1';
        setTimeout(() => {
          checkReveals();
        }, 300);
      }
    }, 400);
  };

  const handleCloseProject = () => {
    setIsModalOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (activeView !== 'home') {
      handleNavigate('home', id);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const playTick = useCallback(() => {
    if (!isAudioUnlocked) return;
    const sound = tickAudio.cloneNode() as HTMLAudioElement;
    sound.volume = 0.15;
    sound.play().catch(() => {});
  }, [isAudioUnlocked]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const initiateWorkTransition = () => {
    setIsTransitioningWork(true);
  };

  const completeWorkTransition = () => {
      setIsTransitioningWork(false);
      setActiveView('work-gallery');
      window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-[0.8s]">
      <PaperFilter />
      <StarField />
      <PenToolBackground theme={theme} />
      <BackgroundTexture />
      
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1200] bg-gray-100 dark:bg-white/5">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${globalScroll}%` }} />
      </div>

      <Controls 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-6 md:right-10 bottom-28 z-[1100] flex items-center justify-center w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl transition-all duration-500 border border-white/10 dark:border-black/10 hover:scale-110 active:scale-95 ${globalScroll > 15 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={20} />
      </button>

      {isTransitioningWork && (
          <RubikCubeTransition projects={PROJECTS} onComplete={completeWorkTransition} />
      )}

      {viewState === 'loading' && <Preloader onComplete={() => { unlockAudio(); setViewState('ready'); }} />}
      
      <div 
        id="page-transition-wrapper"
        className={`relative z-10 view-transition flex flex-col min-h-screen transition-opacity duration-1000 ${viewState === 'ready' && !isTransitioningWork ? 'opacity-100' : 'opacity-0'}`}
      >
        <Header 
          onContactClick={() => scrollToSection('contact')} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          onViewChange={handleNavigate} 
          onWorkClick={initiateWorkTransition}
          currentView={activeView} 
          isFullscreen={false} 
        />

        <main className="flex-1">
          {activeView === 'home' && (
            <div className="home-view">
              <section id="home" className="relative flex items-center min-h-screen pt-20 pb-20 overflow-x-hidden">
                  <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                    
                    {/* ADJUSTED CONTAINER HEIGHT FOR SMALLER SCREENS */}
                    <div className="relative h-[550px] md:h-[650px] lg:h-[80vh] w-full pointer-events-none flex justify-center order-first lg:order-none">
                      {viewState === 'ready' && (
                        /* ADJUSTED SCALING */
                        <div className="scale-[0.8] md:scale-[0.85] lg:scale-100 origin-top w-full h-full flex justify-center">
                            <IDCard />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center space-y-8 z-10 perspective-[1000px]">
                      {viewState === 'ready' && (
                        <div className="origin-top animate-[dropText_2s_ease-out_both]" style={{ animationDelay: '0.2s' }}>
                          <div className="space-y-4">
                            <h2 className="text-lg md:text-2xl lg:text-3xl font-light leading-[1.1] text-black dark:text-white text-justify hyphens-auto">
                                I treat design as a space to <span className="font-serif italic text-orange-500">explore and solve</span> at the same time.
                            </h2>
                            <p className="text-base md:text-lg font-light text-gray-500 leading-relaxed max-w-xl text-justify hyphens-auto">
                                I like work that balances clarity with play, structure with experimentation. The goal is always to create visuals that not only look strong but feel meaningful to the people engaging with them.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
              </section>

              <section id="works" className="bg-transparent pt-24 md:pb-48 overflow-hidden">
                <div className="w-full px-4 md:px-6">
                  <div className="flex justify-between items-end mb-12 md:mb-20 reveal pr-2 md:pr-12">
                      <div className="flex flex-col">
                          <h2 
                            className="text-6xl sm:text-8xl md:text-[10vw] font-black uppercase tracking-tighter leading-[0.9] dzinr-text text-black dark:text-white transition-transform duration-75 ease-out will-change-transform origin-left"
                            style={{ 
                                transform: isMobile 
                                    ? 'none' 
                                    : `scaleX(${Math.min(1.65, 1 + Math.max(0, (rawScrollY - 50) * 0.0008))})` 
                            }}
                          >
                            Projects.
                          </h2>
                      </div>
                  </div>

                  <div className="flex w-full overflow-x-auto gap-6 px-6 md:px-12 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide perspective-container items-start">
                      {PROJECTS.slice(0, 3).map((project, i) => (
                        <div 
                          key={project.id}
                          className={`flex-shrink-0 w-[70vw] md:w-[35vw] lg:w-[30vw] snap-center card-wrapper reveal-card card-${i}`}
                          style={{ transitionDelay: `${i * 100}ms` }}
                        >
                          <CategoryCard
                              category={project.category}
                              customTitle={project.title}
                              image={project.thumbnail}
                              index={i}
                              year={project.year}
                              onClick={() => handleProjectClick(project)}
                              onHover={() => playTick()}
                              imageStyle={project.thumbnailStyle}
                          />
                        </div>
                      ))}
                      
                      <div 
                          className="flex-shrink-0 w-[70vw] md:w-[35vw] lg:w-[30vw] snap-center card-wrapper reveal-card card-view-all"
                          style={{ transitionDelay: '300ms' }}
                      >
                          <ViewAllCard 
                            onClick={initiateWorkTransition}
                            onHover={() => playTick()}
                          />
                      </div>
                      
                      <div className="w-6 flex-shrink-0"></div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeView === 'category' && (
            <CategoryPage 
              category={activeCategory} 
              onBack={() => handleNavigate('home', `category-${activeCategory}`)} 
              onProjectClick={handleProjectClick}
            />
          )}

          {activeView === 'work-gallery' && (
            <WorkGalleryPage
              onBack={() => handleNavigate('home')}
              onProjectClick={handleProjectClick}
            />
          )}

          {activeView === 'about' && (
            <AboutPage onBack={() => handleNavigate('home')} />
          )}

          {activeView === 'resume' && (
            <ResumePage onBack={() => handleNavigate('home')} />
          )}
        </main>

        <footer id="contact" className="bg-transparent pt-32 pb-24 border-t border-black/5 dark:border-white/5">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 reveal">
            <div className="mb-12">
              <p className="text-[13px] font-normal tracking-[0.1em] text-gray-400 leading-relaxed max-w-lg">
                Always open for collaborations, projects, or visual storytelling conversations.
              </p>
            </div>
            <div className="flex flex-col space-y-8 pt-10 border-t border-black/5 dark:border-white/5">
              <a 
                href="mailto:maansidhamani@gmail.com" 
                className="group flex items-center space-x-6 w-fit"
              >
                <Mail size={18} className="text-black dark:text-white" />
                <h3 className="text-xl md:text-2xl font-normal tracking-tight text-black dark:text-white group-hover:text-orange-500 transition-colors">
                  MaansiDhamani@gmail.com
                </h3>
              </a>
            </div>
          </div>
        </footer>

        <ProjectModal 
          project={selectedProject} 
          isOpen={isModalOpen} 
          onClose={handleCloseProject} 
          onScrollTick={playTick}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Hidden Asset Preloader - Forces browser to download/cache all project images immediately */}
      <div aria-hidden="true" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none', zIndex: -1000, left: 0, top: 0 }}>
          {PROJECTS.map((project) => (
             <React.Fragment key={project.id}>
                {project.thumbnail && <img src={project.thumbnail} alt="" loading="eager" decoding="sync" />}
                {project.images?.map((img, i) => (
                   <img key={`${project.id}-img-${i}`} src={img} alt="" loading="eager" decoding="sync" />
                ))}
             </React.Fragment>
          ))}
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes gallery-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes continuousDrop {
            0% { transform: translateY(-120vh) scale(0.5); opacity: 0; }
            15% { transform: translateY(0) scale(1.05); opacity: 1; }
            20% { transform: translateY(-10px) scale(0.95); opacity: 1; }
            25% { transform: translateY(0) scale(1); opacity: 1; }
            80% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(120vh) scale(1); opacity: 0; }
        }
        .animate-gallery-marquee {
          animation: gallery-marquee 25s linear infinite;
        }
        
        .work-item-text, .doodle-text {
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1px currentColor;
          
          background-image: linear-gradient(to bottom, transparent 50%, currentColor 50%);
          background-size: 100% 200%;
          background-position: 0% 100%;
          
          -webkit-background-clip: text;
          background-clip: text;
          
          transition: background-position 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: auto;
        }

        .group:hover .work-item-text,
        .doodle-text:hover {
          background-position: 0% 0%;
        }

        .doodle-text {
            cursor: default;
        }

        .perspective-1000 {
            perspective: 1000px;
        }
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
        }

        /* CARD ENTRANCE ANIMATIONS */
        .perspective-container {
             perspective: 2500px;
        }
        .card-wrapper {
             transition: all 1.4s cubic-bezier(0.19, 1, 0.22, 1);
             transform-style: preserve-3d;
             will-change: transform, opacity;
        }
        .card-wrapper.reveal-card {
             opacity: 0;
             /* Simple slide-up and fade-in for horizontal layout */
             transform: translateY(100px) scale(0.9);
        }

        .card-wrapper.reveal-card.active {
             opacity: 1;
             transform: translateY(0) scale(1);
        }

        @keyframes dropText {
            0% { transform: translateY(-100vh) rotate(-2deg); }
            40% { transform: translateY(10px) rotate(1deg); }
            60% { transform: translateY(-5px) rotate(-0.5deg); }
            80% { transform: translateY(2px) rotate(0.25deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
