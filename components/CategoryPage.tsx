
import React, { useEffect } from 'react';
import { Project, Category } from '../types';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';

interface CategoryPageProps {
  category: Category;
  onBack: () => void;
  onProjectClick: (project: Project) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onProjectClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = PROJECTS.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-x-hidden w-full">
       {/* Header with Title and Back */}
       <div className="mb-24">
          <div className="flex items-center space-x-4 mb-10">
             <button onClick={onBack} className="group flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                <div className="p-2 rounded-full border border-gray-200 dark:border-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Back</span>
             </button>
          </div>
          {/* Relaxed tracking here as well */}
          <h1 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tight text-black dark:text-white leading-none break-words max-w-6xl">
             {category}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
             Selected works and case studies exploring the visual narrative of {category.toLowerCase()}.
          </p>
       </div>

       {/* Projects Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 border-t border-black/5 dark:border-white/5 pt-20">
          {filteredProjects.map((project, idx) => (
             <div 
                key={project.id} 
                className="group cursor-pointer space-y-8"
                onClick={() => onProjectClick(project)}
             >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-2xl">
                   <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                      style={project.thumbnailStyle}
                   />
                   <div className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-black text-black dark:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                      <ArrowUpRight size={20} />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-start justify-between">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.9] whitespace-pre-wrap">
                         {project.title}
                      </h3>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">0{idx+1}</span>
                   </div>
                   <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed max-w-md">{project.description}</p>
                   <div className="flex flex-wrap gap-2 pt-2">
                      {project.tools.slice(0, 3).map(tool => (
                         <span key={tool} className="text-[10px] font-bold uppercase tracking-wider border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-sm text-gray-500">
                            {tool}
                         </span>
                      ))}
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default CategoryPage;
