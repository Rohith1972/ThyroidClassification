import { Link } from "react-router-dom";
import { Stethoscope, Activity, ShieldCheck, ArrowRight, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const Welcome = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden relative selection:bg-brand-100 selection:text-brand-900">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-500/15 rounded-full blur-[120px] z-0 animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px] z-0 animate-[pulse_8s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 z-0"></div>

            {/* Navigation Bar */}
            <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <Stethoscope size={20} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900">
                        Thyro<span className="text-brand-500">Lab</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors">
                        Signin
                    </Link>
                    <Link to="/register" className="btn-primary !px-6 !py-2.5 text-sm rounded-xl">
                        Signup
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 -mt-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl w-full text-center space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">System Online • v4.2 Active</span>
                    </div>
                    
                    <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight">
                        Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600 relative inline-block">
                            Thyroid
                            <div className="absolute -bottom-2 left-0 w-full h-3 bg-brand-500/20 rounded-full blur-md"></div>
                        </span> Diagnostics
                    </h1>
                    
                    <p className="text-lg md:text-xl font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Empowering clinicians with highly accurate, unified neural networks for immediate automated diagnostic screening and tracking.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10">
                        <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-transform transform hover:scale-105 shadow-2xl shadow-slate-900/30 border border-slate-700">
                            Signin <ArrowRight size={18} />
                        </Link>
                        <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200/20">
                            Signup
                        </Link>
                    </div>
                </motion.div>

                {/* Features Row */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24 px-4"
                >
                    <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-brand-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 border border-brand-100 relative z-10 shadow-inner">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">AI Analysis</h3>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed">Advanced neural prediction models operating instantly to find anomalies.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-2xl shadow-emerald-200/20 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 relative z-10 shadow-inner">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Secure Registry</h3>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed">E2E encrypted records platform connecting full history seamlessly.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-2xl shadow-rose-200/20 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-rose-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-100 relative z-10 shadow-inner">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Rapid Response</h3>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed">Direct clinician alerts with confidence indicators to prioritize action.</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Welcome;
