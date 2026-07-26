import { motion } from "framer-motion";

const AuroraBackground = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#020617]">
            {/* Deep Indigo Glow */}
            <motion.div
                animate={{
                    x: ["-5%", "5%", "-5%"],
                    y: ["-5%", "5%", "-5%"],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px] opacity-60"
            />

            {/* Soft Teal sweep */}
            <motion.div
                animate={{
                    x: ["5%", "-5%", "5%"],
                    y: ["5%", "-5%", "5%"],
                    scale: [1.1, 1, 1.1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-teal-500/20 mix-blend-screen blur-[120px] opacity-60"
            />

            {/* Violet Core Pulse */}
            <motion.div
                animate={{
                    x: ["-2%", "2%", "-2%"],
                    y: ["-2%", "2%", "-2%"],
                    scale: [0.9, 1.05, 0.9],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-violet-600/15 mix-blend-screen blur-[100px] opacity-50"
            />

            {/* Gentle Rose Accent */}
            <motion.div
                animate={{
                    x: ["2%", "-2%", "2%"],
                    y: ["-3%", "3%", "-3%"],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 7,
                }}
                className="absolute top-[40%] right-[30%] w-[40vw] h-[40vw] rounded-full bg-rose-500/10 mix-blend-screen blur-[100px] opacity-40"
            />
        </div>
    );
};

export default AuroraBackground;
