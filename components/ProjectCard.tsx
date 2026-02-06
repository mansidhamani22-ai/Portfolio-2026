
import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="project-card group relative cursor-pointer overflow-hidden border border-black/5 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a] transition-all duration-700"
      onClick={() => onClick(project)}
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
      
      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1 block">
              {project.category}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white whitespace-pre-wrap">
              {project.title}
            </h3>
          </div>
          <div className="p-2 border border-black dark:border-white text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 scale-75 group-hover:scale-100">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
