
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
  
  // Handle Custom Cursor Icon
  useEffect(() => {
    const cursorStyle = document.createElement('style');
    
    // Authentic Adobe Illustrator Pen Tool Icon (Upright)
    // Features: High-contrast nib, center slit, and mode indicator box
    const penSvg = encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="dropShadow" x="-1" y="-1" width="34" height="34">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" flood-opacity="0.4"/>
        </filter>
        <g filter="url(#dropShadow)">
            <!-- Nib Body -->
            <path d="M16 2 L25 17 C25 21 22 24 19 24 L19 27 H13 L13 24 C10 24 7 21 7 17 L16 2Z" fill="#FFFFFF" stroke="#000000" stroke-width="2" stroke-linejoin="round"/>
            <!-- Center Slit -->
            <path d="M16 7 V20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Center Hole -->
            <circle cx="16" cy="21" r="1.2" fill="#000000"/>
        </g>
        <!-- Mode Indicator (Star/Asterisk Box) -->
        <g transform="translate(20, 18)">
            <rect x="0" y="0" width="11" height="9" rx="1" fill="#1a1a1a" stroke="#FFFFFF" stroke-width="1"/>
            <!-- Asterisk -->
            <path d="M5.5 2 V7 M3 4.5 H8 M3.5 3 L7.5 6 M3.5 6 L7.5 3" stroke="white" stroke-width="1" stroke-linecap="round"/>
        </g>
      </svg>
    `);

    // Hotspot is set to 16 0 (Top Center - The Tip)
    cursorStyle.innerHTML = `
      body, a, button, input, textarea, .cursor-pointer {
        cursor: url("data:image/svg+xml;charset=utf-8,${penSvg}") 16 0, auto !important;
      }
    `;
    document.head.appendChild(cursorStyle);

    return () => {
      document.head.removeChild(cursorStyle);
    };
  }, [theme]);
  
  // Handle Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration for the "Orange Path" look
    const LINE_WIDTH = 2; // Thinner, like a vector path
    const DECAY_RATE = 0.008; // Trail length
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
          
          // Orange Trail Color (Orange-500: #f97316)
          ctx.strokeStyle = `rgba(249, 115, 22, ${p1.life})`;
          ctx.stroke();

          // Anchor Points (Vector nodes look)
          // Draw small white squares with orange borders along the path
          if (i % 6 === 0 && p1.life > 0.6) {
             ctx.fillStyle = '#fff'; // White center
             ctx.strokeStyle = '#f97316'; // Orange border
             ctx.lineWidth = 1;
             const size = 4;
             // Draw filled square
             ctx.fillRect(p1.x - scrollX - size/2, p1.y - scrollY - size/2, size, size);
             // Draw border
             ctx.strokeRect(p1.x - scrollX - size/2, p1.y - scrollY - size/2, size, size);
             
             // Reset line width for path
             ctx.lineWidth = LINE_WIDTH; 
             ctx.strokeStyle = `rgba(249, 115, 22, ${p1.life})`;
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

  return (
    <div className="fixed inset-0 z-[100002] pointer-events-none overflow-hidden mix-blend-normal">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};

export default PenToolBackground;
