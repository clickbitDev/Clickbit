import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

type AnimatedNumberProps = {
  to: number;
  from?: number;
  duration?: number;
  trigger?: 'auto' | 'scroll';
};

const AnimatedNumber = ({ to, from = 0, duration = 2, trigger = 'auto' }: AnimatedNumberProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // If trigger is 'auto', start animation immediately
    if (trigger === 'auto') {
      setIsVisible(true);
      return;
    }

    // For scroll trigger, use Intersection Observer with a small delay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Add a small delay to ensure the element is fully visible
            setTimeout(() => {
          
              setIsVisible(true);
              setHasAnimated(true);
            }, 100);
            observer.disconnect(); // Stop observing once triggered
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger when element is 100px from bottom of viewport
      }
    );

    // Start observing after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      observer.observe(node);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [trigger, hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => {
        setDisplayValue(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [isVisible, from, to, duration]);

  return <span ref={nodeRef}>{displayValue}</span>;
};

export default AnimatedNumber; 