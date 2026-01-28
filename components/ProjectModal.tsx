
import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { X, ArrowRight, BookOpen, ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onScrollTick?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onScrollTick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const lastScrollTopRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);
  const SCROLL_THRESHOLD = 300; 

  // Intersection Observer for images and contact section
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

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
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = containerRef.current.querySelectorAll('.project-image-scroll, .contact-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isOpen, project]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        const totalHeight = scrollHeight - clientHeight;
        const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
        setScrollProgress(progress);
        setShowHeaderTitle(scrollTop > 400);

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
        containerRef.current.scrollTop = 0;
        lastScrollTopRef.current = 0;
        scrollAccumulatorRef.current = 0;
      }
      const currentRef = containerRef.current;
      currentRef?.addEventListener('scroll', handleScroll, { passive: true });
      return () => currentRef?.removeEventListener('scroll', handleScroll);
    } else {
      document.body.style.overflow = 'auto';
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

  if (!project) return null;

  return (
    <div 
      className={`fixed inset-0 z-[600] transition-opacity duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/98" onClick={onClose} />
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[650] bg-gray-200/10">
        <div 
          className="h-full bg-black dark:bg-white transition-all duration-75 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div 
        ref={containerRef}
        className={`relative w-full h-full bg-white dark:bg-[#050505] overflow-y-auto overflow-x-hidden transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 left-0 w-full z-[610] p-4 md:p-6 flex justify-between items-center bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-4">
             <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
             >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             </button>
             
             <div className="flex items-center space-x-3 pl-4 border-l border-black/10 dark:border-white/10">
                <div className={`transition-all duration-500 flex flex-col ${showHeaderTitle ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Viewing Project</span>
                  <span className="text-xs font-black uppercase tracking-tight text-black dark:text-white">{project.title}</span>
                </div>
                {!showHeaderTitle && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center rounded-sm">
                      <BookOpen size={14} className="text-white dark:text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white">PROJECT ARCHIVE</span>
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={onClose}
            className="group flex items-center space-x-4 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
          >
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Close</span>
            <X size={16} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="w-full h-screen overflow-hidden">
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            className="w-full h-full object-cover scale-105"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <section className="min-h-fit flex flex-col justify-center py-24 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
              <div className="lg:col-span-8 space-y-12">
                <h1 className="text-5xl md:text-7xl lg:text-[9vw] font-black uppercase leading-[0.85] tracking-tighter text-black dark:text-white dzinr-text">
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
                     <button 
                        onClick={jumpToImages}
                        className="flex items-center space-x-6 group cursor-pointer"
                     >
                        <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl">
                           <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
                        </div>
                        <div className="flex flex-col items-start border-b border-black/10 dark:border-white/10 pb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Begin Visual Journey</span>
                        </div>
                     </button>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-40 space-y-10 h-fit pb-12">
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

        {/* Project Images */}
        <section id="project-image-sequence" className="space-y-0">
           {project.images.map((img, idx) => (
              <div 
                key={idx} 
                className="project-image-scroll w-full overflow-hidden opacity-0 translate-y-12 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <img 
                  src={img} 
                  alt={`${project.title} detail ${idx + 1}`} 
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]"
                />
              </div>
           ))}
        </section>

        {/* REFINED CONTACT SECTION - Text only, button removed as requested */}
        <section className="contact-reveal w-full bg-black text-white px-6 md:px-12 lg:px-24 py-32 md:py-56 mt-20 opacity-0 translate-y-12 transition-all duration-1000 ease-out overflow-visible">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-20 lg:gap-32">
              
              {/* Left Column: Bold Headline */}
              <div className="max-w-4xl w-full">
                 <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.15] tracking-tight text-white m-0 p-0 overflow-visible">
                    Have a project in mind?<br/>
                    I’d be happy to hear your thoughts<br/>
                    and explore it together.
                 </h2>
              </div>

              {/* Right Column: Navigation Links Stacks */}
              <div className="flex flex-col sm:flex-row gap-24 lg:gap-32 w-full lg:w-auto pt-10 lg:pt-4">
                 <div className="flex flex-col space-y-6">
                    {['Work', 'About', 'Resume'].map(link => (
                       <button key={link} className="text-left text-[14px] font-black uppercase tracking-[0.3em] text-white hover:text-gray-400 transition-colors w-fit leading-none">
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
                       <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-[14px] font-black uppercase tracking-[0.3em] text-white hover:text-gray-400 transition-colors w-fit leading-none">
                          <span>{social.name}</span>
                          <ArrowUpRight size={14} className="opacity-50" />
                       </a>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Footer Navigation */}
        <div className="bg-white dark:bg-[#050505] container mx-auto px-6 md:px-12 lg:px-24 pt-48 pb-64 border-t border-black/5 dark:border-white/5 flex flex-col items-center text-center space-y-16">
          <div className="space-y-8">
            <h4 className="text-6xl md:text-[12vw] font-black uppercase tracking-tighter text-black dark:text-white dzinr-text leading-[0.8]">End of<br/><span className="text-gray-100 dark:text-gray-900">Study.</span></h4>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.6em]">Thank you for exploring this project</p>
              <div className="w-1 h-12 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-800" />
            </div>
          </div>
          
          <button 
             onClick={onClose}
             className="group flex flex-col items-center space-y-8 cursor-pointer active:scale-95 transition-all"
          >
             <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center transition-all duration-700 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black">
               <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" size={32} />
             </div>
             <div className="text-center">
               <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Back to Main Portfolio</span>
               <span className="text-2xl font-black uppercase tracking-widest text-black dark:text-white underline underline-offset-8 decoration-gray-200">CLOSE CASE</span>
             </div>
          </button>
        </div>

      </div>
      <style>{`
        .project-image-scroll.active, .contact-reveal.active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
