import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DataStreamBg = () => {
    const [streams, setStreams] = useState([]);

    useEffect(() => {
        // Generate a fixed number of vertical streams
        const generateStreams = () => {
            const streamCount = typeof window !== 'undefined' ? Math.floor(window.innerWidth / 40) : 30; // One stream every ~40px
            const newStreams = Array.from({ length: streamCount }).map((_, i) => ({
                id: i,
                left: `${(i / streamCount) * 100}%`,
                delay: Math.random() * 5, // Random start delay
                duration: 10 + Math.random() * 15, // Slow fall (10-25s)
                opacity: 0.03 + Math.random() * 0.05, // Extremely faint
                height: 20 + Math.random() * 50 // Varied heights (20-70%)
            }));
            setStreams(newStreams);
        };

        generateStreams();
        window.addEventListener('resize', generateStreams);
        return () => window.removeEventListener('resize', generateStreams);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
            {streams.map((stream) => (
                <motion.div
                    key={stream.id}
                    className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-brand-500 to-transparent"
                    style={{
                        left: stream.left,
                        height: `${stream.height}%`,
                        opacity: stream.opacity,
                    }}
                    animate={{
                        y: ['-100%', '200vh'], // Fall from above screen to well below
                    }}
                    transition={{
                        duration: stream.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: stream.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default DataStreamBg;
