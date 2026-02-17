
import React, { useEffect, useState } from 'react';
import { Project, Category } from '../types';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';

interface WorkGalleryPageProps {
  onBack: () => void;
  onProjectClick: (project: Project) => void;
}

const CATEGORIES: Category[] = ['All', 'Packaging Design', 'Branding', 'Publication & Editorial Design'];

const WorkGalleryPage: React.FC<WorkGalleryPageProps> = ({ onBack, onProjectClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-x-hidden w-full">
       {/* Content Wrapper */}
       <div className="w-full max-w-[1800px] mx-auto">
           {/* Header */}
           <div className="mb-24 flex flex-col items-start w-full">
              <div 
                className="flex items-center space-x-4 mb-10 animate-slide-in-right opacity-0" 
                style={{ animationDelay: '100ms' }}
              >
                 <button onClick={onBack} className="group flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                    <div className="p-2 rounded-full border border-gray-200 dark:border-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Back Home</span>
                 </button>
              </div>
              
              <h1 
                className="text-[10vw] md:text-[10vw] font-black uppercase tracking-tighter text-black dark:text-white leading-[0.85] animate-slide-in-right opacity-0 origin-left break-words w-full" 
                style={{ animationDelay: '200ms' }}
              >
                 Projects
              </h1>
              
              <div 
                className="mt-12 flex flex-col items-start w-full gap-10 animate-slide-in-right opacity-0"
                style={{ animationDelay: '300ms' }}
              >
                  <p className="text-lg md:text-xl text-gray-400 dark:text-gray-300 max-w-2xl leading-relaxed">
                     A comprehensive archive of design explorations, branding systems, and visual narratives.
                  </p>

                  {/* Filter Bar - Wraps on all screens to ensure visibility */}
                  <div className="w-full">
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[5px] md:text-[10px] font-bold capitalize tracking-tight md:tracking-wide px-2 py-1 md:px-5 md:py-2.5 rounded-full border transition-all duration-300 ${
                              activeCategory === cat
                                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                : 'bg-transparent text-gray-500 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                  </div>
              </div>
           </div>

           {/* Full Grid - Adjusted for better visual balance */}
           <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-20 border-t border-black/5 dark:border-white/5 pt-20">
              {filteredProjects.map((project, idx) => (
                 <div 
                    key={project.id} 
                    className="group cursor-pointer flex flex-col gap-6 animate-slide-in-right-delayed opacity-0 fill-mode-both"
                    style={{ animationDelay: `${400 + (idx * 100)}ms` }}
                    onClick={() => onProjectClick(project)}
                 >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-2xl">
                       <img 
                          src={project.thumbnail} 
                          alt={project.title} 
                          loading="eager"
                          className="w-full h-full object-cover transition-all duration-[0.7s] ease-out group-hover:scale-105"
                          style={project.thumbnailStyle}
                       />
                       
                       <div className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl z-10">
                          <ArrowUpRight size={16} />
                       </div>
                       
                       {/* Gloss/Sheen Effect on Hover */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
                    </div>

                    {/* Info Below */}
                    <div className="flex flex-col space-y-2 pt-1">
                        {/* Discipline and Year Row */}
                        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 pb-2">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                {project.category}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                                {project.year}
                            </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black dark:text-white leading-[1] group-hover:text-orange-500 transition-colors duration-300">
                            {project.title}
                        </h3>
                    </div>
                 </div>
              ))}
           </div>
       </div>

       <style>{`
         @keyframes slide-in-right-custom {
           0% { transform: translateX(50px); opacity: 0; }
           100% { transform: translateX(0); opacity: 1; }
         }
         
         .animate-slide-in-right {
           animation: slide-in-right-custom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         }
         
         .animate-slide-in-right-delayed {
           animation: slide-in-right-custom 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         }
       `}</style>
    </div>
  );
};

export default WorkGalleryPage;
