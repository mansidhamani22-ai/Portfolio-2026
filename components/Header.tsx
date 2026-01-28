
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onViewChange: (view: 'home' | 'about' | 'resume' | 'category') => void;
  currentView: string;
  isFullscreen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onContactClick, 
  theme, 
  onToggleTheme, 
  onViewChange, 
  currentView, 
  isFullscreen 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const RESUME_LINK = "https://drive.google.com/file/d/1FqMPq5nQ_NrNJIOLOGVmrLKhMvauw3yE/view?usp=drive_link";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);

    if (id === 'about') {
      if (currentView !== 'about') onViewChange('about');
    } else if (id === 'resume') {
      if (currentView !== 'resume') onViewChange('resume');
    } else if (id === 'home' || id === 'works' || id === 'contact') {
      if (currentView === 'home') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        onViewChange('home');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 850);
      }
    }
  };

  const navItemClass = "relative text-[13px] lg:text-[14px] font-medium text-black dark:text-white transition-all duration-300 cursor-pointer text-left leading-tight group hover:opacity-70 flex items-center gap-2 uppercase tracking-widest";
  const underlineClass = "absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full";

  const isMinimalView = currentView === 'category' || currentView === 'about';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'py-3 bg-white/95 dark:bg-black/95 border-b border-black/5 dark:border-white/5 shadow-2xl backdrop-blur-md' 
        : 'py-8 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          
          {/* Left: Logo and Home navigation */}
          <div className="flex items-center space-x-10">
            <button 
              onClick={() => handleLinkClick('home')}
              className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-black dark:text-white cursor-pointer group text-left leading-none transition-transform hover:scale-105"
            >
              MD.
            </button>
            
            {currentView !== 'home' && !isMinimalView && (
              <button 
                onClick={() => handleLinkClick('home')}
                className="hidden xl:flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>back to home</span>
              </button>
            )}
          </div>

          {/* Right: Navigation Links and Contact Button */}
          <div className="flex items-center gap-10 md:gap-12 lg:gap-16">
            
            {!isMinimalView && (
              <nav className={`hidden md:grid grid-cols-2 gap-x-8 lg:gap-x-12 pt-1 transition-all ${isFullscreen ? 'opacity-90' : 'opacity-100'}`}>
                <div className="flex flex-col space-y-1">
                  <button onClick={() => handleLinkClick('works')} className={navItemClass}>
                    <span>Work</span>
                    <span className={underlineClass}></span>
                  </button>
                  <button onClick={() => handleLinkClick('about')} className={`${navItemClass} ${currentView === 'about' ? 'opacity-100' : ''}`}>
                    <span>About</span>
                    <span className={`${underlineClass} ${currentView === 'about' ? 'w-full' : ''}`}></span>
                  </button>
                  <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" className={navItemClass}>
                    <span>Resume</span>
                    <span className={underlineClass}></span>
                  </a>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <a href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" target="_blank" rel="noopener noreferrer" className={navItemClass}>
                    <span>Instagram</span>
                    <span className={underlineClass}></span>
                  </a>
                  <a href="https://www.linkedin.com/in/maansi-dhamani-85301a348" target="_blank" rel="noopener noreferrer" className={navItemClass}>
                    <span>LinkedIn</span>
                    <span className={underlineClass}></span>
                  </a>
                  <a href="https://www.behance.net/maansidhamani22" target="_blank" rel="noopener noreferrer" className={navItemClass}>
                    <span>Behance</span>
                    <span className={underlineClass}></span>
                  </a>
                </div>
              </nav>
            )}

            {!isMinimalView && (
              <div className="flex items-center">
                <button 
                  onClick={() => { handleLinkClick('contact'); }}
                  className="hidden sm:block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white transition-all duration-300 active:scale-95 whitespace-nowrap"
                >
                  Let's Talk
                </button>
                
                <button 
                  className="md:hidden text-black dark:text-white cursor-pointer p-2 transition-transform hover:scale-110"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white dark:bg-black z-[60] flex flex-col items-start justify-center px-12 space-y-16 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          className="absolute top-12 right-12 text-black dark:text-white cursor-pointer hover:rotate-90 transition-transform duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={40} />
        </button>
        
        <div className="flex flex-col space-y-6">
          <button onClick={() => handleLinkClick('works')} className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-none hover:pl-6 transition-all duration-300 text-left">Work</button>
          <button onClick={() => handleLinkClick('about')} className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-none hover:pl-6 transition-all duration-300 text-left">About</button>
          <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-none hover:pl-6 transition-all duration-300 text-left">Resume</a>
          <button onClick={() => { setIsMobileMenuOpen(false); handleLinkClick('contact'); }} className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-none hover:pl-6 transition-all duration-300 text-left pt-6 border-t border-black/10 dark:border-white/10">Contact</button>
        </div>

        <div className="pt-20 grid grid-cols-2 gap-x-16 w-full border-t border-black/10 dark:border-white/10 mt-16">
           <div className="flex flex-col space-y-5">
             <a href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" className="text-[14px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Instagram</a>
             <a href="https://www.linkedin.com/in/maansi-dhamani-85301a348" className="text-[14px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Linkedin</a>
             <a href="https://www.behance.net/maansidhamani22" className="text-[14px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">Behance</a>
           </div>
           <div className="flex flex-col items-end justify-center">
             <button onClick={onToggleTheme} className="text-[11px] font-black uppercase tracking-[0.5em] text-black dark:text-white border-2 border-black dark:border-white px-8 py-4 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
               {theme === 'dark' ? 'LIGHT' : 'DARK'} MODE
             </button>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
