
import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { X, ArrowRight, BookOpen, ArrowDown, ArrowLeft, ArrowUpRight, ArrowUp } from 'lucide-react';
import StarField from './StarField';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onScrollTick?: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume' | 'category', targetId?: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onScrollTick, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollTopRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);
  const SCROLL_THRESHOLD = 300; 

  // Intersection Observer for images and contact section
  useEffect(() => {
    if (!isOpen || !containerRef.current || !project) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { 
        root: containerRef.current,
        // Drastically increased bottom margin to ensure images trigger 'active' state 
        // well before they are scrolled to, effectively making them visible immediately if downloaded.
        rootMargin: '100px 0px 100% 0px' 
      }
    );

    const elements = containerRef.current.querySelectorAll('.project-image-scroll, .contact-reveal');
    elements.forEach((el) => observer.observe(el));

    // Fallback: forcefully activate near-top elements immediately to prevent pop-in
    const timer = setTimeout(() => {
      elements.forEach((el) => {
        el.classList.add('active');
      });
    }, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [isOpen, project]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        const totalHeight = scrollHeight - clientHeight;
        const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
        setScrollProgress(progress);

        if (onScrollTick) {
          const delta = Math.abs(scrollTop - lastScrollTopRef.current);
          scrollAccumulatorRef.current += delta;
          if (scrollAccumulatorRef.current >= SCROLL_THRESHOLD) {
            onScrollTick();
            scrollAccumulatorRef.current = 0;
          }
          lastScrollTopRef.current = scrollTop;
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (containerRef.current) {
        // Ensure instant scroll reset without smooth behavior interference
        containerRef.current.style.scrollBehavior = 'auto';
        containerRef.current.scrollTop = 0;
        // Restore smooth scroll preference if needed via CSS or leave as auto (we removed scroll-smooth class)
        
        lastScrollTopRef.current = 0;
        scrollAccumulatorRef.current = 0;
      }
      const currentRef = containerRef.current;
      currentRef?.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        currentRef?.removeEventListener('scroll', handleScroll);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, project?.id, onScrollTick]);

  const jumpToImages = () => {
    const imageSection = document.getElementById('project-image-sequence');
    if (imageSection && containerRef.current) {
      containerRef.current.scrollTo({
        top: imageSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleFooterLinkClick = (link: string) => {
    if (link === 'Resume') {
       window.open("https://drive.google.com/file/d/1jpUrHkoLULdjYiFCAkL98cR1U8A_2HBg/view?usp=sharing", '_blank');
       return;
    }
    
    onClose();
    // Allow a slight delay for modal closing animation before transitioning view
    setTimeout(() => {
      if (link === 'Work') {
        onNavigate('home', 'works');
      } else if (link === 'About') {
        onNavigate('about');
      }
    }, 300);
  };

  if (!project) return null;

  const isHues = project.id === '5';
  // Use a 6-column grid for Hues & Brews to allow 2-2-3 splits easily.
  // Use 2-column grid for everything else.
  const gridClassName = isHues 
    ? "grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 px-4 md:px-12 lg:px-24"
    : "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-12 lg:px-24";

  return (
    <div 
      className={`fixed inset-0 z-[2000] transition-opacity duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/98" onClick={onClose} />
      
      <div className="fixed top-0 left-0 w-full h-[2px] z-[2050] bg-gray-200/10">
        <div 
          className="h-full bg-black dark:bg-white transition-all duration-75 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div 
        ref={containerRef}
        className={`relative w-full h-full bg-white dark:bg-[#050505] overflow-y-auto overflow-x-hidden transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform shadow-2xl ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        <StarField className="absolute inset-0 z-0 h-full pointer-events-none" />
        
        {/* Header - Fixed to ensure it stays on top */}
        <div className="sticky top-0 left-0 w-full z-[2010] p-4 md:p-6 flex justify-between items-center bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-4">
             <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
             >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <section className="min-h-fit flex flex-col justify-center py-24 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
              <div className="lg:col-span-8 space-y-12 relative z-10">
                {/* Adjusted typography size and kerning to prevent overlap */}
                <h1 className="text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.9] tracking-tight text-black dark:text-white break-words whitespace-pre-wrap">
                  {project.title}
                </h1>
                <div className="space-y-10 max-w-4xl">
                  <p className="text-xl md:text-3xl font-light text-gray-400 dark:text-gray-400 leading-tight">
                    {project.description}
                  </p>
                  <div className="pt-8 space-y-12">
                     <div className="space-y-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">The Project Summary</span>
                        <p className="text-lg md:text-2xl leading-relaxed text-black dark:text-white font-serif italic max-w-3xl whitespace-pre-line">
                          {project.fullDescription}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-40 space-y-10 h-fit pb-12 z-0">
                 <div className="grid grid-cols-2 gap-8 border-t border-black/10 dark:border-white/10 pt-12">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Year</p>
                      <p className="text-xl font-black text-black dark:text-white">{project.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Discipline</p>
                      <p className="text-xl font-black text-black dark:text-white">{project.category}</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Images with Curvy Corners, Sections, and Adaptive Layout */}
        <section id="project-image-sequence" className={`${gridClassName} relative z-10`}>
           {project.images.map((img, idx) => {
              // Layout Logic:
              const isScrollback = project.id === '2';
              const isFanta = project.id === '1';
              const isFritz = project.id === '4';
              const isMorag = project.id === '3';
              // isHues calculated above for grid className

              let colSpanClass = 'md:col-span-1';
              let isSquare = false;
              let customAspect = '';

              if (isHues) {
                // Hues & Brews Layout:
                // Row 1: 2 items (Indices 0, 1) -> 3/6 width each
                if (idx < 2) {
                    colSpanClass = 'md:col-span-3'; // First 2: Half width
                    isSquare = false; // Allow natural aspect ratio to prevent cropping
                } else if (idx === 2) {
                    colSpanClass = 'md:col-span-6'; // Big one: Full width
                } else if (idx < 5) { // Indices 3, 4
                    colSpanClass = 'md:col-span-3'; // Next 2: Half width
                    isSquare = false; // Use natural aspect ratio (frames/rectangles)
                } else {
                    colSpanClass = 'md:col-span-6'; // Remaining: Full width (The new rectangle)
                    isSquare = false;
                }
              } else {
                  // Standard 2-column Grid Logic
                  let isFullWidth = false;

                  if (isFanta) {
                    // Fanta: 
                    // Index 0: Rectangle (Full width)
                    // Index 1, 2: Natural aspect ratio (disabled square)
                    isFullWidth = (idx === 0);
                    isSquare = false;
                  } else if (isFritz) {
                    // Fritz: 
                    // Index 0: Rectangle (Full width)
                    // Index 1, 2: Natural aspect ratio to show full image content
                    isFullWidth = (idx === 0);
                    isSquare = false; 
                  } else if (isMorag) {
                    // Morag:
                    // Index 0: Rectangle (Full width)
                    // Index 1, 2: Squares (Half width) - Enforce square to keep grid tidy
                    isFullWidth = (idx === 0);
                    isSquare = idx !== 0; // Only square for subsequent images, 1st is natural
                  } else if (isScrollback) {
                    // Scrollback: 0 (Sq), 1 (Sq), 2 (Full)
                    isFullWidth = (idx % 3 === 2);
                    isSquare = !isFullWidth;
                  } else {
                    // Default: First image full width
                    isFullWidth = (idx === 0);
                  }

                  colSpanClass = isFullWidth ? 'md:col-span-2' : 'md:col-span-1';
              }
              
              // Standard styling
              const bgClass = 'bg-gray-50 dark:bg-[#0a0a0a]';
              const finalAspect = customAspect || (isSquare ? 'aspect-square' : '');
              const imgHeightClass = finalAspect ? 'h-full object-cover' : 'h-auto';

              // Specific handling to unzoom Fanta and Fritz main images.
              // Both Fanta (ID 1) and Fritz (ID 4) now have NO container padding.
              const containerPadding = '';

              // Specific zoom logic
              const isHuesZoom = isHues && idx === 4;
              const isFantaZoom = isFanta && idx > 0;
              const isZoomed = isHuesZoom || isFantaZoom;

              let zoomStyle: React.CSSProperties = {};
              if (isHuesZoom) {
                  zoomStyle = { transform: 'scale(2)' };
              } else if (isFantaZoom) {
                  zoomStyle = { transform: 'scale(1.1)' };
              }

              return (
                <div 
                    key={`${project.id}-${idx}`}
                    className={`project-image-scroll w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-black/5 dark:hover:border-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg opacity-0 translate-y-12 ${colSpanClass} ${finalAspect} ${bgClass} ${containerPadding}`}
                >
                    <img 
                      src={img} 
                      alt={`${project.title} detail ${idx + 1}`} 
                      className={`w-full block ${imgHeightClass} ${isZoomed ? 'origin-center' : ''}`}
                      style={zoomStyle}
                      loading="eager"
                      decoding="sync" 
                    />
                </div>
              );
           })}

           {/* Scrollback Project Flipbook Embed */}
           {project.id === '2' && (
              <div className="project-image-scroll w-full md:col-span-2 rounded-[3rem] overflow-hidden border-2 border-transparent shadow-lg opacity-0 translate-y-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white aspect-[3/4] md:aspect-[2.5/1]">
                 <iframe 
                    allowFullScreen 
                    allow="clipboard-write" 
                    scrolling="no" 
                    className="fp-iframe w-full h-full" 
                    src="https://heyzine.com/flip-book/60213f805a.html" 
                    style={{ border: 'none' }}
                 ></iframe>
              </div>
           )}

           {/* Illustration Book (Fritz) Project Flipbook Embed */}
           {project.id === '4' && (
              <div className="project-image-scroll w-full md:col-span-2 rounded-[3rem] overflow-hidden border-2 border-transparent shadow-lg opacity-0 translate-y-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white aspect-[3/4] md:aspect-[2.5/1]">
                 <iframe 
                    allowFullScreen 
                    allow="clipboard-write" 
                    scrolling="no" 
                    className="fp-iframe w-full h-full" 
                    src="https://heyzine.com/flip-book/3fe4f21212.html" 
                    style={{ border: 'none' }}
                 ></iframe>
              </div>
           )}

           {/* Morag Magazine Project Flipbook Embed */}
           {project.id === '3' && (
              <div className="project-image-scroll w-full md:col-span-2 rounded-[3rem] overflow-hidden border-2 border-transparent shadow-lg opacity-0 translate-y-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white aspect-[3/4] md:aspect-[2.5/1]">
                 <iframe 
                    allowFullScreen 
                    allow="clipboard-write" 
                    scrolling="no" 
                    className="fp-iframe w-full h-full" 
                    src="https://heyzine.com/flip-book/ec66b6d6fd.html" 
                    style={{ border: 'none' }}
                 ></iframe>
              </div>
           )}
        </section>

        {/* Contact Section */}
        <section className="contact-reveal w-full bg-gray-50 dark:bg-black text-black dark:text-white px-6 md:px-12 lg:px-24 py-32 md:py-56 mt-20 opacity-0 translate-y-12 transition-all duration-1000 ease-out relative z-10">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-20 lg:gap-32">
              <div className="max-w-4xl w-full">
                 <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.15] tracking-tight text-black dark:text-white m-0 p-0">
                    Have a project in mind?<br/>
                    I’d be happy to hear your thoughts<br/>
                    and explore it together.
                 </h2>
              </div>
              <div className="flex flex-row gap-12 sm:gap-24 lg:gap-32 w-full lg:w-auto pt-10 lg:pt-4">
                 <div className="flex flex-col space-y-6">
                    {['Work', 'About', 'Resume'].map(link => (
                       <button 
                        key={link} 
                        onClick={() => handleFooterLinkClick(link)}
                        className="text-left text-[14px] font-black uppercase tracking-[0.3em] text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors w-fit leading-none"
                       >
                          {link}
                       </button>
                    ))}
                 </div>
                 <div className="flex flex-col space-y-6">
                    {[
                      { name: 'Instagram', url: 'https://www.instagram.com/_maansi4301' },
                      { name: 'Linkedin', url: 'https://www.linkedin.com/in/maansi-dhamani-85301a348' },
                      { name: 'Email', url: 'mailto:maansidhamani@gmail.com' }
                    ].map(social => (
                       <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-[14px] font-black uppercase tracking-widest text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors w-fit leading-none">
                          <span>{social.name}</span>
                          <ArrowUpRight size={14} className="opacity-50" />
                       </a>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Footer Navigation */}
        <div className="bg-white dark:bg-[#050505] container mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-48 border-t border-black/5 dark:border-white/5 flex flex-col items-center justify-center relative z-10">
          <button 
             onClick={scrollToTop}
             className="group relative w-20 h-20 md:w-24 md:h-24 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-95 shadow-2xl overflow-hidden"
          >
             <ArrowUp size={32} className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      <style>{`
        .project-image-scroll.active, .contact-reveal.active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        /* Removed scroll-smooth from container logic */
      `}</style>
    </div>
  );
};

export default ProjectModal;
