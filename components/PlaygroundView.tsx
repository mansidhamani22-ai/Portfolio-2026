
import React, { useState, useEffect, useRef } from 'react';
import { ViewType } from '../types';
import { Plus, Minus, Map as MapIcon, HelpCircle, Menu } from 'lucide-react';

const MapTree: React.FC<{ x: number; y: number; type?: 'pine' | 'round'; scale?: number }> = ({ x, y, type = 'round', scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <circle cx="0" cy="0" r="15" fill="rgba(0,0,0,0.1)" transform="scale(1, 0.3) translate(0, 140)" /> {/* Shadow */}
    {type === 'pine' ? (
      <g transform="translate(0, -40)">
        <path d="M -5 40 L 5 40 L 5 20 L -5 20 Z" fill="#5d4037" />
        <path d="M 0 0 L 20 25 L 0 25 Z" fill="#2d6a4f" transform="translate(-10, 0)" />
        <path d="M 0 0 L -20 25 L 0 25 Z" fill="#2d6a4f" transform="translate(10, 0)" />
        <path d="M 0 -15 L 18 10 L -18 10 Z" fill="#40916c" />
        <path d="M 0 -25 L 15 -5 L -15 -5 Z" fill="#52b788" />
      </g>
    ) : (
      <g transform="translate(0, -35)">
        <rect x="-4" y="20" width="8" height="15" fill="#5d4037" />
        <circle cx="0" cy="5" r="20" fill="#74c69d" />
        <circle cx="-12" cy="15" r="15" fill="#52b788" />
        <circle cx="12" cy="12" r="16" fill="#40916c" />
        <circle cx="0" cy="-10" r="18" fill="#95d5b2" />
      </g>
    )}
  </g>
);

const MapHuman: React.FC<{ x: number; y: number; color?: string; scale?: number; pose?: 'standing' | 'walking' | 'sitting'; withLaptop?: boolean; animationClass?: string }> = ({ x, y, color = '#e74c3c', scale = 1, pose = 'standing', withLaptop = false, animationClass = '' }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
     <ellipse cx="0" cy="0" rx="12" ry="4" fill="black" opacity="0.15" />
     <g className={animationClass} style={{ transformOrigin: 'bottom center' }}>
        {/* Legs */}
        {pose === 'standing' && (
            <>
              <line x1="-4" y1="0" x2="-4" y2="-25" stroke="#333" strokeWidth="4" strokeLinecap="round" />
              <line x1="4" y1="0" x2="4" y2="-25" stroke="#333" strokeWidth="4" strokeLinecap="round" />
            </>
        )}
        {pose === 'walking' && (
            <>
              <line x1="-4" y1="0" x2="-4" y2="-25" stroke="#333" strokeWidth="4" strokeLinecap="round" className="animate-legs" />
              <line x1="4" y1="0" x2="4" y2="-25" stroke="#333" strokeWidth="4" strokeLinecap="round" className="animate-legs" style={{ animationDelay: '0.4s' }} />
            </>
        )}
        {pose === 'sitting' && (
             <>
              <path d="M -4 -20 L -10 -5" stroke="#333" strokeWidth="4" strokeLinecap="round" />
              <path d="M 4 -20 L 10 -5" stroke="#333" strokeWidth="4" strokeLinecap="round" />
             </>
        )}
        
        {/* Body */}
        <path d="M 0 -25 L 0 -50" stroke={color} strokeWidth="10" strokeLinecap="round" />
        
        {/* Head */}
        <circle cx="0" cy="-58" r="7" fill="#f1c27d" />
        
        {/* Arms/Laptop */}
        {withLaptop ? (
           <g transform="translate(0, -35)">
              <rect x="-8" y="5" width="16" height="10" fill="#ccc" transform="rotate(-15)" />
              <line x1="-5" y1="-5" x2="0" y2="8" stroke={color} strokeWidth="3" />
              <line x1="5" y1="-5" x2="2" y2="8" stroke={color} strokeWidth="3" />
           </g>
        ) : (
           <>
             <line x1="0" y1="-45" x2="-10" y2="-25" stroke={color} strokeWidth="3" strokeLinecap="round" />
             <line x1="0" y1="-45" x2="10" y2="-25" stroke={color} strokeWidth="3" strokeLinecap="round" />
           </>
        )}
     </g>
  </g>
);

interface PlaygroundViewProps {
  onSelectZone: (zone: ViewType) => void;
}

const PlaygroundView: React.FC<PlaygroundViewProps> = ({ onSelectZone }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredZone, setHoveredZone] = useState<ViewType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transitioningZone, setTransitioningZone] = useState<ViewType | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Update time for the top-left UI
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // Robust Initial Centering and Resize handling
  useEffect(() => {
      const handleResize = () => {
          if (!containerRef.current) return;
          
          const containerW = containerRef.current.clientWidth;
          const containerH = containerRef.current.clientHeight;
          
          // Calculate scale to fit nicely with some padding
          // Map is 1600x1200
          const scaleX = containerW / 1800; // Add padding
          const scaleY = containerH / 1400;
          const newScale = Math.min(Math.max(scaleX, scaleY, 0.4), 1.2); // Clamp scale
          
          // Calculate centered position
          const startX = (containerW - 1600 * newScale) / 2;
          const startY = (containerH - 1200 * newScale) / 2;
          
          setScale(newScale);
          setPosition({ x: startX, y: startY });
      };

      // Run initially
      handleResize();
      
      // Add listener
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoneClick = (zone: ViewType, x: number, y: number) => {
    if (isDragging) return;
    setTransitioningZone(zone);
    
    const container = containerRef.current;
    if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const targetScale = 3.5;
        const newX = centerX - (x * targetScale);
        const newY = centerY - (y * targetScale);

        setScale(targetScale);
        setPosition({ x: newX, y: newY });
    }

    setTimeout(() => {
      onSelectZone(zone);
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- Z-INDEX SORTING & ANIMATION DEFINITIONS ---
  const mapElements = [
      // Trees
      { type: 'tree', x: 200, y: 200, props: { type: 'pine', scale: 1.5 } },
      { type: 'tree', x: 500, y: 150, props: { type: 'round', scale: 1.2 } },
      { type: 'tree', x: 1400, y: 150, props: { type: 'pine', scale: 1.8 } },
      { type: 'tree', x: 100, y: 600, props: { type: 'round', scale: 1.3 } },
      { type: 'tree', x: 1500, y: 600, props: { type: 'pine', scale: 1.4 } },
      { type: 'tree', x: 600, y: 400, props: { type: 'round', scale: 0.8 } },
      { type: 'tree', x: 1000, y: 400, props: { type: 'pine', scale: 0.9 } },
      { type: 'tree', x: 250, y: 900, props: { type: 'round', scale: 1.6 } },
      { type: 'tree', x: 1350, y: 900, props: { type: 'round', scale: 1.6 } },

      // Equipment
      { type: 'merry_go_round', x: 500, y: 850, props: { animation: 'animate-spin-slow' } },
      { type: 'spring_rider', x: 620, y: 420, props: { color: '#f1c40f', animation: 'animate-bounce-gentle' } },
      { type: 'spring_rider', x: 660, y: 440, props: { color: '#3498db', animation: 'animate-bounce-gentle-delay' } },
      { type: 'bench', x: 950, y: 680, props: { rotate: 0 } },
      { type: 'bench', x: 650, y: 950, props: { rotate: 10 } },
      { type: 'hopscotch', x: 580, y: 980 },

      // Entrance Arch
      { type: 'arch', x: 800, y: 1080 },

      // Humans
      // Note: We use the 'animation' prop to apply the movement class to the human wrapper
      { type: 'human', x: 520, y: 840, props: { color: '#e74c3c', scale: 1.2, pose: 'walking', animation: 'animate-walk-patrol' } },
      { type: 'human', x: 380, y: 280, props: { color: '#3498db', scale: 1.1 } },
      { type: 'human', x: 1180, y: 320, props: { color: '#f1c40f', scale: 1.2 } },
      { type: 'human', x: 1080, y: 850, props: { color: '#9b59b6', scale: 1.2, pose: 'walking', animation: 'animate-walk-slow' } },
      { type: 'human', x: 820, y: 580, props: { color: '#2ecc71', scale: 1.1 } },
      // Laptop User on Bench
      { type: 'human', x: 950, y: 670, props: { color: '#e67e22', scale: 1.2, pose: 'sitting', withLaptop: true } },
      { type: 'human', x: 850, y: 1120, props: { color: '#34495e', scale: 1.3, pose: 'walking', animation: 'animate-walk-wide' } },
      { type: 'human', x: 600, y: 970, props: { color: '#e91e63', scale: 0.9 } },
      // Human on other bench
      { type: 'human', x: 650, y: 940, props: { color: '#1abc9c', scale: 1.1, pose: 'sitting' } },

      // Flowers (Small details)
      { type: 'flower', x: 280, y: 450, props: { color: '#ff6b6b' } },
      { type: 'flower', x: 290, y: 460, props: { color: '#ffd93d' } },
      { type: 'flower', x: 1300, y: 750, props: { color: '#6c5ce7' } },
  ].sort((a, b) => a.y - b.y);

  return (
    <div className="relative w-full h-full bg-[#efeadd] overflow-hidden select-none cursor-grab active:cursor-grabbing font-sans">
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes sway-reverse {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes walk-patrol {
          0% { transform: translateX(0) scaleX(1); }
          45% { transform: translateX(80px) scaleX(1); }
          50% { transform: translateX(80px) scaleX(-1); }
          95% { transform: translateX(0) scaleX(-1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        @keyframes walk-slow {
          0% { transform: translateX(0) scaleX(1); }
          45% { transform: translateX(40px) scaleX(1); }
          50% { transform: translateX(40px) scaleX(-1); }
          95% { transform: translateX(0) scaleX(-1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        @keyframes walk-wide {
           0% { transform: translateX(0) scaleX(1); }
           45% { transform: translateX(-150px) scaleX(1); }
           50% { transform: translateX(-150px) scaleX(-1); }
           95% { transform: translateX(0) scaleX(-1); }
           100% { transform: translateX(0) scaleX(1); }
        }
        @keyframes leg-move {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
        }
        
        .animate-sway { animation: sway 3s ease-in-out infinite; transform-origin: top center; }
        .animate-sway-reverse { animation: sway-reverse 4s ease-in-out infinite; transform-origin: top center; }
        .animate-spin-slow { animation: spin 12s linear infinite; transform-origin: center; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; transform-origin: bottom center; }
        .animate-bounce-gentle-delay { animation: bounce-gentle 2.5s ease-in-out infinite; animation-delay: 1s; transform-origin: bottom center; }
        
        .animate-walk-patrol { animation: walk-patrol 10s linear infinite; }
        .animate-walk-slow { animation: walk-slow 8s linear infinite; }
        .animate-walk-wide { animation: walk-wide 15s linear infinite; }
        .animate-legs { animation: leg-move 0.8s ease-in-out infinite alternate; transform-origin: top center; }
      `}</style>

      {/* TOP LEFT UI */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-4">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-black/5 text-sm font-bold text-gray-700 font-mono">
             {currentTime} ▼
          </div>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-black/5 text-gray-700 hover:scale-110 transition-transform">
             <HelpCircle size={18} />
          </button>
      </div>

      {/* TOP RIGHT UI */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-black/5 text-gray-700 hover:bg-gray-50 transition-colors">
              <Menu size={24} />
          </button>
      </div>

      {/* MAP CONTAINER */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
         <div className="relative w-[1600px] h-[1200px] shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 1600 1200" className="drop-shadow-2xl">
               <defs>
                   <pattern id="grass-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                       <rect width="60" height="60" fill="#a4c688" />
                       <circle cx="15" cy="15" r="2" fill="#93b577" opacity="0.5" />
                       <circle cx="45" cy="45" r="2" fill="#93b577" opacity="0.5" />
                       <path d="M 30 10 L 32 15 L 28 15 Z" fill="#88aa6e" opacity="0.3" />
                   </pattern>
                   <pattern id="brick-pattern" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                       <rect width="20" height="10" fill="#c46b5d" />
                       <path d="M 0 0 L 20 0 M 0 0 L 0 10" stroke="#a35043" strokeWidth="1" />
                   </pattern>
                   <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.1" />
                        </feComponentTransfer>
                        <feBlend mode="multiply" in2="SourceGraphic" />
                   </filter>
                   <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.15"/>
                   </filter>
               </defs>

               {/* -- BACKGROUND -- */}
               <rect width="100%" height="100%" fill="#efeadd" filter="url(#noise)" />

               {/* -- ROADS -- */}
               <g id="Roads" stroke="#e6e0ce" strokeWidth="180" strokeLinecap="round" strokeLinejoin="round" fill="none">
                   {/* Main Loop connecting all islands */}
                   <path d="M 800 1050 C 800 900, 600 900, 400 700 C 300 600, 200 400, 400 250 C 600 100, 1000 100, 1200 250 C 1400 400, 1300 600, 1200 700 C 1000 900, 800 900, 800 1050" />
                   {/* Center Cross */}
                   <path d="M 400 250 Q 800 500 1200 700" strokeWidth="120" />
                   <path d="M 400 700 Q 800 500 1200 250" strokeWidth="120" />
               </g>
               
               {/* Road Dashed Lines */}
               <g id="RoadLines" stroke="#ffffff" strokeWidth="3" strokeDasharray="15 20" fill="none" opacity="0.6">
                   <path d="M 800 1050 C 800 900, 600 900, 400 700 C 300 600, 200 400, 400 250 C 600 100, 1000 100, 1200 250 C 1400 400, 1300 600, 1200 700 C 1000 900, 800 900, 800 1050" />
                   <path d="M 400 250 Q 800 500 1200 700" />
                   <path d="M 400 700 Q 800 500 1200 250" />
               </g>

               {/* -- ZONES (Ground Level Areas) -- */}

               {/* ZONE 1: TOP LEFT (Red Swings) */}
               <g transform="translate(350, 300)">
                  <ellipse cx="0" cy="0" rx="200" ry="150" fill="url(#grass-pattern)" filter="url(#dropShadow)" />
                  {/* Fence */}
                  <path d="M -180 -60 Q 0 -150 180 -60" fill="none" stroke="#5d4037" strokeWidth="4" strokeDasharray="15 10" />
                  <path d="M -180 -60 L -180 -30 M 0 -115 L 0 -85 M 180 -60 L 180 -30" stroke="#5d4037" strokeWidth="3" />
                  {/* Red Swings */}
                  <g transform="translate(-60, -40) scale(1.2)">
                      {/* Frame */}
                      <path d="M 0 100 L 20 0 L 40 100" fill="none" stroke="#d35454" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 100 100 L 120 0 L 140 100" fill="none" stroke="#d35454" strokeWidth="6" strokeLinecap="round" />
                      <line x1="20" y1="5" x2="120" y2="5" stroke="#d35454" strokeWidth="6" />
                      {/* Animated Swing Groups - Fixed Transform Nesting */}
                      <g transform="translate(45, 5)">
                          <g className="animate-sway">
                            <line x1="0" y1="0" x2="0" y2="55" stroke="#333" strokeWidth="1" />
                            <line x1="15" y1="0" x2="15" y2="55" stroke="#333" strokeWidth="1" />
                            <rect x="-3" y="55" width="22" height="6" fill="#000" rx="2" />
                          </g>
                      </g>
                      <g transform="translate(80, 5)">
                          <g className="animate-sway-reverse">
                            <line x1="0" y1="0" x2="0" y2="55" stroke="#333" strokeWidth="1" />
                            <line x1="15" y1="0" x2="15" y2="55" stroke="#333" strokeWidth="1" />
                            <rect x="-3" y="55" width="22" height="6" fill="#000" rx="2" />
                          </g>
                      </g>
                  </g>
               </g>

               {/* ZONE 2: TOP RIGHT (Blue Swings) */}
               <g transform="translate(1250, 300)">
                  <ellipse cx="0" cy="0" rx="180" ry="140" fill="url(#grass-pattern)" filter="url(#dropShadow)" />
                  {/* Fence */}
                  <path d="M -160 -50 Q 0 -140 160 -50" fill="none" stroke="#5d4037" strokeWidth="4" strokeDasharray="15 10" />
                  {/* Blue Swings/Activity */}
                  <g transform="translate(-40, -50) scale(1.1)">
                      <path d="M 0 80 L 10 0 L 20 80" fill="none" stroke="#5b8db8" strokeWidth="5" />
                      <path d="M 80 80 L 90 0 L 100 80" fill="none" stroke="#5b8db8" strokeWidth="5" />
                      <line x1="10" y1="5" x2="90" y2="5" stroke="#5b8db8" strokeWidth="5" />
                      {/* Tire Swing Animated - Fixed Transform Nesting */}
                      <g transform="translate(50, 5)">
                          <g className="animate-sway">
                            <line x1="0" y1="0" x2="0" y2="45" stroke="#333" strokeWidth="2" />
                            <circle cx="0" cy="60" r="15" stroke="#333" strokeWidth="8" fill="none" />
                          </g>
                      </g>
                  </g>
               </g>

               {/* ZONE 3: CENTER (Dome Climber & Sandbox) */}
               <g transform="translate(800, 550)">
                  <ellipse cx="0" cy="0" rx="220" ry="160" fill="url(#grass-pattern)" filter="url(#dropShadow)" />
                  {/* Dome Climber */}
                  <g transform="translate(-80, -40)">
                      <path d="M 0 60 Q 40 -20 80 60" fill="none" stroke="#555" strokeWidth="3" />
                      <path d="M 20 50 Q 40 10 60 50" fill="none" stroke="#555" strokeWidth="3" />
                      <line x1="10" y1="40" x2="70" y2="40" stroke="#555" strokeWidth="3" />
                      <line x1="25" y1="20" x2="55" y2="20" stroke="#555" strokeWidth="3" />
                  </g>
                  {/* Sandbox */}
                  <g transform="translate(40, 20)">
                      <rect x="0" y="0" width="80" height="60" fill="#e6c288" rx="5" stroke="#8b4513" strokeWidth="3" />
                      <path d="M 10 10 L 20 10 L 15 5 Z" fill="red" />
                      <path d="M 50 20 L 70 20 L 60 40 Z" fill="#d2b48c" opacity="0.6" />
                  </g>
               </g>

               {/* ZONE 4: BOTTOM RIGHT (Slide) -> GALLERY */}
               <g transform="translate(1100, 800)">
                  <ellipse cx="0" cy="0" rx="190" ry="140" fill="url(#grass-pattern)" filter="url(#dropShadow)" />
                  {/* Slide */}
                  <g transform={`translate(-50, -60) scale(1.3) ${hoveredZone === ViewType.GALLERY ? 'scale(1.4)' : ''} transition-transform duration-300`}>
                      <line x1="10" y1="10" x2="10" y2="70" stroke="#555" strokeWidth="2" />
                      <line x1="25" y1="10" x2="25" y2="70" stroke="#555" strokeWidth="2" />
                      <line x1="10" y1="20" x2="25" y2="20" stroke="#555" strokeWidth="2" />
                      <line x1="10" y1="35" x2="25" y2="35" stroke="#555" strokeWidth="2" />
                      <line x1="10" y1="50" x2="25" y2="50" stroke="#555" strokeWidth="2" />
                      <path d="M 25 15 Q 80 15 100 70" fill="none" stroke="#5b8db8" strokeWidth="15" strokeLinecap="round" />
                      <path d="M 25 15 Q 80 15 100 70" fill="none" stroke="#7eb5e0" strokeWidth="10" strokeLinecap="round" />
                  </g>
                  {/* Interactive Trigger for Gallery */}
                  <circle 
                    r="130" 
                    fill="transparent" 
                    className="cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleZoneClick(ViewType.GALLERY, 1100, 800); }}
                    onMouseEnter={() => setHoveredZone(ViewType.GALLERY)}
                    onMouseLeave={() => setHoveredZone(null)}
                  />
               </g>

               {/* -- SORTED SCATTERED ELEMENTS (Trees, Humans, Equipment) -- */}
               {mapElements.map((el, i) => (
                   <React.Fragment key={i}>
                       {el.type === 'tree' && <MapTree x={el.x} y={el.y} {...(el.props as any)} />}
                       {el.type === 'human' && (
                          /* Apply animation class to the wrapper group for path movement */
                          <MapHuman 
                            x={el.x} 
                            y={el.y} 
                            animationClass={el.props?.animation}
                            {...(el.props as any)} 
                          />
                       )}
                       {el.type === 'flower' && <circle cx={el.x} cy={el.y} r="4" fill={el.props?.color} />}
                       
                       {el.type === 'merry_go_round' && (
                           <g transform={`translate(${el.x}, ${el.y})`}>
                               <ellipse cx="0" cy="5" rx="50" ry="15" fill="black" opacity="0.1" />
                               {/* Spinning Part */}
                               <g className={el.props?.animation}>
                                  <ellipse cx="0" cy="0" rx="50" ry="15" fill="#f5f5f5" stroke="#ddd" strokeWidth="2" />
                                  <path d="M 0 0 L 0 -40" stroke="#bbb" strokeWidth="4" />
                                  <path d="M -30 -10 L 0 -40 L 30 -10" fill="none" stroke="#d35454" strokeWidth="3" />
                                  <circle cx="0" cy="-45" r="5" fill="#d35454" />
                               </g>
                           </g>
                       )}
                       
                       {el.type === 'spring_rider' && (
                           <g transform={`translate(${el.x}, ${el.y})`}>
                               <ellipse cx="0" cy="5" rx="15" ry="5" fill="black" opacity="0.1" />
                               <g className={el.props?.animation}>
                                  <line x1="0" y1="0" x2="0" y2="-15" stroke="#333" strokeWidth="3" />
                                  <path d="M -15 -25 L 15 -25" stroke={el.props?.color} strokeWidth="10" strokeLinecap="round" />
                                  <circle cx="10" cy="-30" r="4" fill="#ddd" />
                               </g>
                           </g>
                       )}

                       {el.type === 'bench' && (
                           <g transform={`translate(${el.x}, ${el.y}) rotate(${el.props?.rotate || 0})`}>
                               <rect x="-25" y="-10" width="50" height="20" fill="#8d6e63" rx="2" />
                               <rect x="-25" y="-15" width="50" height="5" fill="#6d4c41" rx="1" />
                               <rect x="-25" y="0" width="5" height="5" fill="#5d4037" />
                               <rect x="20" y="0" width="5" height="5" fill="#5d4037" />
                           </g>
                       )}

                       {el.type === 'hopscotch' && (
                           <g transform={`translate(${el.x}, ${el.y}) scale(1.5)`}>
                               <rect x="-10" y="0" width="20" height="15" fill="none" stroke="#eee" strokeWidth="2" />
                               <rect x="-10" y="-15" width="20" height="15" fill="none" stroke="#eee" strokeWidth="2" />
                               <rect x="-20" y="-30" width="20" height="15" fill="none" stroke="#eee" strokeWidth="2" />
                               <rect x="0" y="-30" width="20" height="15" fill="none" stroke="#eee" strokeWidth="2" />
                               <circle cx="0" cy="-45" r="10" fill="none" stroke="#eee" strokeWidth="2" />
                           </g>
                       )}

                       {el.type === 'arch' && (
                           <g transform={`translate(${el.x}, ${el.y}) scale(2)`}>
                               <path d="M -30 0 L -30 -40 Q 0 -80 30 -40 L 30 0" fill="none" stroke="#333" strokeWidth="4" />
                               <text x="0" y="-50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333" fontFamily="sans-serif">PLAYGROUND</text>
                           </g>
                       )}
                   </React.Fragment>
               ))}
            </svg>
         </div>
      </div>
    </div>
  );
};

export default PlaygroundView;
    