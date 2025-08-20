"use client";
import React from 'react';

type Direction = 'bottom' | 'top' | 'left' | 'right';

type PointerProps = {
  onClick?: () => void;
  className?: string;
  color?: string;
  size?: number;
  text?: string;
  targetId?: string;
  offset?: number;
  direction?: Direction | number;
  animated?: boolean;
  showOnScroll?: boolean;
  scrollThreshold?: number;
  isScrollToTop?: boolean;
};

const Pointer = ({
  onClick,
  className = '',
  color = '#158f42',
  size = 24,
  text,
  targetId,
  offset = 0,
  direction = 'bottom',
  animated = true,
  showOnScroll = false,
  scrollThreshold = 300,
  isScrollToTop = false
}: PointerProps) => {

  const [isVisible, setIsVisible] = React.useState(!showOnScroll);

  // Calculate rotation based on direction - DECLARE THIS FIRST
  const getRotation = () => {
    if (typeof direction === 'number') {
      return direction;
    }

    switch (direction) {
      case 'top': return 180;
      case 'left': return 90;
      case 'right': return -90;
      case 'bottom':
      default: return 0;
    }
  };

  const rotation = getRotation();

  // Handle scroll visibility
  React.useEffect(() => {
    if (!showOnScroll) return;

    const toggleVisibility = () => {
      if (window.pageYOffset > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showOnScroll, scrollThreshold]);

  // Create unique animation keyframes for this instance
  const animationKeyframes = `
    @keyframes floatTogether-${rotation} {
      0% {
        transform: rotate(${rotation}deg) translateY(-6px);
      }
      50% {
        transform: rotate(${rotation}deg) translateY(6px);
      }
      100% {
        transform: rotate(${rotation}deg) translateY(-6px);
      }
    }
  `;

  // Inject styles dynamically
  React.useEffect(() => {
    if (!animated) return;

    const styleElement = document.createElement('style');
    styleElement.textContent = animationKeyframes;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [animated, rotation, animationKeyframes]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isScrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const elementTop = element.offsetTop;
        window.scrollTo({
          top: elementTop + offset,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center select-none transition-all duration-500 ease-in-out transform ${isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        } ${(onClick || targetId || isScrollToTop) ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleClick}
    >
      {/* Arrows container */}
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          animation: animated ? `floatTogether-${rotation} 2s ease-in-out infinite` : 'none'
        }}
      >
        {/* First Arrow */}
        <svg
          width={size * 1.5}
          height={size}
          viewBox="0 0 36 24"
          fill="none"
          style={{ opacity: '.8' }}
        >
          <path
            d="M10 10L18 15L26 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Second Arrow */}
        <svg
          width={size * 1.5}
          height={size}
          viewBox="0 0 36 24"
          fill="none"
          style={{ marginTop: '-12px' }}
        >
          <path
            d="M10 10L18 15L26 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Optional text */}
      {text && (
        <span className="text-xs mt-2 opacity-70 font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

export default Pointer;