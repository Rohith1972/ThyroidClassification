import React, { useEffect, useState, useMemo } from 'react';

const ThunderBackground = () => {
    const [strikes, setStrikes] = useState([]);

    // Configuration for the lightning effect
    const MAX_STRIKES = 3;
    const MIN_INTERVAL = 2000;
    const MAX_INTERVAL = 8000;

    // Generate random coordinates and properties for a strike
    const createStrike = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const x = Math.random() * 100; // Percentage width
        const y = Math.random() * 50;  // Start in upper half

        // Complex SVG path for a lightning bolt
        const generatePath = () => {
            let path = `M ${x} ${y} `;
            let currentX = x;
            let currentY = y;
            const segments = Math.floor(Math.random() * 5) + 4;

            for (let i = 0; i < segments; i++) {
                currentX += (Math.random() * 10) - 5; // Jagged X movement
                currentY += (Math.random() * 20) + 10; // Downward Y movement
                path += `L ${currentX} ${currentY} `;
            }
            return path;
        };

        return {
            id,
            path: generatePath(),
            left: `${x}%`,
            top: `${y}%`,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.6,
            duration: Math.random() * 0.2 + 0.1, // Very fast flash
        };
    };

    useEffect(() => {
        let timeoutId;

        const scheduleNextStrike = () => {
            const nextInterval = Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;

            timeoutId = setTimeout(() => {
                setStrikes(current => {
                    // Randomly decide how many branches this strike has (1-3)
                    const numBranches = Math.floor(Math.random() * 3) + 1;
                    const newStrikes = Array.from({ length: numBranches }, createStrike);

                    // Keep only the most recent strikes
                    return [...newStrikes, ...current].slice(0, MAX_STRIKES);
                });

                scheduleNextStrike();
            }, nextInterval);
        };

        scheduleNextStrike();

        return () => clearTimeout(timeoutId);
    }, []);

    // Clean up old strikes periodically
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            setStrikes(current => {
                if (current.length > 0) {
                    // Remove the oldest strike to simulate fade out
                    return current.slice(0, current.length - 1);
                }
                return current;
            });
        }, 300); // Clean up fast

        return () => clearInterval(cleanupInterval);
    }, []);


    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
            {/* Base atmospheric dark clouds gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#020617] to-[#020617] opacity-80"></div>

            {/* Global Ambient Flash effect that triggers when strikes happen */}
            <div
                className="absolute inset-0 bg-indigo-400/5 mix-blend-screen transition-opacity duration-75"
                style={{ opacity: strikes.length > 0 ? 0.8 : 0 }}
            />

            {/* Render the actual lightning bolts as SVGs */}
            <svg className="absolute inset-0 w-full h-full preserve-3d" style={{ filter: 'drop-shadow(0 0 15px rgba(129, 140, 248, 0.8))' }}>
                {strikes.map((strike) => (
                    <g key={strike.id} style={{
                        transformOrigin: `${strike.left} ${strike.top}`,
                        transform: `scale(${strike.scale})`
                    }}>
                        {/* Main bright core */}
                        <path
                            d={strike.path}
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                            className="animate-lightning-flash"
                            style={{
                                animationDuration: `${strike.duration}s`,
                            }}
                        />
                        {/* Outer blue glow */}
                        <path
                            d={strike.path}
                            stroke="#818cf8"
                            strokeWidth="8"
                            fill="none"
                            className="animate-lightning-flash blur-sm mix-blend-screen"
                            style={{
                                animationDuration: `${strike.duration}s`,
                                opacity: 0.6
                            }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default ThunderBackground;
