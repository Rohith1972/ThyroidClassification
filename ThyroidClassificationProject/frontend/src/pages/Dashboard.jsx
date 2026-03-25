import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import patientService from "../services/patient.service";
import {
    Users,
    Activity,
    ShieldCheck,
    Zap,
    TrendingUp,
    Microscope,
    Clock
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="card-premium group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-105`}>
                <Icon size={22} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2.5 py-1 ${trend.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800'} rounded-full border text-[10px] font-bold`}>
                    <TrendingUp size={12} className={trend.startsWith('-') ? 'rotate-180' : ''} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, accuracy: "98.4%" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                const isPatientPositive = (patient) => {
                    const result = String(patient.prediction?.result || "Unknown").toLowerCase();
                    const service = String(patient.prediction?.serviceName || patient.prediction?.service || "1").toLowerCase();
                    
                    if (result.includes("error") || result === "unknown") return null;

                    if (service.includes("1")) {
                        return result.includes("positive");
                    } else if (service.includes("2")) {
                        return result !== "-" && !result.includes("negative") && !result.includes("normal");
                    } else if (service.includes("3")) {
                        return !result.includes("normal") && !result.includes("negative") && !result.includes("benign");
                    }
                    return false;
                };

                const posCount = data.filter(p => isPatientPositive(p) === true).length;
                const negCount = data.filter(p => isPatientPositive(p) === false).length;
                const errCount = data.filter(p => isPatientPositive(p) === null).length;

                setStats(prev => ({
                    ...prev,
                    total: data.length,
                    positive: posCount,
                    negative: negCount,
                    errors: errCount
                }));
            } catch (error) {
                console.error("Dashboard synchronization error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = [
        { name: 'Jan', count: 420 }, { name: 'Feb', count: 530 },
        { name: 'Mar', count: 480 }, { name: 'Apr', count: 620 },
        { name: 'May', count: 590 }, { name: 'Jun', count: stats.total * 10 || 740 }
    ];

    const distributionData = [
        { name: 'Negative', value: stats.negative, color: '#3b82f6', secondary: '#60a5fa' },
        { name: 'Positive', value: stats.positive, color: '#f43f5e', secondary: '#fb7185' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="w-12 h-12 border-4 border-slate-100 dark:border-gray-800 border-t-brand-500 dark:border-t-violet-400 rounded-full animate-spin"></div>
                <p className="font-bold dark:text-gray-400 text-slate-400 uppercase tracking-widest text-[10px]">Loading Intelligence Node...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Diagnostic Dashboard</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm flex items-center gap-2">
                        Overview of clinical outcomes • Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/app/add-patient')} className="btn-secondary">
                        <Microscope size={16} />
                        Diagnostic View
                    </button>
                    <button onClick={() => navigate('/app/patients')} className="btn-primary">
                        <Activity size={16} />
                        Live Feed
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white dark:bg-dark-card border border-rose-200 dark:border-rose-900/50 rounded-3xl p-10 shadow-xl shadow-rose-100/50 dark:shadow-none relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-rose-500/20 transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Activity size={32} />
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full font-bold text-sm border border-rose-100 dark:border-rose-800">
                            High Priority
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <p className="text-xl font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Positive Cases</p>
                        <div className="flex items-baseline gap-4">
                            <h3 className="text-7xl font-black text-rose-600 dark:text-rose-500 tracking-tighter">{stats.positive}</h3>
                            <span className="text-2xl font-bold text-slate-400 dark:text-gray-600 font-mono">
                                {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 mt-6 font-medium bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                            Includes Hyperthyroid classifications from Random Forest, HistGB, and Malignant traces from Ultrasound vision scans.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white dark:bg-dark-card border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-10 shadow-xl shadow-emerald-100/50 dark:shadow-none relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full font-bold text-sm border border-emerald-100 dark:border-emerald-800">
                            Stable
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <p className="text-xl font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Negative Cases</p>
                        <div className="flex items-baseline gap-4">
                            <h3 className="text-7xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{stats.negative}</h3>
                            <span className="text-2xl font-bold text-slate-400 dark:text-gray-600 font-mono">
                                {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 mt-6 font-medium bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                            Patient records cleared by the AI consensus indicating normal biological functions and benign scans.
                        </p>
                    </div>
                </motion.div>
                
                {stats.errors > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-orange-900 dark:text-orange-400">Inference Errors Detected</h4>
                                <p className="text-orange-700 dark:text-orange-500/70 text-sm font-medium">There are {stats.errors} patient records missing successful inferences. Check Registry.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
