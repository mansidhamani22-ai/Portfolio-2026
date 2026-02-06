
import React, { useEffect } from 'react';
import { Project, Category } from '../types';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';

interface WorkGalleryPageProps {
  onBack: () => void;
  onProjectClick: (project: Project) => void;
}

const WorkGalleryPage: React.FC<WorkGalleryPageProps> = ({ onBack, onProjectClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-6 md:px-12 lg:px-24 animate-in fade-in duration-1000">
       {/* Header */}
       <div className="mb-24 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-10">
             <button onClick={onBack} className="group flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                <div className="p-2 rounded-full border border-gray-200 dark:border-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Back Home</span>
             </button>
          </div>
          <h1 className="text-[10vw] font-black uppercase tracking-tighter text-black dark:text-white leading-[0.85]">
             All Works
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mx-auto md:mx-0">
             A comprehensive archive of design explorations, branding systems, and visual narratives.
          </p>
       </div>

       {/* Full Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-black/5 dark:border-white/5 pt-20">
          {PROJECTS.map((project, idx) => (
             <div 
                key={project.id} 
                className="group cursor-pointer space-y-4"
                onClick={() => onProjectClick(project)}
             >
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-white/5 rounded-sm">
                   <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-all duration-[0.7s] ease-out group-hover:scale-105"
                   />
                   
                   {/* Overlay info on hover */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">{project.category}</span>
                        <h3 className="text-xl font-black uppercase text-white tracking-tight">{project.title}</h3>
                        <div className="mt-6 w-10 h-10 rounded-full border border-white flex items-center justify-center text-white">
                            <ArrowUpRight size={18} />
                        </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default WorkGalleryPage;
