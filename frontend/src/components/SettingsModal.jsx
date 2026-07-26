import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Zap, Eye, Monitor, Shield, Database } from 'lucide-react';
import { useState } from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
    // Local state for interactive toggles to make it feel alive
    const [toggles, setToggles] = useState({
        holographicBorders: true,
        dataStreams: true,
        glassGlare: true,
        highContrast: false,
        telemetry: true
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 shadow-premium z-[101] overflow-hidden"
                    >
                        {/* Ambient glow inside modal */}
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                            <div className="w-64 h-64 bg-brand-500 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>
                        </div>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-brand-400 border border-slate-700 shadow-glow-brand">
                                    <Sliders size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight uppercase italic drop-shadow-md">System Preferences</h2>
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shadow-glow-brand"></span>
                                        Node Configuration Utility
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                            {/* Visual Engine Group */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Eye size={12} /> Visual Engine
                                </h3>

                                {[
                                    { id: 'holographicBorders', label: 'Holographic Meshes', icon: Zap },
                                    { id: 'dataStreams', label: 'Background Streams', icon: Database },
                                    { id: 'glassGlare', label: 'Material Glare', icon: Monitor },
                                ].map(setting => (
                                    <div key={setting.id} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/60 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <setting.icon size={16} className={`${toggles[setting.id] ? 'text-brand-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-slate-600'} transition-colors duration-300`} />
                                            <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{setting.label}</span>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(setting.id)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${toggles[setting.id] ? 'bg-brand-500 shadow-glow-brand' : 'bg-slate-700'}`}
                                        >
                                            <motion.div
                                                className="w-4 h-4 bg-white rounded-full shadow-md"
                                                animate={{ x: toggles[setting.id] ? 24 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* System Security Group */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Shield size={12} /> Core Operations
                                </h3>

                                {[
                                    { id: 'highContrast', label: 'High Contrast Mode', color: 'accent' },
                                    { id: 'telemetry', label: 'Send Diagnostic Data', color: 'amber' },
                                ].map(setting => {
                                    const isActive = toggles[setting.id];
                                    const activeBg = setting.color === 'accent' ? 'bg-accent-500 shadow-glow-accent' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]';

                                    return (
                                        <div key={setting.id} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/60 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{setting.label}</span>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{isActive ? 'Active' : 'Disabled'}</span>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(setting.id)}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${isActive ? activeBg : 'bg-slate-700'}`}
                                            >
                                                <motion.div
                                                    className="w-4 h-4 bg-white rounded-full shadow-md"
                                                    animate={{ x: isActive ? 24 : 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>
                                    )
                                })}

                                <div className="mt-6 pt-6 border-t border-slate-700/50">
                                    <button onClick={onClose} className="w-full py-4 bg-white/5 hover:bg-brand-500/20 hover:border-brand-500/50 hover:text-brand-400 border border-slate-700/50 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                                        Apply Configuration
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
