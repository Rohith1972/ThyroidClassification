const NoiseOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 h-[100vh] w-[100vw] opacity-[0.035] mix-blend-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-full w-full">
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="4"
                        stitchTiles="stitch"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
    );
};

export default NoiseOverlay;
