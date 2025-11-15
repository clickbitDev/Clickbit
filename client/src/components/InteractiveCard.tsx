import React, { useRef, ReactNode, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

export interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cachedRectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // Use motion values for smooth interpolation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);
  const shineOpacity = useMotionValue(0);

  // Spring animations for smooth, natural movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
    mass: 0.1,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 18,
    mass: 0.1,
  });

  const springShineX = useSpring(shineX, {
    stiffness: 150,
    damping: 20,
    mass: 0.1,
  });
  const springShineY = useSpring(shineY, {
    stiffness: 150,
    damping: 20,
    mass: 0.1,
  });
  const springShineOpacity = useSpring(shineOpacity, {
    stiffness: 200,
    damping: 25,
    mass: 0.1,
  });

  // Combine shine position into background gradient string
  const shineBackground = useMotionValue('radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 40%)');
  
  // Update background when shine position changes
  useMotionValueEvent(springShineX, 'change', (latestX) => {
    const y = springShineY.get();
    shineBackground.set(`radial-gradient(circle at ${latestX}% ${y}%, rgba(255, 255, 255, 0.15), transparent 40%)`);
  });
  
  useMotionValueEvent(springShineY, 'change', (latestY) => {
    const x = springShineX.get();
    shineBackground.set(`radial-gradient(circle at ${x}% ${latestY}%, rgba(255, 255, 255, 0.15), transparent 40%)`);
  });

  // Cache rect on mount and resize
  const updateCachedRect = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    cachedRectRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  // Update cached rect on mouse enter instead of during mouse move
  const handleMouseEnter = useCallback(() => {
    updateCachedRect();
    shineOpacity.set(1);
  }, [updateCachedRect, shineOpacity]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { left, top, width, height } = cachedRectRef.current;
    
    // Use cached rect values to avoid getBoundingClientRect on every mousemove
    const mouseXValue = e.clientX - left;
    const mouseYValue = e.clientY - top;

    const xPct = mouseXValue / width - 0.5;
    const yPct = mouseYValue / height - 0.5;

    // Update motion values (will be smoothly interpolated by springs)
    mouseX.set(xPct);
    mouseY.set(yPct);
    
    shineX.set((mouseXValue / width) * 100);
    shineY.set((mouseYValue / height) * 100);
  }, [mouseX, mouseY, shineX, shineY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    shineX.set(50);
    shineY.set(50);
    shineOpacity.set(0);
  }, [mouseX, mouseY, shineX, shineY, shineOpacity]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
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
          rotateX: rotateX,
          rotateY: rotateY,
          z: 15,
          willChange: 'transform',
        }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
          <motion.div
            className="absolute inset-0"
            style={{
              background: shineBackground,
              opacity: springShineOpacity,
              willChange: 'opacity, background',
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