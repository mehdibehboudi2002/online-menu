"use client";
import React, { useEffect, useState } from 'react';
import Pointer from "./icons/Pointer";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const ScrollToTop = () => {
    // 1. Call the hook unconditionally.
    const dark = useSelector((state: RootState) => state.theme.dark);

    // 2. Use a state variable to track if the component has mounted.
    const [isMounted, setIsMounted] = useState(false);

    // 3. Set `isMounted` to true after the component has mounted on the client.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 4. Conditionally determine the background class based on the theme.
    const bgClassName = isMounted && dark ? 'bg-white/90' : 'bg-green-700/90';

    // 5. Conditionally determine the color prop to pass.
    const pointerColor = isMounted ? (dark ? '#158f42' : '#fff') : undefined;

    return (
        <Pointer
            direction={'top'}
            showOnScroll={true}
            isScrollToTop={true}
            color={pointerColor}
            className={`fixed bottom-4 right-4 md:bottom-7 md:right-7 z-50 ${bgClassName} backdrop-blur-sm rounded-full p-[5px] md:p-1.5 shadow-lg`}
        />
    );
};

export default ScrollToTop;