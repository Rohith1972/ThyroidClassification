import { Link } from "react-router-dom";
import { useState } from "react";
import { Stethoscope, Activity, ShieldCheck, ArrowRight, BrainCircuit, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

const Welcome = () => {
    const [showFeatures, setShowFeatures] = useState(false);
    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col font-sans overflow-hidden relative selection:bg-brand-100 selection:text-brand-900">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>
            <div className="absolute top-[-30%] right-[-10%] pointer-events-none w-[1000px] h-[1000px] bg-gradient-to-r from-brand-400/20 to-emerald-400/20 dark:from-violet-600/20 dark:to-fuchsia-600/20 rounded-full blur-[120px] z-0 animate-[pulse_10s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] pointer-events-none w-[800px] h-[800px] bg-gradient-to-r from-brand-500/20 to-blue-500/20 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-full blur-[120px] z-0 animate-[pulse_8s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/50 to-white dark:via-dark-surface/30 dark:to-black z-0"></div>

            {/* Navigation Bar */}
            <nav className="relative z-50 w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500 dark:bg-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 dark:shadow-violet-500/20">
                        <Stethoscope size={20} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                        Thyro<span className="text-brand-500 dark:text-violet-500">Lab</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-dark-text-secondary hover:text-brand-600 dark:hover:text-violet-400 transition-colors">
                        Signin
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 text-sm rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-bold shadow-md shadow-brand-500/20 dark:shadow-violet-500/20 transition-all duration-300">
                        Signup
                    </Link>
                </div>
            </nav>

            {/* Hero / Features Section */}
            <main className="relative z-0 flex-1 flex flex-col items-center justify-center px-4 -mt-10">
                <AnimatePresence mode="wait">
                    {!showFeatures ? (
                        <motion.div 
                            key="hero"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl w-full text-center space-y-8"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 border border-brand-200/50 text-brand-700 shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:bg-dark-surface/50 dark:border-emerald-900/30 dark:text-emerald-400 mb-6 backdrop-blur-md hover:scale-105 transition-transform cursor-default">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Diagnostic Matrix Online</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500 dark:from-violet-400 dark:to-fuchsia-400">Thyroid</span><br/> Diagnostics
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                                Supporting clinicians with AI-assisted diagnostics, enhancing clinical decisions with pinpoint neural certainty.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center pt-10 gap-5">
                                <Link to="/login" className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 dark:from-violet-600 dark:to-fuchsia-600 dark:hover:from-violet-700 dark:hover:to-fuchsia-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 hover:-translate-y-1 shadow-[0_10px_30px_rgba(79,70,229,0.3)] dark:shadow-[0_10px_30px_rgba(139,92,246,0.3)] w-full sm:w-auto group">
                                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button 
                                    onClick={() => setShowFeatures(true)}
                                    className="px-8 py-3.5 bg-white/80 hover:bg-white dark:bg-dark-card dark:hover:bg-dark-surface text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-dark-border rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 hover:-translate-y-1 shadow-sm hover:shadow-xl w-full sm:w-auto backdrop-blur-sm group"
                                >
                                    <Info size={18} className="text-brand-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                                    How it works
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="features"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center w-full max-w-6xl"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">How ThyroLab Works</h2>
                            <p className="text-lg text-slate-500 dark:text-gray-400 mb-12 max-w-2xl text-center">Seamlessly integrating advanced AI diagnostics with a secure clinical workflow.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
                                <div className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-3xl p-10 rounded-3xl border border-white/50 dark:border-dark-border/50 shadow-2xl shadow-brand-100/50 dark:shadow-none hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-brand-500/30 group-hover:scale-150 transition-all duration-500"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-violet-900/50 dark:to-violet-800/30 text-brand-600 dark:text-violet-400 flex items-center justify-center mb-8 border border-white/50 dark:border-violet-700/50 relative z-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <BrainCircuit size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Multi-Model Inference</h3>
                                    <p className="text-base font-medium text-slate-500 dark:text-gray-400 leading-relaxed">Choose between Random Forest, HistGB, or ResNet50 vision models to classify clinical variables and ultrasound scans with exact confidence metrics.</p>
                                </div>
                                
                                <div className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-3xl p-10 rounded-3xl border border-white/50 dark:border-dark-border/50 shadow-2xl shadow-emerald-100/50 dark:shadow-none hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-emerald-500/30 group-hover:scale-150 transition-all duration-500"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 border border-white/50 dark:border-emerald-700/50 relative z-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Patient Registry</h3>
                                    <p className="text-base font-medium text-slate-500 dark:text-gray-400 leading-relaxed">Secure, encrypted dashboard that tracks past test histories. Every record dynamically adapts to display precise hyperthyroid/hypothyroid or visual anomaly insights.</p>
                                </div>
                                
                                <div className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-3xl p-10 rounded-3xl border border-white/50 dark:border-dark-border/50 shadow-2xl shadow-rose-100/50 dark:shadow-none hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-rose-500/30 group-hover:scale-150 transition-all duration-500"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/50 dark:to-rose-800/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-8 border border-white/50 dark:border-rose-700/50 relative z-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Activity size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">ThyroBot GenAI</h3>
                                    <p className="text-base font-medium text-slate-500 dark:text-gray-400 leading-relaxed">Integrated Google Gemini ChatBot widget available globally across the application to instantly answer any clinical questions a doctor might have securely.</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowFeatures(false)}
                                className="mt-12 px-8 py-3 bg-white hover:bg-slate-50 dark:bg-dark-surface dark:hover:bg-dark-border text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-dark-border rounded-lg font-medium transition-colors"
                            >
                                Back to Home
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Welcome;
