'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Cart from './Cart';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/hooks/useScrollLock';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { i18n } = useTranslation();
  const dark = useSelector((state: RootState) => state.theme.dark);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startY, setStartY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);

  // Refs for backdrop drag detection 
  const backdropDraggedRef = useRef(false);
  const backdropStartPosRef = useRef({ x: 0, y: 0 });
  const modalContentElementRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language as 'en' | 'fa';
  const isFarsi = currentLang === 'fa';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      setShouldRender(true);
      setDragOffset(0); // Reset drag offset when opening
      timeoutId = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      timeoutId = setTimeout(() => setShouldRender(false), 300);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
  const handleCloseAllModals = () => {
    onClose();
  };
  
  window.addEventListener('close-all-modals', handleCloseAllModals);
  return () => {
    window.removeEventListener('close-all-modals', handleCloseAllModals);
  };
}, [onClose]);

useScrollLock(isOpen);

  // Drag handlers
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    dragStartRef.current = clientY;
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const deltaY = clientY - startY;
    // Only allow dragging downward (positive deltaY)
    const newOffset = Math.max(0, deltaY);
    setDragOffset(newOffset);
  }, [isDragging, startY]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // If dragged more than 100px down, close the modal
    if (dragOffset > 100) {
      onClose();
    } else {
      // Snap back to original position
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, onClose]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start drag from the handle area or top part of modal
    const touch = e.touches[0];
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect && touch.clientY - rect.top < 60) {
      handleDragStart(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault(); // Prevent scrolling while dragging
      handleDragMove(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events (for testing on desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only on mobile-sized screens and only from handle area
    if (window.innerWidth >= 768) return;

    const rect = modalRef.current?.getBoundingClientRect();
    if (rect && e.clientY - rect.top < 60) {
      e.preventDefault();
      handleDragStart(e.clientY);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientY);
    }
  }, [isDragging, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!shouldRender) {
    return null;
  }

  // Backdrop drag handlers 
  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    // Only track if the click is on the backdrop itself (not the modal content)
    if (modalContentElementRef.current && !modalContentElementRef.current.contains(e.target as Node)) {
      backdropDraggedRef.current = false;
      backdropStartPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleBackdropMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Check if the left mouse button is held down
      const distance = Math.sqrt(
        Math.pow(e.clientX - backdropStartPosRef.current.x, 2) +
        Math.pow(e.clientY - backdropStartPosRef.current.y, 2)
      );
      if (distance > 10) { // A threshold of 10 pixels to detect a drag
        backdropDraggedRef.current = true;
      }
    }
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    // Only handle if the mouse up is on the backdrop and no drag was detected
    if (modalContentElementRef.current && !modalContentElementRef.current.contains(e.target as Node)) {
      if (!backdropDraggedRef.current) {
        onClose();
      }
    }
  };

  // Calculate opacity based on drag offset
  const backdropOpacity = Math.max(0.5 - (dragOffset / 300), 0);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center transition-all duration-300 ease-in-out ${!isAnimating && 'pointer-events-none'
        }`}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
        backdropFilter: 'blur(4px)',
      }}
      onMouseDown={handleBackdropMouseDown}
      onMouseMove={handleBackdropMouseMove}
      onMouseUp={handleBackdropMouseUp}
    >
      {/* Modal Content */}
      <div
        ref={(el) => {
          modalRef.current = el;
          modalContentElementRef.current = el;
        }}
         className={`relative w-full md:w-[600px] lg:w-[700px] max-h-[85vh] md:max-h-[86vh] mx-0 md:mx-4 pb-10 md:pb-0
          transition-all ease-in-out
          rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden
          ${dark ? 'bg-slate-800 border-t-2 md:border border-slate-700' : 'bg-white border-t-2 md:border border-green-100'}
          ${isDragging ? 'duration-0' : 'duration-300'}
        `}
        style={{
          transform: `translateY(${isAnimating
            ? dragOffset + 'px'
            : window.innerWidth >= 768
              ? '0px'
              : '100%'
            }) ${window.innerWidth >= 768 ? `scale(${isAnimating ? 1 : 0.95})` : ''}`,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Handle bar for mobile */}
        <div className="md:hidden flex justify-center py-3 cursor-grab active:cursor-grabbing select-none">
          <div
            className={`w-10 h-1 rounded-full transition-colors duration-200 ${isDragging
              ? (dark ? 'bg-slate-400' : 'bg-gray-400')
              : (dark ? 'bg-slate-600' : 'bg-gray-300')
              }`}
          />
        </div>

        {/* Close button for desktop */}
        <button
          onClick={onClose}
          className={`hidden md:flex justify-center items-center absolute top-5 ${!isFarsi ? 'right-2' : 'left-2'} 
           z-10 p-2 rounded-full transition-colors duration-300 cursor-pointer 
           ${dark ? 'hover:bg-slate-700 text-blue-200' : 'hover:bg-green-100 text-green-600'
            }`
          }
        >
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Cart content */}
        <div
          className="overflow-y-auto max-h-full"
          style={{
            // Prevent scrolling when dragging
            touchAction: isDragging ? 'none' : 'auto',
          }}
        >
          <Cart />
        </div>
      </div>
    </div>
  );
}