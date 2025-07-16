'use client';

type LineProps = {
    className?: string;
    width?: string;
}

export default function Line({ className, width }: LineProps) {
    const isCustomWidth = !!width;

    return (
        <div className={className} style={{ position: 'relative' }}>
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
