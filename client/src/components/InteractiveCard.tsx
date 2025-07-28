import React, { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotate({
      x: yPct * -12, // Invert for natural feel
      y: xPct * 12,
    });
    
    setShine({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShine({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(20px)`,
        }}
        className="relative w-full h-full transition-transform duration-100 ease-out"
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.2), transparent 40%)`,
              opacity: shine.opacity,
              transition: 'opacity 0.2s ease-out',
            }}
          />
        </div>
        <div style={{ transform: 'translateZ(40px)' }} className="relative h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveCard; 