import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Stethoscope, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Identity Verified. Welcome back.");
            navigate("/app");
        } catch (error) {
            toast.error("Authentication Failure. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-dark-background relative overflow-hidden font-sans">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full relative z-10 flex flex-col gap-8"
            >
                <div className="text-center">
                    <div className="inline-flex p-4 bg-white dark:bg-dark-surface rounded-2xl shadow-premium border border-slate-100 dark:border-dark-border text-brand-500 mb-6">
                        <Stethoscope size={40} />
                    </div>
                    <h1 className="text-5xl font-black dark:text-white text-slate-900 dark:text-dark-text tracking-tighter mb-2">
                        Thyro<span className="text-brand-500">Lab</span>
                    </h1>
                    <p className="text-[10px] font-black dark:text-dark-text-secondary text-slate-400 dark:text-dark-text-muted uppercase tracking-[0.4em]">Secure Specialist Portal</p>
                </div>

                <div className="bg-white dark:bg-dark-surface p-10 rounded-[2.5rem] shadow-premium border border-slate-100 dark:border-dark-border">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black dark:text-dark-text-secondary text-slate-400 dark:text-dark-text-muted uppercase tracking-widest ml-1">Specialist Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-text-muted" size={18} />
                                <input
                                    type="email"
                                    className="input-premium pl-14 h-16 text-sm bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 focus:outline-none transition-all"
                                    placeholder="specialist@thyrolab.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black dark:text-dark-text-secondary text-slate-400 dark:text-dark-text-muted uppercase tracking-widest">Security Pin</label>
                                <Link to="/forgot-password" className="text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    className="input-premium pl-14 h-16 text-sm bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 focus:outline-none transition-all"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 text-base !rounded-2xl px-8 py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-md shadow-brand-500/20 hover:bg-brand-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <span className="flex items-center gap-3 font-bold uppercase tracking-widest">
                                    Login <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-slate-50 dark:border-dark-border">
                        <p className="text-sm font-bold text-slate-500 dark:text-violet-500">
                            No credentials?{" "}
                            <Link to="/register" className="text-brand-500 hover:underline dark:text-violet-600 font-black ml-1 text-base">
                                Signup
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-60">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E2E Secured</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ThyroLab Core v4.2</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
