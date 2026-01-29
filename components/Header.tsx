import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, ArrowUpRight } from 'lucide-react';

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

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

  const navItemClass = "text-[7px] font-light uppercase tracking-[0.25em] text-black dark:text-white transition-colors hover:text-gray-500 cursor-pointer text-left block py-1";
  
  const isMinimalView = currentView === 'category' || currentView === 'about' || currentView === 'resume';

  // Mobile Menu Typography
  const mobileLinkClass = "text-[14px] md:text-[16px] font-light uppercase tracking-[0.25em] text-white hover:opacity-50 transition-all duration-300 py-2 w-full text-left";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ${
        isScrolled 
          ? 'py-2 bg-white/95 dark:bg-black/95 border-b border-black/5 dark:border-white/5 shadow-2xl backdrop-blur-md' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-start justify-between">
            
            <div className="flex items-center space-x-10 h-full pt-1">
              <button 
                onClick={() => handleLinkClick('home')}
                className="text-2xl md:text-3xl font-light tracking-tighter uppercase text-black dark:text-white cursor-pointer group text-left leading-none transition-transform hover:scale-105"
              >
                MD.
              </button>
              
              {currentView !== 'home' && !isMinimalView && (
                <button 
                  onClick={() => handleLinkClick('home')}
                  className="hidden xl:flex items-center space-x-3 text-[7px] font-light uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
                >
                  <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                  <span>back to home</span>
                </button>
              )}
            </div>

            <div className="flex items-start gap-8 md:gap-12">
              {!isMinimalView && (
                <div className="hidden md:flex items-start gap-12">
                    {/* Column 1: Navigation */}
                    <div className="flex flex-col space-y-1">
                        <button onClick={() => handleLinkClick('works')} className={navItemClass}>Work</button>
                        <button onClick={() => handleLinkClick('about')} className={navItemClass}>About</button>
                        <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" className={navItemClass}>Resume</a>
                    </div>
                    
                    {/* Column 2: Socials */}
                    <div className="flex flex-col space-y-1">
                        <a 
                            href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${navItemClass} flex items-center gap-1 group`}
                        >
                            Instagram
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/maansi-dhamani-85301a348" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${navItemClass} flex items-center gap-1 group`}
                        >
                            LinkedIn
                        </a>
                        <a 
                            href="https://www.behance.net/maansidhamani22" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${navItemClass} flex items-center gap-1 group`}
                        >
                            Behance
                        </a>
                    </div>
                </div>
              )}

              {!isMinimalView && (
                <div className="flex items-center pt-0">
                  <button 
                    onClick={() => handleLinkClick('contact')}
                    className="hidden sm:block px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[7px] font-bold uppercase tracking-[0.1em] hover:opacity-80 transition-all active:scale-95"
                  >
                    Let's Talk
                  </button>
                  
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? '!opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }} 
      >
        <button 
          className="absolute top-10 right-10 text-white p-4 hover:rotate-90 transition-transform duration-300 z-[100000]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={36} />
        </button>
        
        {/* Two Column Layout for Mobile Menu */}
        <div className="w-full max-w-lg px-8">
            <div className="grid grid-cols-2 gap-12">
                {/* Column 1: Navigation */}
                <div className="flex flex-col space-y-8 pt-8">
                    <nav className="flex flex-col space-y-6">
                        <button onClick={() => handleLinkClick('works')} className={mobileLinkClass}>
                            Work
                        </button>
                        <button onClick={() => handleLinkClick('about')} className={mobileLinkClass}>
                            About
                        </button>
                        <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" className={mobileLinkClass}>
                            Resume
                        </a>
                    </nav>
                </div>

                {/* Column 2: Socials */}
                <div className="flex flex-col space-y-8 pt-8">
                    <nav className="flex flex-col space-y-6">
                        <a 
                            href="https://www.instagram.com/_maansi4301?igsh=MTg2ODR6OXAzOTZqMw==" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={mobileLinkClass}
                        >
                            Instagram
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/maansi-dhamani-85301a348" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={mobileLinkClass}
                        >
                            Linkedin
                        </a>
                        <a 
                            href="https://www.behance.net/maansidhamani22" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={mobileLinkClass}
                        >
                            Behance
                        </a>
                    </nav>
                </div>
            </div>

            {/* Bottom Email Action */}
            <div className="mt-16 pt-12 border-t border-white/10 text-center flex justify-center">
                <button 
                    onClick={() => { handleLinkClick('contact'); setIsMobileMenuOpen(false); }} 
                    className="px-8 py-3 bg-white text-black rounded-full text-[12px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-all active:scale-95"
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