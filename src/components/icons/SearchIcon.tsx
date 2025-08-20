import React, { useState } from 'react';

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
    size?: string;
    bgColor?: string;
    color?: string; 
    iconColor?: string; 
    hasBorder?: boolean;
    borderWidth?: number;
    hoverBgColor?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({
    size = "28",
    bgColor = "#fff",
    color, // New color prop
    iconColor,
    hasBorder = false,
    borderWidth = 6,
    hoverBgColor = "#dcfce7",
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Generate unique IDs for each component instance to avoid conflicts
    const uniqueId = React.useId();
    const circleGradientId = `searchIconCircleGradient-${uniqueId}`;
    const handleGradientId = `searchIconHandleGradient-${uniqueId}`;
    const borderGradientId = `searchIconBorderGradient-${uniqueId}`;

    const iconGradient = (
        <defs>
            <linearGradient id={circleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "yellow", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "red", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "red", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id={handleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "red", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "red", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "pink", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id={borderGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "yellow", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "red", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "red", stopOpacity: 1 }} />
            </linearGradient>
        </defs>
    );

    // Priority: color prop > iconColor prop > gradient (default)
    const finalIconColor = color || iconColor;
    const circleIconFill = finalIconColor || `url(#${circleGradientId})`;
    const handleIconFill = finalIconColor || `url(#${handleGradientId})`;
    
    const finalBgFill = isHovered ? hoverBgColor : (bgColor || "rgb(25,52,127)");

    const borderStroke = hasBorder ? `url(#${borderGradientId})` : "none";
    const finalBorderWidth = hasBorder ? borderWidth : 0;

    const effectiveIconSize = 90 * 2.81; // The maximum extent of the icon itself
    const effectiveBorderSpace = (borderWidth * 2.81) / 2; // Half of the scaled border width

    const newViewBoxSize = effectiveIconSize + (effectiveBorderSpace * 2) + 5; // Add some extra padding (e.g., 5 units)
    const newViewBoxString = `0 0 ${newViewBoxSize} ${newViewBoxSize}`;

    const translateX = (newViewBoxSize / 2) - (45 * 2.81);
    const translateY = (newViewBoxSize / 2) - (45 * 2.81);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width={size}
            height={size}
            viewBox={newViewBoxString} // Use the calculated viewBox
            xmlSpace="preserve"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {iconGradient}

            <g style={{
                stroke: "none",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                fill: "none",
                fillRule: "nonzero",
                opacity: 1
            }}
                // Apply calculated transform to center and scale
                transform={`translate(${translateX} ${translateY}) scale(2.81 2.81)`}
            >
                <circle
                    cx="45"
                    cy="45"
                    r="45"
                    style={{
                        stroke: borderStroke,
                        strokeWidth: finalBorderWidth,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: finalBgFill,
                        fillRule: "nonzero",
                        opacity: 1,
                        transition: "0.4s"
                    }}
                    transform="matrix(1 0 0 1 0 0)" // This transform inside circle is redundant if group is transformed
                />
                <path
                    d="M 39.205 56.741 c -4.518 0 -9.035 -1.72 -12.475 -5.159 c -6.879 -6.879 -6.879 -18.072 0 -24.95 c 6.877 -6.878 18.071 -6.879 24.95 0 v 0 c 6.878 6.878 6.878 18.071 0 24.95 C 48.24 55.021 43.723 56.741 39.205 56.741 z M 39.205 27.47 c -2.981 0 -5.962 1.135 -8.232 3.404 c -4.539 4.539 -4.539 11.925 0 16.465 c 4.539 4.538 11.925 4.538 16.465 0 c 4.539 -4.54 4.539 -11.926 0 -16.466 C 45.167 28.605 42.186 27.47 39.205 27.47 z"
                    style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: circleIconFill,
                        fillRule: "nonzero",
                        opacity: 1
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
                <path
                    d="M 65.276 68.179 c -0.768 0 -1.535 -0.293 -2.121 -0.879 L 47.438 51.582 c -1.172 -1.171 -1.172 -3.071 0 -4.242 c 1.172 -1.172 3.07 -1.172 4.242 0 l 15.718 15.718 c 1.172 1.171 1.172 3.071 0 4.242 C 66.812 67.886 66.044 68.179 65.276 68.179 z"
                    style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: handleIconFill,
                        fillRule: "nonzero",
                        opacity: 1
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
};

export default SearchIcon;