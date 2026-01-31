
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ProjectModal from './components/ProjectModal';
import AboutPage from './components/AboutPage';
import ResumePage from './components/ResumePage';
import CategoryPage from './components/CategoryPage';
import PenToolBackground from './components/PenToolBackground';
import { PROJECTS } from './constants';
import { Category, Project } from './types';
import { 
  ArrowDown, ArrowRight, ArrowUp, Info, Loader2, SkipForward, SkipBack, Moon, Sun, Mail, ArrowUpRight, Smile
} from 'lucide-react';

const CATEGORIES: Category[] = ['Packaging Design', 'Branding', 'Publication Design'];

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

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512331283953-19967202267a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop'
];

const PORTFOLIO_LETTERS = [
  { char: 'P', rotate: '-3deg', y: '4px' },
  { char: 'O', rotate: '2deg', y: '-4px' },
  { char: 'R', rotate: '-2deg', y: '0px' },
  { char: 'T', rotate: '4deg', y: '4px' },
  { char: 'F', rotate: '-3deg', y: '-2px' },
  { char: 'O', rotate: '2deg', y: '3px' },
  { char: 'L', rotate: '-4deg', y: '0px' },
  { char: 'I', rotate: '3deg', y: '-4px' },
  { char: 'O', rotate: '-2deg', y: '2px' },
];

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

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let current = 0;
    // Slower interval (30ms per 1%) = 3 seconds total loading time
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
    <div className={`fixed inset-0 z-[6000] bg-white dark:bg-black flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Centered "Portfolio" reveal in elegant script typeface with Outline-to-Fill animation */}
      <div className={`relative w-full max-w-[95vw] transition-all duration-700 delay-300 transform ${count > 2 && count < 98 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-8'}`}>
        <div className="relative text-black dark:text-white flex justify-center items-center">
          <div className="relative inline-block">
              {/* Outline Base - Visible Always */}
              <h1 
                className="script select-none text-center leading-[1.15] py-4 px-6 md:px-12 text-transparent"
                style={{ 
                    fontSize: 'clamp(3.5rem, 16vw, 12rem)', 
                    WebkitTextStroke: '1px currentColor' 
                }}
              >
                Portfolio
              </h1>

              {/* Fill Animation Overlay - Clips from left to right based on loading progress */}
              <div 
                className="absolute inset-0 text-black dark:text-white pointer-events-none"
                style={{ 
                  clipPath: `inset(0 ${100 - count}% 0 0)`,
                  transition: 'clip-path 0.1s linear'
                }}
              >
                 <h1 
                    className="script select-none text-center leading-[1.15] py-4 px-6 md:px-12"
                    style={{ fontSize: 'clamp(3.5rem, 16vw, 12rem)' }}
                 >
                  Portfolio
                </h1>
              </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-12 left-12 flex items-baseline">
        <div className="flex items-center h-[60px] tabular-nums">
          <div className="text-[50px] md:text-[70px] font-black text-black dark:text-white leading-none flex items-center">
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
          <span className="text-[24px] font-black text-black/20 dark:text-white/20 ml-2">%</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [viewState, setViewState] = useState<'loading' | 'ready'>('loading');
  const [activeView, setActiveView] = useState<'home' | 'about' | 'resume' | 'category'>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('Packaging Design');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalScroll, setGlobalScroll] = useState(0);
  const [rawScrollY, setRawScrollY] = useState(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

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
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('active');
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
      checkReveals();
    };
    
    window.addEventListener('scroll', handleGlobalScroll);
    handleGlobalScroll();
    
    // Initial reveal check after a small delay to ensure rendering
    setTimeout(checkReveals, 100);

    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [checkReveals]);

  // Re-run reveals when view state or active view changes to ensure content appears
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

  const handleNavigate = (view: 'home' | 'about' | 'resume' | 'category', targetId?: string) => {
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
    const categoryToLandOn = selectedProject?.category;
    setIsModalOpen(false);
    
    setTimeout(() => {
      if (categoryToLandOn) {
        setActiveCategory(categoryToLandOn);
        handleNavigate('category');
      } else {
        handleNavigate('home');
      }
    }, 300);
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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-[0.8s]">
      <PaperFilter />
      <PenToolBackground theme={theme} />
      
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1200] bg-gray-100 dark:bg-white/5">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${globalScroll}%` }} />
      </div>

      <Controls 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed left-1/2 -translate-x-1/2 bottom-12 z-[1100] flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl transition-all duration-500 border border-white/10 dark:border-black/10 hover:scale-110 active:scale-95 ${globalScroll > 15 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

      {viewState === 'loading' && <Preloader onComplete={() => { unlockAudio(); setViewState('ready'); }} />}
      
      <div 
        id="page-transition-wrapper"
        className={`view-transition flex flex-col min-h-screen transition-opacity duration-1000 ${viewState === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      >
        <Header 
          onContactClick={() => scrollToSection('contact')} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          onViewChange={handleNavigate} 
          currentView={activeView} 
          isFullscreen={false} 
        />

        <main className="flex-1">
          {activeView === 'home' && (
            <div className="home-view">
              {/* Padding adjusted: reduced pb from 12 to 8 */}
              <section id="home" className="relative flex flex-col items-center justify-center min-h-screen pt-28 pb-8 md:pt-80 md:pb-20">
                <div className="container mx-auto reveal active flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center relative z-10 w-full">
                      
                      <div className="relative inline-block my-12 md:my-20">
                        {/* Main Text: Portfolio - Cutout Style White with Paper Effect */}
                        <div className="flex items-baseline justify-center space-x-0 md:space-x-1 select-none relative z-20">
                            {PORTFOLIO_LETTERS.map((item, idx) => (
                                <span 
                                    key={idx}
                                    className="font-sans font-black text-white leading-none tracking-tighter transition-transform hover:scale-110 duration-300"
                                    style={{
                                        fontSize: 'clamp(3rem, 13vw, 10rem)',
                                        transform: `rotate(${item.rotate}) translateY(${item.y})`,
                                        textShadow: '1px 2px 2px rgba(0,0,0,0.25), 2px 4px 12px rgba(0,0,0,0.15)', // Layered shadow for paper depth
                                        filter: 'url(#paper-roughness) contrast(1.1)', // Paper edge effect
                                        WebkitTextStroke: '1px rgba(0,0,0,0.05)' // Subtle outline
                                    }}
                                >
                                    {item.char}
                                </span>
                            ))}
                        </div>

                        {/* DOODLES */}
                        
                        {/* 1. graphic design is my passion (Top Left) */}
                        <div className="absolute -top-16 -left-4 md:-top-24 md:-left-40 transform -rotate-6 pointer-events-none z-10 w-32 md:w-auto">
                           <span className="font-handwriting text-[#8b5cf6] doodle-text text-lg md:text-3xl whitespace-nowrap leading-tight block">graphic design<br/>is my passion</span>
                           <svg className="w-8 h-8 md:w-16 md:h-16 text-[#8b5cf6] absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                             <path d="M20,10 Q50,50 80,40" />
                             <path d="M80,40 L65,35 M80,40 L70,55" />
                           </svg>
                        </div>

                        {/* InDesign (Far Left) */}
                        <div className="absolute top-8 -left-16 md:top-0 md:-left-64 transform -rotate-12 pointer-events-none">
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-lg md:text-3xl whitespace-nowrap">InDesign</span>
                            {/* Star doodle */}
                            <svg className="w-4 h-4 md:w-8 md:h-8 text-[#8b5cf6] absolute -top-4 -left-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </div>

                        {/* Star (Bottom Left of Portfolio) */}
                        <div className="absolute bottom-4 -left-10 md:bottom-8 md:-left-24 text-[#8b5cf6] pointer-events-none">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 md:w-12 md:h-12 transform rotate-12">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>

                        {/* Spring/Loop Doodle above R & T */}
                        <div className="absolute -top-10 left-[28%] md:-top-20 md:left-[33%] transform -rotate-12 pointer-events-none">
                            <svg className="w-10 h-6 md:w-24 md:h-12 text-[#8b5cf6]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M5,40 C20,10 30,10 30,40 S55,40 55,10 S80,10 80,40" />
                            </svg>
                        </div>

                        {/* Branding (Top Right) */}
                        <div className="absolute -top-12 -right-4 md:-top-28 md:-right-24 transform rotate-6 pointer-events-none">
                           <span className="font-handwriting text-[#8b5cf6] doodle-text text-xl md:text-5xl whitespace-nowrap">branding</span>
                           <svg className="w-12 h-6 md:w-24 md:h-12 text-[#8b5cf6] absolute top-full left-0 opacity-80" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10,10 Q50,40 90,10" /></svg>
                        </div>

                        {/* Figma (Top Right Center) */}
                        <div className="absolute -top-8 right-1/4 md:-top-16 md:right-[20%] transform -rotate-3 pointer-events-none">
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-sm md:text-2xl whitespace-nowrap">Figma</span>
                            {/* Cursor arrow */}
                             <svg className="w-3 h-3 md:w-6 md:h-6 text-[#8b5cf6] absolute top-full -right-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                        </div>

                        {/* Procreate (Far Right) */}
                        <div className="absolute top-0 -right-20 md:top-4 md:-right-64 transform rotate-6 pointer-events-none flex flex-col items-center">
                             {/* Dashed Circle with Smiley */}
                             <div className="relative mb-2">
                                <svg className="w-10 h-10 md:w-16 md:h-16 text-[#8b5cf6]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6">
                                    <circle cx="50" cy="50" r="45" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[#8b5cf6]">
                                    <Smile size={24} className="md:w-10 md:h-10" />
                                </div>
                             </div>
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-sm md:text-2xl whitespace-nowrap -rotate-12">Procreate</span>
                        </div>

                        {/* Typography (Bottom Left) */}
                        <div className="absolute -bottom-12 -left-2 md:-bottom-24 md:-left-20 transform rotate-3 pointer-events-none">
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-xl md:text-5xl whitespace-nowrap">typography</span>
                        </div>

                        {/* Photoshop (Bottom Left Center) */}
                        <div className="absolute -bottom-16 left-[15%] md:-bottom-28 md:left-[20%] transform -rotate-2 pointer-events-none text-center">
                            <svg className="w-4 h-8 md:w-6 md:h-12 text-[#8b5cf6] mx-auto mb-1" viewBox="0 0 20 50" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10,0 L10,40 M5,35 L10,40 L15,35" />
                            </svg>
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-lg md:text-3xl whitespace-nowrap">Photoshop</span>
                        </div>

                        {/* Illustrator (Bottom Right Center) - Fixed Overlap */}
                        <div className="absolute -bottom-14 right-[20%] md:-bottom-24 md:right-[25%] transform rotate-2 pointer-events-none">
                            <span className="font-handwriting text-[#8b5cf6] doodle-text text-lg md:text-3xl whitespace-nowrap">Illustrator</span>
                            <svg className="w-12 h-6 md:w-24 md:h-12 text-[#8b5cf6] absolute top-[85%] left-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5,5 Q50,25 95,5" />
                            </svg>
                        </div>

                         {/* Illustration (Bottom Right) */}
                        <div className="absolute -bottom-10 -right-4 md:-bottom-20 md:-right-20 transform -rotate-3 pointer-events-none">
                           <span className="font-handwriting text-[#8b5cf6] doodle-text text-xl md:text-5xl whitespace-nowrap">illustration</span>
                        </div>

                      </div>

                  </div>
                  <div className="w-full flex justify-start mt-32 md:mt-56 px-4">
                    <p className="text-left text-black dark:text-white text-2xl md:text-5xl lg:text-6xl font-light leading-[1.1] dzinr-text">
                      I see design as a way of thinking. Each project is a balance of intent and exploration. I’m interested in how visuals communicate, evoke emotion and create understanding.
                    </p>
                  </div>
                </div>
              </section>

              {/* Reduced padding in Works section */}
              <section id="works" className="bg-white dark:bg-black pt-10 md:pt-20 pb-24 md:pb-48">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                  <div className="flex flex-col mb-12 md:mb-20 reveal">
                      <h2 className="text-6xl sm:text-8xl md:text-[10vw] font-black uppercase tracking-tighter leading-[0.9] dzinr-text text-black dark:text-white">
                        MY WORK.
                      </h2>
                  </div>

                  <div className="flex flex-col mb-12 reveal border-t border-black/5 dark:border-white/5">
                      {CATEGORIES.map((cat, i) => (
                          <div 
                              key={cat}
                              id={`category-${cat}`}
                              className="group relative border-b border-black/5 dark:border-white/5 cursor-pointer"
                              onMouseEnter={() => playTick()}
                              onClick={() => { setActiveCategory(cat); handleNavigate('category'); }}
                          >
                              <div className="relative flex items-center justify-between py-10 md:py-20 px-6 md:px-12 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/[0.02]">
                                  <div className="flex items-center space-x-6 md:space-x-12">
                                      <span className="text-sm md:text-lg font-black text-black/20 dark:text-white/20 work-item-text transition-all duration-300">0{i + 1}</span>
                                      {/* Relaxed kerning here for better readability */}
                                      <h3 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight work-item-text">
                                          {cat}
                                      </h3>
                                  </div>
                                  <ArrowUpRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                          </div>
                      ))}
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

          {activeView === 'about' && (
            <AboutPage onBack={() => handleNavigate('home')} />
          )}

          {activeView === 'resume' && (
            <ResumePage onBack={() => handleNavigate('home')} />
          )}
        </main>

        <footer id="contact" className="bg-white dark:bg-black pt-32 pb-24 border-t border-black/5 dark:border-white/5">
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

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes gallery-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-gallery-marquee {
          animation: gallery-marquee 25s linear infinite;
        }
        
        .work-item-text, .doodle-text {
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1px currentColor;
          
          /* Gradient: transparent at top (hover state), solid currentColor at bottom (default state) */
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
      `}</style>
    </div>
  );
}
