
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LiquidCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      return;
    }

    const particles = particlesRef.current;
    // Very high particle count to ensure continuous stream without breaking into dots
    const TOTAL_PARTICLES = 80; 
    
    // --- Physics State ---
    const head = { x: -100, y: -100 };
    const vel = { x: 0, y: 0 };
    const mouse = { x: -100, y: -100 };
    
    // Body state
    const body = Array.from({ length: TOTAL_PARTICLES - 1 }).map(() => ({ x: -100, y: -100 }));

    let isHovering = false;
    let hoverScale = 1;

    // --- Configuration for "Gooey" Flow ---
    const SPRING = 0.25; 
    const FRICTION = 0.7; // Lower friction for more "slide"
    
    // Lerp: High start means the "neck" follows instantly (merging with head)
    // Low end means the tail drags behind
    const LERP_START = 0.7; 
    const LERP_END = 0.15; 

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, textarea, [role="button"], .cursor-pointer');
      isHovering = !!interactive;
    };
    
    const onFirstMove = () => {
        head.x = mouse.x;
        head.y = mouse.y;
        body.forEach(p => { p.x = mouse.x; p.y = mouse.y; });
        
        gsap.to(containerRef.current, { opacity: 1, duration: 0.6 });
        window.removeEventListener('mousemove', onFirstMove);
    };
    
    window.addEventListener('mousemove', onFirstMove);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);

    const ticker = gsap.ticker.add((time, deltaTime) => {
      const dt = deltaTime ? Math.min(deltaTime / 16.67, 2) : 1;
      
      // 1. Head Physics (Mouse Follow)
      const ax = (mouse.x - head.x) * SPRING * dt;
      const ay = (mouse.y - head.y) * SPRING * dt;

      vel.x += ax;
      vel.y += ay;
      vel.x *= Math.pow(FRICTION, dt);
      vel.y *= Math.pow(FRICTION, dt);

      head.x += vel.x * dt;
      head.y += vel.y * dt;

      // Hover State
      const targetScale = isHovering ? 1.4 : 1;
      hoverScale += (targetScale - hoverScale) * 0.1 * dt;

      // Update Head (The leading blob)
      if (particles[0]) {
          gsap.set(particles[0], {
              x: head.x,
              y: head.y,
              scale: hoverScale,
              overwrite: 'auto'
          });
      }

      // 2. Body Chain (The liquid trail)
      body.forEach((p, i) => {
          const target = i === 0 ? head : body[i - 1];
          
          const progress = i / (TOTAL_PARTICLES - 1);
          // Tighter follow at the start to ensure head-to-body merge
          const currentLerp = LERP_START - (progress * (LERP_START - LERP_END));
          
          p.x += (target.x - p.x) * currentLerp * dt;
          p.y += (target.y - p.y) * currentLerp * dt;

          const el = particles[i + 1];
          if (el) {
              // Size Tapering:
              // We use a large base size, so even as it tapers, it overlaps well.
              // Power function keeps it thicker for longer.
              const taper = Math.max(1 - Math.pow(progress, 0.7), 0);
              
              gsap.set(el, {
                  x: p.x,
                  y: p.y,
                  // Taper but keep minimum scale to avoid sub-pixel rendering issues
                  scale: hoverScale * taper,
                  overwrite: 'auto'
              });
          }
      });
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousemove', onFirstMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[99999] opacity-0 mix-blend-difference"
    >
      <svg className="hidden">
        <defs>
          <filter id="goo">
            {/* High blur to merge particles completely */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            {/* Extreme contrast to pull edges back in crisp */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -15" 
              result="goo" 
            />
          </filter>
        </defs>
      </svg>

      <div 
        className="w-full h-full" 
        style={{ filter: 'url(#goo)' }}
      >
        {/* Render 80 particles */}
        {[...Array(80)].map((_, i) => (
          <div 
            key={i}
            ref={el => { particlesRef.current[i] = el }}
            // Large base size (w-16 h-16 = 64px) ensures massive overlap
            // This is key for the "no circles" look
            className="absolute top-0 left-0 w-16 h-16 rounded-full -mt-8 -ml-8 bg-white will-change-transform"
          />
        ))}
      </div>
    </div>
  );
};

export default LiquidCursor;
