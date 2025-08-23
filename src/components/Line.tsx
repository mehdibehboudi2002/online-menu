'use client';

import { useInView } from 'react-intersection-observer';

type LineProps = {
    className?: string;
    width?: string;
    isAnimated?: boolean;
}

export default function Line({ className, width, isAnimated = false }: LineProps) {
    const isCustomWidth = !!width;

    // Call the hook unconditionally at the top level
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Define animation classes based on the inView status and isAnimated prop
    const animationClasses = isAnimated && !inView
        ? 'opacity-0 translate-y-4'
        : 'opacity-100 translate-y-0 transition-all duration-700 ease-out';

    // Conditionally apply the ref only if isAnimated is true
    const rootRef = isAnimated ? ref : null;

    return (
        // Apply the ref and animation classes to the outermost container
        <div ref={rootRef} className={`${className} ${animationClasses}`} style={{ position: 'relative' }}>
            <svg
                viewBox="0 0 120 10"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: width || '95vw',
                    height: '5px',
                    pointerEvents: 'none',
                }}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d={`M0 2 
    Q10 7.3 20 4 
    T40 ${isCustomWidth ? '6.4' : '6.4'} 
    T60 7.8 
    T80 7.2 
    T100 7 
    T120 8.1`}
                    stroke="#bedbff"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}