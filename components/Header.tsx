
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onViewChange: (view: 'home' | 'about' | 'resume' | 'category' | 'work-gallery') => void;
  onWorkClick: () => void;
  currentView: string;
  isFullscreen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onContactClick, 
  theme, 
  onToggleTheme, 
  onViewChange, 
  onWorkClick,
  currentView, 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const RESUME_LINK = "https://drive.google.com/file/d/1jpUrHkoLULdjYiFCAkL98cR1U8A_2HBg/view?usp=sharing";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);

    if (id === 'works') {
        onWorkClick();
        return;
    }

    if (id === 'about') {
      if (currentView !== 'about') onViewChange('about');
    } else if (id === 'resume') {
      window.open(RESUME_LINK, '_blank');
    } else if (id === 'home' || id === 'contact') {
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

  const navItemClass = "text-[12px] font-normal tracking-wide text-black dark:text-white transition-colors hover:text-gray-500 cursor-pointer text-left block leading-tight hover:underline hover:underline-offset-4";
  
  const isMinimalView = currentView === 'category' || currentView === 'about' || currentView === 'resume' || currentView === 'work-gallery';

  const mobileLinkClass = "text-[14px] md:text-[16px] font-light tracking-[0.25em] text-black dark:text-white hover:opacity-50 transition-all duration-300 py-2 w-full text-left";

  const buttonStyle = "px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[11px] font-bold tracking-widest hover:opacity-80 transition-all active:scale-95 border border-transparent hover:border-black dark:hover:border-white w-full text-center";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ${
        isScrolled 
          ? 'py-2 bg-white/95 dark:bg-black/95 border-b border-black/5 dark:border-white/5 shadow-2xl backdrop-blur-md' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="flex items-start justify-between">
            
            <div className="flex items-center space-x-10 h-full pt-1">
              <button 
                onClick={() => handleLinkClick('home')}
                className="cursor-pointer group text-left leading-none transition-transform hover:scale-105 flex items-center"
              >
                <img 
                  src="https://drive.google.com/thumbnail?id=1Z3tPulE838P8auKl-Nu9qXDuuL9bMFg1&sz=w1000" 
                  alt="MD Logo" 
                  className="h-12 md:h-16 w-auto object-contain dark:invert transition-all"
                />
              </button>
              
              {currentView !== 'home' && !isMinimalView && (
                <button 
                  onClick={() => handleLinkClick('home')}
                  className="hidden xl:flex items-center space-x-3 text-[11px] font-medium tracking-widest text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
                >
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to home</span>
                </button>
              )}
            </div>

            <div className="flex items-start gap-8 md:gap-24">
              {!isMinimalView && (
                <div className="hidden md:flex items-start gap-12">
                    <div className="flex flex-col space-y-0.5">
                        <button onClick={() => handleLinkClick('works')} className={navItemClass}>Work</button>
                        <button onClick={() => handleLinkClick('about')} className={navItemClass}>About</button>
                        <button onClick={() => handleLinkClick('resume')} className={navItemClass}>Resume</button>
                    </div>
                    
                    <div className="flex flex-col space-y-0.5">
                        <a href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" target="_blank" rel="noopener noreferrer" className={`${navItemClass} flex items-center gap-1 group`}>Instagram</a>
                        <a href="https://www.linkedin.com/in/maansi-dhamani-85301a348" target="_blank" rel="noopener noreferrer" className={`${navItemClass} flex items-center gap-1 group`}>LinkedIn</a>
                        <a href="https://www.behance.net/maansidhamani22" target="_blank" rel="noopener noreferrer" className={`${navItemClass} flex items-center gap-1 group`}>Behance</a>
                    </div>
                </div>
              )}

              {!isMinimalView && (
                <div className="flex items-center pt-0">
                  <div className="hidden sm:flex flex-col items-center gap-2">
                      <button 
                        onClick={() => handleLinkClick('contact')}
                        className={buttonStyle}
                      >
                        Let's Talk
                      </button>
                  </div>
                  
                  <button 
                    className="md:hidden text-black dark:text-white cursor-pointer p-2 transition-transform hover:scale-110 ml-4"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu size={28} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white dark:bg-black ${
          isMobileMenuOpen ? '!opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <button 
          className="absolute top-10 right-10 text-black dark:text-white p-4 hover:rotate-90 transition-transform duration-300 z-[100000]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={36} />
        </button>
        
        <div className="w-full max-w-lg px-8">
            <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col space-y-8 pt-8">
                    <nav className="flex flex-col space-y-6">
                        <button onClick={() => handleLinkClick('works')} className={mobileLinkClass}>Work</button>
                        <button onClick={() => handleLinkClick('about')} className={mobileLinkClass}>About</button>
                        <button onClick={() => handleLinkClick('resume')} className={mobileLinkClass}>Resume</button>
                    </nav>
                </div>

                <div className="flex flex-col space-y-8 pt-8">
                    <nav className="flex flex-col space-y-6">
                        <a href="#" className={mobileLinkClass}>Instagram</a>
                        <a href="#" className={mobileLinkClass}>Linkedin</a>
                        <a href="#" className={mobileLinkClass}>Behance</a>
                    </nav>
                </div>
            </div>

            <div className="mt-16 pt-12 border-t border-black/10 dark:border-white/10 text-center flex flex-col items-center gap-4 justify-center">
                <button 
                    onClick={() => { handleLinkClick('contact'); setIsMobileMenuOpen(false); }} 
                    className={buttonStyle}
                >
                    Let's Talk
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
