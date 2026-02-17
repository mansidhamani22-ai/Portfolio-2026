
import React, { useEffect, useRef } from 'react';

interface StarFieldProps {
  className?: string;
}

const StarField: React.FC<StarFieldProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    
    // Track theme state to switch star color
    let isDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
        isDark = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Function to set canvas size
    const setSize = () => {
      // Use parent container dimensions if not fixed, otherwise window
      const parent = canvas.parentElement;
      if (parent) {
          width = parent.clientWidth;
          height = parent.clientHeight;
      } else {
          width = window.innerWidth;
          height = window.innerHeight;
      }
      canvas.width = width;
      canvas.height = height;
    };
    
    interface Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      speed: number;
      offset: number;
    }

    let stars: Star[] = [];

    const generateStars = () => {
        const starsArray: Star[] = [];
        // Reduced density
        const starCount = Math.floor((width * height) / 6000); 

        let attempts = 0;
        // Attempt to place stars without overlapping
        while (starsArray.length < starCount && attempts < starCount * 10) {
            attempts++;
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 0.5 + Math.random() * 1.5;
            
            // Overlap check
            let overlapping = false;
            for (const star of starsArray) {
                const dx = star.x - x;
                const dy = star.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) { 
                    overlapping = true;
                    break;
                }
            }

            if (!overlapping) {
                starsArray.push({
                    x,
                    y,
                    size,
                    baseOpacity: 0.15 + Math.random() * 0.25, // Subtle base opacity
                    speed: 0.005 + Math.random() * 0.015,
                    offset: Math.random() * Math.PI * 2
                });
            }
        }
        return starsArray;
    };

    // Initial setup
    setSize();
    stars = generateStars();

    const handleResize = () => {
      setSize();
      stars = generateStars();
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;
      
      // Determine star color based on current theme
      const rgb = isDark ? '255, 255, 255' : '30, 30, 30';

      stars.forEach(star => {
        // Subtle twinkle
        const sparkle = 0.8 + 0.2 * Math.sin(time * (star.speed * 100) + star.offset);
        let opacity = star.baseOpacity * sparkle;
        
        // Increase opacity slightly in day mode so black stars are visible but subtle
        if (!isDark) {
            opacity = Math.min(1, opacity * 1.5);
        }
        
        ctx.fillStyle = `rgba(${rgb}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`pointer-events-none transition-opacity duration-1000 ${className || 'fixed inset-0 z-0'}`} />;
};

export default StarField;
