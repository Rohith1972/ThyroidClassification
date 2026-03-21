import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Stethoscope, Mail, Loader2, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            // Mock API Call - Replace with actual password reset endpoint later
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Identity Verified. Reset instructions sent to your email.");
            navigate("/login");
        } catch (error) {
            toast.error("System Failure. Could not process request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black relative overflow-hidden font-sans">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full relative z-10 flex flex-col gap-8"
            >
                <div className="text-center relative">
                    <Link to="/login" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 dark:text-gray-400 hover:text-brand-500 dark:hover:text-violet-500 hover:bg-white dark:hover:bg-black rounded-xl transition-all">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="inline-flex p-4 bg-white dark:bg-black rounded-2xl shadow-premium border border-slate-100 dark:border-gray-800 text-amber-500 dark:text-violet-500 mb-6 mx-auto">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl font-black dark:text-white text-slate-900 dark:text-white tracking-tighter mb-2">
                        Recover <span className="text-amber-500 dark:text-violet-500">Access</span>
                    </h1>
                    <p className="text-[10px] font-black dark:text-gray-400 text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em] px-8">
                        Enter your registered email to receive a secure recovery sequence.
                    </p>
                </div>

                <div className="bg-white dark:bg-black p-10 rounded-[2.5rem] shadow-premium border border-slate-100 dark:border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black dark:text-gray-400 text-slate-400 dark:text-gray-400 uppercase tracking-widest ml-1">Specialist Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
                                <input
                                    type="email"
                                    className="input-premium pl-14 h-16 text-sm bg-white dark:bg-black border-slate-200 dark:border-gray-800 focus:border-brand-500 dark:focus:border-violet-500 focus:outline-none transition-all"
                                    placeholder="specialist@thyrolab.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 text-base !rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <span className="flex items-center gap-3 font-bold uppercase tracking-widest">
                                    Send Override Sequence <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-slate-50">
                        <p className="text-sm font-bold text-slate-500">
                            Remembered your pin?{" "}
                            <Link to="/login" className="text-brand-500 hover:underline font-black ml-1 text-base">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-60">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-amber-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Auth</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ThyroLab Core v4.2</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
