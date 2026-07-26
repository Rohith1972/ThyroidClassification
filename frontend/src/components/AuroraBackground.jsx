import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AuroraBackground = () => {
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();

    useEffect(() => {
        controls1.start({
            x: ["0%", "50%", "-20%", "0%"],
            y: ["0%", "-30%", "20%", "0%"],
            scale: [1, 1.2, 0.9, 1],
            transition: { duration: 25, ease: "linear", repeat: Infinity }
        });

        controls2.start({
            x: ["0%", "-40%", "30%", "0%"],
            y: ["0%", "40%", "-10%", "0%"],
            scale: [1, 1.1, 1.3, 1],
            transition: { duration: 30, ease: "linear", repeat: Infinity }
        });

        controls3.start({
            x: ["0%", "30%", "-40%", "0%"],
            y: ["0%", "20%", "-30%", "0%"],
            scale: [1, 0.8, 1.1, 1],
            transition: { duration: 28, ease: "linear", repeat: Infinity }
        });
    }, [controls1, controls2, controls3]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505] pointer-events-none">
            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 z-10 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Aurora Orbs */}
            <motion.div animate={controls1} className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 mix-blend-screen"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)' }} />
            
            <motion.div animate={controls2} className="absolute top-[30%] -right-[20%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-15 mix-blend-screen"
                style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.8) 0%, rgba(20,184,166,0) 70%)' }} />

            <motion.div animate={controls3} className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[50vw] rounded-full blur-[140px] opacity-15 mix-blend-screen"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0) 70%)' }} />
            
             {/* Noise Texture to prevent banding */}
             <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
        </div>
    );
};

export default AuroraBackground;
