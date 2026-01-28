
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ProjectModal from './components/ProjectModal';
import Assistant from './components/Assistant';
import AboutPage from './components/AboutPage';
import ResumePage from './components/ResumePage';
import CategoryPage from './components/CategoryPage';
import { PROJECTS } from './constants';
import { Category, Project } from './types';
import { 
  ArrowDown, ArrowRight, ArrowUp, Info, Loader2, SkipForward, SkipBack, Moon, Sun, Mail, ArrowUpRight, Maximize, Minimize
} from 'lucide-react';

const CATEGORIES: Category[] = ['Packaging Design', 'Branding', 'Magazine design', 'Book Design'];

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

const Controls: React.FC<{ 
  theme: 'light' | 'dark', 
  onToggleTheme: () => void,
  isFullscreen: boolean,
  onToggleFullscreen: () => void
}> = ({ theme, onToggleTheme, isFullscreen, onToggleFullscreen }) => {
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
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-black dark:bg-white border border-white/10 dark:border-black/10 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 text-white dark:text-black"
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>

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
    const interval = setInterval(() => {
      current += 2; 
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 1200);
        }, 500);
      }
      setCount(current);
    }, 15);
    return () => clearInterval(interval);
  }, [onComplete]);

  const d3 = Math.floor(count % 10);
  const d2 = Math.floor((count / 10) % 10);
  const d1 = Math.floor((count / 100) % 10);
  const isAtEnd = count === 100;

  return (
    <div className={`fixed inset-0 z-[1000] bg-white dark:bg-black flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
      
      <div className="relative text-center px-20">
        <h2 
          className="script text-[18vw] md:text-[14vw] select-none leading-none relative flex items-center justify-center overflow-visible py-10"
          style={{ 
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.1)' 
          }}
        >
          <span className="px-4">Portfolio</span>
          <div 
            className="absolute left-0 top-0 h-full overflow-hidden transition-all duration-100 pointer-events-none flex items-center justify-center w-full"
            style={{ 
              clipPath: `inset(0 ${100 - count}% 0 0)`,
              color: 'transparent',
              WebkitTextStroke: '1.5px white'
            }}
          >
            <span className="script whitespace-nowrap px-4 pb-2">Portfolio</span>
          </div>
        </h2>
      </div>

      <div className="fixed bottom-12 left-12 flex items-baseline">
        <div className="flex items-center h-[60px] tabular-nums">
          <div className="text-[50px] md:text-[70px] font-black text-black dark:text-white leading-none flex select-none items-center justify-center">
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [hoveredCategory, setHoveredCategory] = useState<Category>('Packaging Design');

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

  useEffect(() => {
    const handleGlobalScroll = () => {
      const y = window.scrollY;
      setRawScrollY(y);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (y / docHeight) * 100 : 0;
      setGlobalScroll(scrolled);

      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleGlobalScroll);
    handleGlobalScroll();
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleNavigate = (view: 'home' | 'about' | 'resume' | 'category', targetId?: string) => {
    const mainEl = document.getElementById('view-container');
    if (mainEl) mainEl.style.opacity = '0';
    
    setTimeout(() => {
      setActiveView(view);
      
      if (view === 'home' && targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      if (mainEl) {
        mainEl.style.opacity = '1';
        setTimeout(() => {
          const reveals = document.querySelectorAll('.reveal');
          reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) el.classList.add('active');
          });
        }, 200);
      }
    }, 400);
  };

  const handleCloseProject = () => {
    const categoryToLandOn = selectedProject?.category;
    setIsModalOpen(false);
    
    if (categoryToLandOn) {
      handleNavigate('home', `category-${categoryToLandOn}`);
    } else {
      handleNavigate('home');
    }
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

  const getCategoryPreview = (cat: Category) => {
    const proj = PROJECTS.find(p => p.category === cat);
    return proj?.thumbnail || '';
  };

  return (
    <div className="min-h-screen selection:bg-orange-100 dark:selection:bg-orange-900/30 transition-colors duration-[1.2s] ease-[cubic-bezier(0.7,0,0.3,1)] overflow-x-hidden bg-white dark:bg-black text-black dark:text-white">
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1200] bg-gray-100 dark:bg-white/5">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${globalScroll}%` }} />
      </div>

      <Controls 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        isFullscreen={isFullscreen} 
        onToggleFullscreen={toggleFullscreen} 
      />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed left-1/2 -translate-x-1/2 bottom-12 z-[100] flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl transition-all duration-[1000ms] ease-[cubic-bezier(0.7,0,0.3,1)] border border-white/10 dark:border-black/10 hover:scale-110 active:scale-95 ${globalScroll > 12 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-75 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

      {viewState === 'loading' && <Preloader onComplete={() => { unlockAudio(); setViewState('ready'); }} />}
      
      <div 
        id="view-container"
        className={`view-transition ${viewState === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
      >
        <Header 
          onContactClick={() => scrollToSection('contact')} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          onViewChange={handleNavigate} 
          currentView={activeView} 
          isFullscreen={isFullscreen} 
        />

        {activeView === 'home' && (
          <div className="view-content-wrapper">
            <section id="home" className="relative flex flex-col items-center justify-start px-6 md:px-12 min-h-screen bg-white dark:bg-black">
              <div className="container mx-auto reveal active pt-48 md:pt-64">
                
                {/* Title & Subtitle: Centered as per visual reference */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-20 space-y-4">
                      <h1 
                        className="script select-none whitespace-nowrap leading-none transition-all duration-[1000ms] ease-out will-change-transform"
                        style={{ 
                          fontSize: 'clamp(80px, 20vw, 240px)',
                          opacity: Math.max(0.2, 1 - (rawScrollY / 500)),
                          transform: `translateY(${rawScrollY * 0.2}px) scale(${1 + (rawScrollY * 0.0002)})`
                        }}
                      >
                        Portfolio.
                      </h1>
                    </div>

                    <p className="text-[16px] md:text-[22px] font-light tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-all duration-700 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Visual Communication Designer
                    </p>
                </div>
                
                {/* Philosophy Paragraph: Updated with forced line breaks for editorial rhythm */}
                <div className="w-full flex justify-start mt-24 md:mt-48">
                  <p className="text-left text-black dark:text-white text-2xl md:text-5xl lg:text-6xl font-light leading-[1.1] dzinr-text">
                    I see design as a way of thinking. Each project is a balance of intent <br className="hidden md:block" />
                    and exploration. I’m interested in how visuals communicate, evoke <br className="hidden md:block" />
                    emotion, and create understanding.
                  </p>
                </div>
              </div>
            </section>

            {/* Continuous Moving Image Ticker - LITTLE BIG RECTANGLES & CONTINUOUS MOTION */}
            {/* SPACING FIX: Added a little more space below the ticker */}
            <div className="w-full overflow-hidden bg-white dark:bg-black pt-20 pb-12 border-t border-black/5 dark:border-white/5">
                <div className="relative flex w-max animate-gallery-marquee items-center">
                    {/* First Set of Images */}
                    <div className="flex items-center space-x-4 md:space-x-8 px-4 md:px-8">
                        {GALLERY_IMAGES.map((src, i) => (
                            <div key={`gallery-1-${i}`} className="w-[250px] md:w-[450px] aspect-video overflow-hidden rounded-sm group transition-transform duration-700">
                                <img 
                                    src={src} 
                                    alt={`Gallery visual ${i + 1}`} 
                                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Duplicate Set for Seamless Loop */}
                    <div className="flex items-center space-x-4 md:space-x-8 px-4 md:px-8">
                        {GALLERY_IMAGES.map((src, i) => (
                            <div key={`gallery-2-${i}`} className="w-[250px] md:w-[450px] aspect-video overflow-hidden rounded-sm group transition-transform duration-700">
                                <img 
                                    src={src} 
                                    alt={`Gallery visual duplicated ${i + 1}`} 
                                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SPACING FIX: Added a little more top space here to balance the gap */}
            <section id="works" className="bg-white dark:bg-black pt-16 md:pt-28 pb-48 md:pb-80 border-t border-black/5 dark:border-white/5">
              <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-40 reveal">
                  <div className="space-y-10">
                    <h2 className="text-6xl sm:text-8xl md:text-[12vw] lg:text-[16vw] font-black uppercase tracking-tighter leading-[0.9] dzinr-text text-black dark:text-white transition-colors duration-1000 break-words">
                      MY WORK.
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col mb-24 reveal border-t border-black/5 dark:border-white/5">
                    {CATEGORIES.map((cat, i) => (
                        <div 
                            key={cat}
                            id={`category-${cat}`}
                            className="group relative border-b border-black/5 dark:border-white/5"
                            onMouseEnter={() => { playTick(); setHoveredCategory(cat); }}
                        >
                            <div className="absolute inset-0 bg-orange-50 dark:bg-orange-500/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between py-10 md:py-16 z-10 w-full px-6 md:px-12 lg:px-0 gap-12">
                                <button 
                                    onClick={() => { setActiveCategory(cat); handleNavigate('category'); }}
                                    className="flex-1 flex items-center space-x-6 md:space-x-12 text-left lg:pl-12 min-w-0"
                                >
                                    <span className="text-[12px] font-black text-black/20 dark:text-white/20 group-hover:text-orange-500 transition-colors">0{i + 1}</span>
                                    <h3 className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter dzinr-text transition-all duration-700 break-words leading-none ${
                                        activeCategory === cat ? 'text-black dark:text-white' : 'text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white'
                                    }`}>
                                        {cat}
                                    </h3>
                                </button>

                                <div className="hidden lg:flex w-[280px] aspect-[3/2] items-center justify-center flex-shrink-0 lg:mr-12 pointer-events-none">
                                     <div className="w-full h-full overflow-hidden rounded-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-lg">
                                         <img 
                                            src={getCategoryPreview(cat)} 
                                            alt={cat}
                                            className="w-full h-full object-cover grayscale brightness-90 contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                         />
                                     </div>
                                </div>
                                
                                <div className="lg:hidden absolute right-6 top-1/2 -translate-y-1/2">
                                    <ArrowUpRight size={24} className="text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
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

        <footer id="contact" className="bg-white dark:bg-black pt-32 pb-24 border-t border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-[1s]">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 reveal">
            <div className="mb-16">
              <p className="text-[13px] font-normal tracking-[0.1em] text-gray-400 dark:text-gray-500 leading-relaxed max-w-lg">
                Always open for meaningful collaborations, creative projects, or a brief conversation about visual storytelling.
              </p>
            </div>

            <div className="flex flex-col space-y-8 pt-10 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-10">
                <div className="w-20 h-[1px] bg-gray-200 dark:bg-white/10" />
                <p className="text-[13px] font-black uppercase tracking-[0.7em] text-gray-400">Get in touch</p>
              </div>

              <div className="pt-6">
                <a 
                  href="mailto:maansidhamani@gmail.com" 
                  className="group flex items-center space-x-6 w-fit"
                >
                  <Mail size={20} className="text-black dark:text-white group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl md:text-2xl font-normal tracking-tight text-black dark:text-white border-b border-transparent group-hover:border-orange-500 dark:group-hover:border-orange-400 transition-all">
                    MaansiDhamani@gmail.com
                  </h3>
                </a>
              </div>
            </div>

            <div className="mt-48 pt-20 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-16">
              <div className="flex items-center space-x-16 opacity-30">
                 <p className="text-[11px] font-black uppercase tracking-[0.7em] text-black dark:text-white">© 2026 ARCHIVAL</p>
                 <div className="flex space-x-12">
                    <a href="#" className="text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white hover:opacity-100 transition-opacity">Socials</a>
                    <a href="#" className="text-[11px] font-black uppercase tracking-[0.4em] text-black dark:text-white hover:opacity-100 transition-opacity">Privacy</a>
                 </div>
              </div>
            </div>
          </div>
        </footer>

        <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseProject} onScrollTick={playTick} />
        <Assistant onOpenProject={handleProjectClick} />
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
          animation: gallery-marquee 15s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .shadow-3xl {
           box-shadow: 0 50px 120px -30px rgba(0,0,0,0.2);
        }
        .dark .shadow-3xl {
           box-shadow: 0 50px 120px -30px rgba(0,0,0,0.6);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .view-content-wrapper {
          transition: opacity 1s ease;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
