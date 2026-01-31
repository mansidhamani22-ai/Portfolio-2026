
import React, { useEffect, useRef } from 'react';

interface PenToolBackgroundProps {
  theme: 'light' | 'dark';
}

interface Point {
  x: number; // Page coordinates
  y: number; // Page coordinates
  life: number; // 1.0 to 0.0
}

const PenToolBackground: React.FC<PenToolBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef<{x: number, y: number} | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const LINE_WIDTH = 3;
    const DECAY_RATE = 0.010; // Lower = longer trail
    const MIN_DIST = 2; // Capture resolution

    // High DPI Scaling
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const addPoint = (pageX: number, pageY: number) => {
      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      if (lastPoint) {
        // Distance check
        const dist = Math.hypot(pageX - lastPoint.x, pageY - lastPoint.y);
        if (dist < MIN_DIST) return; 
      }

      pointsRef.current.push({
        x: pageX,
        y: pageY,
        life: 1.0
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Store client coordinates for scroll calculations
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Store point in absolute document coordinates
      addPoint(e.pageX, e.pageY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Store client coordinates for scroll calculations
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
        // Store point in absolute document coordinates
        addPoint(touch.pageX, touch.pageY);
      }
    };

    const handleScroll = () => {
      // If we know where the mouse/touch is relative to the viewport, 
      // scrolling means the input position is traversing the document.
      if (mouseRef.current) {
        const pageX = mouseRef.current.x + window.scrollX;
        const pageY = mouseRef.current.y + window.scrollY;
        addPoint(pageX, pageY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Passive listener allows scrolling performance to remain high while capturing touches
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      pointsRef.current.forEach(p => p.life -= DECAY_RATE);
      pointsRef.current = pointsRef.current.filter(p => p.life > 0);

      if (pointsRef.current.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = LINE_WIDTH;

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        for (let i = 0; i < pointsRef.current.length - 1; i++) {
          const p1 = pointsRef.current[i];
          const p2 = pointsRef.current[i + 1];

          ctx.beginPath();
          // Convert Page coordinates back to Viewport coordinates for drawing on fixed canvas
          ctx.moveTo(p1.x - scrollX, p1.y - scrollY);
          ctx.lineTo(p2.x - scrollX, p2.y - scrollY);
          
          // Orange trail
          ctx.strokeStyle = `rgba(249, 115, 22, ${p1.life})`;
          ctx.stroke();

          // White Anchor Points
          if (i % 8 === 0 && p1.life > 0.6) {
             ctx.fillStyle = `rgba(255, 255, 255, ${p1.life})`;
             ctx.fillRect(p1.x - scrollX - 2, p1.y - scrollY - 2, 4, 4);
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, [theme]);

  // Z-index set to 100002 to be higher than the mobile menu (99999) and close button (100000)
  return (
    <div className="fixed inset-0 z-[100002] pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};

export default PenToolBackground;
