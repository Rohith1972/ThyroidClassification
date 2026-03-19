import { useState, useEffect } from "react";
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
                <div className={`flex items-center gap-1 px-2.5 py-1 ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} rounded-full border text-[10px] font-bold`}>
                    <TrendingUp size={12} className={trend.startsWith('-') ? 'rotate-180' : ''} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                <div className="badge-premium !py-0 !px-2 !text-[8px]">Analyzed</div>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, accuracy: "98.4%" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                const pos = data.filter(p => p.prediction?.result?.toLowerCase().includes("positive")).length;
                setStats(prev => ({
                    ...prev,
                    total: data.length,
                    positive: pos,
                    negative: data.length - pos
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
                <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Loading Intelligence Node...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="badge-premium text-brand-600 border-brand-100 bg-brand-50">Local Deployment</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-2">
                            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
                            Live Analytics
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Diagnostic <span className="text-brand-500">Board</span></h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2 text-xs">
                        <Clock size={14} className="text-brand-500" />
                        Last synchronization: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm group shadow-sm">
                        <Microscope size={18} className="text-brand-500" />
                        Diagnostic View
                    </button>
                    <button className="btn-primary !h-auto !py-3.5 !px-8">
                        <Activity size={18} />
                        Live Feed
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Lab Registry" value={stats.total} icon={Users} color="bg-blue-500" trend="+12%" delay={0.1} />
                <StatCard title="Positive Findings" value={stats.positive} icon={Activity} color="bg-rose-500" trend="+3%" delay={0.2} />
                <StatCard title="Stable Findings" value={stats.negative} icon={ShieldCheck} color="bg-emerald-500" trend="+8%" delay={0.3} />
                <StatCard title="Model Accuracy" value={stats.accuracy} icon={Zap} color="bg-amber-500" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Analysis */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 card-premium"
                >
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Outcome Timeline</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Throughput (6M History)</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #f1f5f9',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Outcome Mix */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card-premium flex flex-col"
                >
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-2">Findings Mix</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Relative Frequency</p>

                    <div className="flex-1 space-y-6">
                        {distributionData.map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                            {item.name === 'Positive' ? <Activity size={18} /> : <ShieldCheck size={18} />}
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-black text-slate-900 uppercase block">{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.value} Records</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-slate-900">
                                        {Math.round((item.value / stats.total) * 100) || 0}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.value / stats.total) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl group">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-black text-slate-900 uppercase">System Status</h4>
                            <div className="flex items-center gap-1.5 font-bold text-emerald-500 text-[10px]">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Optimal
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="flex-1 h-8 bg-slate-200 rounded-full relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-full bg-brand-500 rounded-full animate-grow" style={{ height: `${20 + i * 10}%`, animationDelay: `${i * 0.1}s` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
