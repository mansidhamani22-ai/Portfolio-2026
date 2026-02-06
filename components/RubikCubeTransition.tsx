
import React, { useEffect, useState } from 'react';
import { Project } from '../types';

interface RubikCubeTransitionProps {
  projects: Project[];
  onComplete: () => void;
}

const RubikCubeTransition: React.FC<RubikCubeTransitionProps> = ({ projects, onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'spin' | 'exit'>('enter');

  useEffect(() => {
    // Phase 1: Enter (Zoom In)
    
    // Phase 2: Spin - Start almost immediately
    const spinTimer = setTimeout(() => {
      setPhase('spin');
    }, 50); 

    // Phase 3: Exit (Dissolve) - Trigger after one full rotation (1.5s)
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1550); // 50ms delay + 1500ms rotation

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2350); // 1550ms + 800ms transition

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Helper to get project image
  const getImage = (i: number) => {
    if (!projects || projects.length === 0) return '';
    const p = projects[i % projects.length];
    return p.thumbnail;
  };

  const faces = [
    { name: 'front', rotate: 'rotateY(0deg)' },
    { name: 'back', rotate: 'rotateY(180deg)' },
    { name: 'right', rotate: 'rotateY(90deg)' },
    { name: 'left', rotate: 'rotateY(-90deg)' },
    { name: 'top', rotate: 'rotateX(90deg)' },
    { name: 'bottom', rotate: 'rotateX(-90deg)' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden perspective-[1500px]">
      
      {/* Background Particles/Stars for depth */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>

      <div 
        className={`cube-container relative w-[200px] h-[200px] md:w-[250px] md:h-[250px] transform-style-3d transition-all duration-[800ms] ease-in-out ${
          phase === 'enter' ? 'scale-75 opacity-0 translate-z-[-200px]' : 
          phase === 'spin' ? 'scale-100 opacity-100 translate-z-[0px]' : 
          'scale-110 opacity-0 translate-z-[100px] blur-sm'
        }`}
      >
        <div className="cube w-full h-full absolute transform-style-3d animate-cube-spin">
          {faces.map((face, index) => (
            <div
              key={face.name}
              className="absolute w-full h-full bg-black border border-white/20 backface-hidden overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              style={{
                '--rotate': face.rotate
              } as React.CSSProperties}
            >
                <div className="w-full h-full relative">
                    <img 
                        src={getImage(index)} 
                        alt="" 
                        className="w-full h-full object-cover filter contrast-125"
                    />
                    {/* Cinematic Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none"></div>
                    {/* Inner Border */}
                    <div className="absolute inset-0 border-[0.5px] border-white/30 opacity-50 pointer-events-none"></div>
                </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        /* Dynamic translation based on container size (half of width) */
        .cube > div {
            transform: var(--rotate) translateZ(100px);
        }
        @media (min-width: 768px) {
            .cube > div {
                transform: var(--rotate) translateZ(125px);
            }
        }

        @keyframes cube-spin {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(0deg); }
          50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg); }
          75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(180deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        .animate-cube-spin {
          animation: cube-spin 1.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RubikCubeTransition;
