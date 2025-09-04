"use client";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useTranslation } from "react-i18next";

type ButtonProps = {
    icon?: any;
    text?: string;
    className?: string;
    textSize?: string;
    bgColor?: string;
    onClick?: (event: React.MouseEvent) => void;
    disabled?: boolean;
};

const Button = ({ icon, text, className, bgColor, onClick, disabled = false }: ButtonProps) => {
    const [isMouseOnBtn, setIsMouseOnBtn] = useState<boolean>(false);
    const dark = useSelector((state: RootState) => state.theme.dark);
    const { i18n } = useTranslation();

    const currentLang = i18n.language as 'en' | 'fa';
    const isFarsi = currentLang === 'fa';

    // Handle disabled state styling
    const backgroundClasses = disabled
        ? (dark ? 'bg-slate-700' : 'bg-gray-300') // Disabled colors
        : bgColor
            ? bgColor
            : dark
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800';

    const textClasses = disabled
        ? (dark ? 'text-slate-400' : 'text-gray-500') // Disabled text colors
        : dark
            ? 'text-slate-900 font-semibold'
            : 'text-white';

    const handleClick = (event: React.MouseEvent) => {
        // Prevent click when disabled
        if (disabled) return;

        // Stop the click event from propagating to parent elements
        event.stopPropagation();
        onClick?.(event); // Call the provided onClick handler, if it exists
    };

    return (
        <div
            className={`btn-wrapper flex md:w-fit ${isMouseOnBtn && !disabled ? 'btn-wrapper-hover' : ''}`}
            onMouseEnter={() => !disabled && setIsMouseOnBtn(true)}
            onMouseLeave={() => setIsMouseOnBtn(false)}
        >
            <button
                className={`
                    w-full md:w-fit py-2 md:py-2 px-3 md:px-4
                    transition-all duration-1000 flex justify-center items-center gap-3
                    rounded-full text-sm md:text-base 
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                    ${backgroundClasses}
                    ${textClasses}
                `}
                onClick={handleClick}
                disabled={disabled}
            >
                {icon}
                <label className={`whitespace-nowrap ${isFarsi && 'text-sm'} ${!disabled && 'cursor-pointer'}`}>{text}</label>
            </button>
        </div>
    );
};

export default Button;