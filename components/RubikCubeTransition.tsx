
import React, { useEffect, useMemo, useState } from 'react';
import { Project } from '../types';

interface RubikCubeTransitionProps {
  projects: Project[];
  onComplete: () => void;
}

const RubikCubeTransition: React.FC<RubikCubeTransitionProps> = ({ projects, onComplete }) => {
  const [phase, setPhase] = useState<'spin' | 'exit'>('spin');
  
  // Responsive card dimensions
  const [cardDims, setCardDims] = useState(() => {
    if (typeof window !== 'undefined') {
       const isMobile = window.innerWidth < 768;
       return isMobile ? { w: 140, h: 200, gap: 15, zoom: 2.2 } : { w: 300, h: 400, gap: 40, zoom: 1.6 };
    }
    return { w: 300, h: 400, gap: 40, zoom: 1.6 };
  });

  useEffect(() => {
    const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        setCardDims(isMobile 
          ? { w: 140, h: 200, gap: 15, zoom: 2.2 } 
          : { w: 300, h: 400, gap: 40, zoom: 1.6 }
        );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 1. Spin briefly then start exiting
    // INCREASED DURATION: Allow cylinder to spin longer (1.5s) to establish the visual before exiting
    // This addresses the "speed of loading" feeling too fast or janky.
    const spinTimer = setTimeout(() => {
      setPhase('exit');
    }, 1500);

    // 2. Complete transition
    // INCREASED TOTAL DURATION: 1.5s spin + 1.2s exit transition + buffer = ~2.8s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800); 

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Cylinder setup
  const { items, radius, angleStep } = useMemo(() => {
    // 1. Get base items
    const validProjects = projects
        .filter(p => p.thumbnail)
        .map(p => ({ ...p }));

    if (validProjects.length === 0) return { items: [], radius: 0, angleStep: 0 };
    
    // 2. Duplicate until we have enough for a nice dense cylinder
    // Increased minimum count to ensure no gaps appear during fast rotation
    let list = [...validProjects];
    while (list.length < 16) {
        list = [...list, ...validProjects];
    }
    // Cap at a reasonable number to avoid massive radius that might clip with perspective
    if (list.length > 24) list = list.slice(0, 24);

    const count = list.length;
    
    // 3. Calculate Geometry
    const cardWidth = cardDims.w; 
    const gap = cardDims.gap; 
    
    // Radius of the cylinder
    const r = Math.round( ((cardWidth + gap) * count) / (2 * Math.PI) );
    
    return { 
        items: list, 
        radius: r,
        angleStep: 360 / count
    };
  }, [projects, cardDims]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      
      {/* 3D Scene */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '3000px' }} 
      >
          {/* Mover Wrapper: Moves the whole cylinder off-screen to the LEFT during exit */}
          <div 
            className={`transform-style-3d will-change-transform transition-transform duration-[1200ms] ease-in ${phase === 'exit' ? 'translate-x-[-150vw]' : 'translate-x-0'}`}
          >
              {/* Rotating Cylinder Container */}
              <div 
                className="relative transform-style-3d animate-spin-cylinder will-change-transform"
              >
                 {items.map((project, i) => {
                     const angle = i * angleStep;

                     return (
                         <div 
                            key={i}
                            className="absolute top-1/2 left-1/2 backface-hidden"
                            style={{
                                width: `${cardDims.w}px`,
                                height: `${cardDims.h}px`,
                                marginLeft: `-${cardDims.w / 2}px`, 
                                marginTop: `-${cardDims.h / 2}px`,
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                            }}
                         >
                             {/* Inner Content */}
                             <div 
                                className="w-full h-full"
                                style={{
                                    // Reflection
                                    WebkitBoxReflect: 'below 10px linear-gradient(transparent 50%, rgba(255,255,255,0.2))'
                                }}
                             >
                                 <div className="w-full h-full bg-[#111] border border-white/20 overflow-hidden shadow-2xl rounded-md">
                                     <img 
                                        src={project.thumbnail} 
                                        className="w-full h-full object-cover"
                                        alt=""
                                        loading="eager"
                                        style={{
                                            ...project.thumbnailStyle,
                                            imageRendering: 'auto'
                                        }}
                                     />
                                     {/* Gloss Overlay */}
                                     <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60 pointer-events-none mix-blend-overlay"></div>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
              </div>
          </div>
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none" />

      <style>{`
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        /* Hide backfaces to prevent Z-fighting and overlapping rear cards */
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .backface-visible {
            backface-visibility: visible;
        }
        @keyframes spin-cylinder {
            0% { transform: translateZ(-${radius * cardDims.zoom}px) rotateY(0deg); }
            100% { transform: translateZ(-${radius * cardDims.zoom}px) rotateY(-360deg); }
        }
        .animate-spin-cylinder {
            /* Slower speed (2.5s) to reduce motion blur and rendering load */
            animation: spin-cylinder 2.5s linear infinite; 
        }
        .bg-radial-gradient {
            background: radial-gradient(circle, transparent 30%, black 100%);
        }
      `}</style>
    </div>
  );
};

export default RubikCubeTransition;
