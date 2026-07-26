import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, UserPlus, BriefcaseMedical } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ROLE_DOCTOR");
    const [loading, setLoading] = useState(false);
    const { register: registerAuth, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerAuth(username, email, password, role);
            // Auto login after successful registration
            await login(email, password);
            toast.success("Protocol Initialized and Authenticated Successfully", { theme: "dark" });
            navigate("/");
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                "Registration Failure. Try again.";
            toast.error(resMessage, { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1c] relative overflow-hidden font-sans">
            {/* Dynamic Mesh Background Overlay */}
            <div className="absolute inset-0 bg-mesh opacity-40 mix-blend-screen pointer-events-none z-0"></div>

            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-emerald-600/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/4 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBWMGgtMXYzOThIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] z-0 opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl w-full relative z-10 py-10"
            >
                <div className="text-center mb-10 mt-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex p-5 bg-slate-900/80 rounded-3xl shadow-glow-brand border border-slate-700/50 text-brand-400 mb-6 relative group"
                    >
                        <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-3xl group-hover:bg-brand-500/30 transition-colors"></div>
                        <UserPlus size={40} className="relative z-10" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
                        Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Sign Up</span>
                    </h1>
                    <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-brand-500/50"></span>
                        Onboarding Node v4.2
                        <span className="w-8 h-px bg-brand-500/50"></span>
                    </p>
                </div>

                <div className="glass-panel p-10 lg:p-12 rounded-[3rem] shadow-premium relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <div className="w-40 h-40 bg-accent-500 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                    </div>

                    <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 focus:bg-slate-800 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all shadow-inner text-sm font-bold text-white placeholder:text-slate-600"
                                        placeholder="Dr. John Doe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Specialization</label>
                                <div className="relative group">
                                    <BriefcaseMedical className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                                    <select
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 focus:bg-slate-800 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all shadow-inner text-sm font-bold text-white appearance-none cursor-pointer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="ROLE_DOCTOR" className="bg-slate-900 text-white">Medical Practitioner</option>
                                        <option value="ROLE_ADMIN" className="bg-slate-900 text-white">System Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 focus:bg-slate-800 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all shadow-inner text-sm font-bold text-white placeholder:text-slate-600"
                                    placeholder="specialist@thyrolab.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Access Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 focus:bg-slate-800 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all shadow-inner text-sm font-bold text-white placeholder:text-slate-600"
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
                            className="w-full btn-primary h-16 text-sm !rounded-2xl mt-4 group overflow-hidden relative"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin relative z-10" size={24} />
                            ) : (
                                <span className="flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] relative z-10">
                                    Initialize Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-700/50 pt-8 relative z-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Already registered?{" "}
                            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-black border-b border-brand-500/30 hover:border-brand-400 pb-0.5 ml-1 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
