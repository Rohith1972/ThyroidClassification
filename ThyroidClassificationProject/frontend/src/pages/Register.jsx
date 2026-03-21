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
    const { register: registerAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerAuth(username, email, password, role);
            toast.success("Protocol Initialized Successfully");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Registration Failure. Try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px] -ml-48 -mt-48"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mb-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full relative z-10 py-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-white rounded-2xl shadow-premium border border-slate-100 text-brand-500 mb-6 font-bold">
                        <UserPlus size={40} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                        Specialist <span className="text-brand-500">Sign Up</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Onboarding Node v4.2</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="input-premium pl-14 h-16 text-sm"
                                        placeholder="Dr. John Doe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                                <div className="relative">
                                    <BriefcaseMedical className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        className="input-premium pl-14 h-16 text-sm appearance-none cursor-pointer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="ROLE_DOCTOR">Medical Practitioner</option>
                                        <option value="ROLE_ADMIN">System Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    className="input-premium pl-14 h-16 text-sm"
                                    placeholder="specialist@thyrolab.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    className="input-premium pl-14 h-16 text-sm"
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
                            className="w-full btn-primary h-18 text-base !rounded-2xl"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <span className="flex items-center gap-4 font-bold uppercase tracking-widest text-base relative">
                                    Create Account <ArrowRight size={24} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-50 pt-8">
                        <p className="text-xs font-bold text-slate-500">
                            Already registered?{" "}
                            <Link to="/login" className="text-brand-500 hover:underline font-black">
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
