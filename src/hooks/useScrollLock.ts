import { useEffect, useRef } from 'react';

// A counter to track the number of components that want to lock the scroll.
const scrollLockManager = {
  count: 0,
  isLocked: false,
};

export const useScrollLock = (lock: boolean) => {
  const isLockedByThisComponent = useRef(false);

  useEffect(() => {
    // If the component needs the lock and hasn't already requested it
    if (lock && !isLockedByThisComponent.current) {
      scrollLockManager.count += 1;
      isLockedByThisComponent.current = true;
    } 
    // If the component no longer needs the lock and had previously requested it
    else if (!lock && isLockedByThisComponent.current) {
      scrollLockManager.count -= 1;
      isLockedByThisComponent.current = false;
    }

    // Apply or remove the lock based on the centralized count
    if (scrollLockManager.count > 0 && !scrollLockManager.isLocked) {
      const scrollY = window.scrollY;
      document.body.style.setProperty('--scroll-y', `${scrollY}px`);
      document.body.classList.add('modal-scroll-lock');
      document.body.style.top = `-${scrollY}px`;
      scrollLockManager.isLocked = true;
    } 
    
    // Cleanup function: This is crucial for handling the unmount.
    return () => {
      // If this component was responsible for locking the scroll
      if (isLockedByThisComponent.current) {
        scrollLockManager.count -= 1;
        isLockedByThisComponent.current = false;
        
        // If this was the last component requesting the lock, remove it.
        if (scrollLockManager.count === 0 && scrollLockManager.isLocked) {
          const scrollY = document.body.style.getPropertyValue('--scroll-y');
          document.body.classList.remove('modal-scroll-lock');
          document.body.style.top = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY) || 0);
          }
          scrollLockManager.isLocked = false;
        }
      }
    };
  }, [lock]);
};