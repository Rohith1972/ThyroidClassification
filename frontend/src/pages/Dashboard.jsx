import { useState, useEffect, useRef } from "react";
import patientService from "../services/patient.service";
import LiveFeed from "../components/LiveFeed";
import DeepView from "../components/DeepView";
import {
    Users,
    Activity,
    ShieldCheck,
    Zap,
    TrendingUp,
    Microscope,
    Clock,
    ServerCrash
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
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const AnimatedCounter = ({ value, delay = 0 }) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const isPercent = typeof value === 'string' && value.endsWith('%');
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            node.textContent = value;
            return;
        }

        // Wait for the entrance delay before counting
        const timeout = setTimeout(() => {
            const controls = animate(0, numValue, {
                duration: 2,
                ease: "easeOut",
                onUpdate(currentValue) {
                    node.textContent = isPercent
                        ? currentValue.toFixed(1) + '%'
                        : Math.floor(currentValue).toString();
                }
            });
            return () => controls.stop();
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return <span ref={nodeRef}>{value}</span>;
};

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            style={{ x: 0, y: 0, rotateX, rotateY, z: 100 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="card-premium group relative overflow-hidden preserve-3d cursor-pointer"
        >
            {/* Hover Flare */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                <div className={`w-32 h-32 ${color.replace('text-', 'bg-')}/10 blur-3xl rounded-full translate-x-10 -translate-y-10`}></div>
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10" style={{ transform: "translateZ(40px)" }}>
                <div className={`w-12 h-12 rounded-2xl ${color.replace('text-', 'bg-')}/10 border border-white/[0.05] flex items-center justify-center ${color} shadow-sm transition-transform duration-300 group-hover:shadow-md`}>
                    <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]'} rounded-full border text-[10px] font-bold`}>
                        <TrendingUp size={12} className={trend.startsWith('-') ? 'rotate-180' : ''} />
                        {trend}
                    </div>
                )}
            </div>
            <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-300 transition-colors">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                        <AnimatedCounter value={value} delay={delay} />
                    </h3>
                    <div className="px-2 py-0.5 rounded border border-white/[0.05] bg-white/[0.02] text-brand-400 text-[9px] font-bold tracking-widest uppercase shadow-inner group-hover:border-white/[0.1] transition-colors">Analyzed</div>
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, accuracy: "98.4%" });
    const [loading, setLoading] = useState(true);
    const [isFeedOpen, setIsFeedOpen] = useState(false);
    const [isDeepViewOpen, setIsDeepViewOpen] = useState(false);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                setPatients(data);
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
        { name: 'Stable', value: stats.negative, color: '#2dd4bf', secondary: '#0f766e', icon: ShieldCheck },
        { name: 'Anomalous', value: stats.positive, color: '#f43f5e', secondary: '#be123c', icon: Activity },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin border-r-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-50 animate-pulse"></div>
                    </div>
                </div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs animate-pulse">Loading Application Core...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.05]">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Primary Node</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full opacity-80"></span>
                            Live Analytics
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Overview</h1>
                    <p className="text-slate-400 font-bold flex items-center gap-2 text-xs">
                        <Clock size={14} className="text-brand-400" />
                        Last sync interval: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsDeepViewOpen(true)}
                        className="flex items-center gap-2.5 px-6 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl font-bold text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all text-sm group shadow-sm backdrop-blur-xl"
                    >
                        <Microscope size={18} className="text-brand-400 group-hover:scale-110 transition-transform" />
                        Deep View
                    </button>
                    <button
                        onClick={() => setIsFeedOpen(true)}
                        className="btn-primary !h-auto !py-4 !px-8 text-sm"
                    >
                        <Activity size={18} className="animate-pulse" />
                        Live Feed
                    </button>
                </div>
            </div>

            <LiveFeed isOpen={isFeedOpen} onClose={() => setIsFeedOpen(false)} />
            <DeepView isOpen={isDeepViewOpen} onClose={() => setIsDeepViewOpen(false)} data={patients} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
                <StatCard title="Total Lab Registry" value={stats.total} icon={Users} color="text-brand-400" trend="+12%" delay={0.1} />
                <StatCard title="Anomalous Findings" value={stats.positive} icon={Activity} color="text-rose-400" trend="+3%" delay={0.2} />
                <StatCard title="Stable Findings" value={stats.negative} icon={ShieldCheck} color="text-accent-400" trend="+8%" delay={0.3} />
                <StatCard title="Model Confidence" value={stats.accuracy} icon={Zap} color="text-amber-400" trend="+0.2%" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 preserve-3d">
                {/* Main Trend Analysis */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 card-premium !p-8 relative overflow-hidden group/chart preserve-3d"
                >
                    {/* Subtle chart background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover/chart:opacity-100 opacity-20"></div>

                    <div className="flex justify-between items-start mb-8 relative z-10" style={{ transform: "translateZ(30px)" }}>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Throughput Topology</h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Registry Throughput (6M History)</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 opacity-80"></span>
                            <span className="w-2 h-2 rounded-full bg-white/[0.1]"></span>
                            <span className="w-2 h-2 rounded-full bg-white/[0.1]"></span>
                        </div>
                    </div>
                    <div className="h-[320px] w-full relative z-10" style={{ transform: "translateZ(20px)" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                        padding: '12px 16px'
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    itemStyle={{ fontWeight: '900', fontSize: '16px', color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#818cf8"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.4))" }}
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
                    className="card-premium flex flex-col !p-8 relative overflow-hidden group/mix preserve-3d"
                >
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover/mix:opacity-100 opacity-20"></div>

                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm z-10" style={{ transform: "translateZ(30px)" }}>Findings Mix</h3>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-8 transition-colors relative z-10" style={{ transform: "translateZ(30px)" }}>Relative Frequency</p>

                    <div className="flex-1 space-y-6 relative z-10" style={{ transform: "translateZ(40px)" }}>
                        {distributionData.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="relative group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/[0.05]" style={{ backgroundColor: item.secondary }}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-white block tracking-wide group-hover:text-slate-200 transition-all">{item.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.value} Scans</span>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-black text-white drop-shadow-md group-hover:scale-110 transition-transform origin-right">
                                            {Math.round((item.value / (stats.total || 1)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.05] relative shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.value / (stats.total || 1)) * 100}%` }}
                                            transition={{ duration: 1.5, delay: 0.8 + idx * 0.2, ease: "easeOut" }}
                                            className="h-full rounded-full absolute top-0 left-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl group relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <div className="w-24 h-24 bg-teal-500/20 blur-3xl rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">System Load</h4>
                            <div className="flex items-center gap-1.5 font-bold text-teal-400 text-[10px] uppercase tracking-widest px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full opacity-80"></span>
                                Optimal
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="flex-1 h-10 bg-white/[0.02] rounded-full relative overflow-hidden border border-white/[0.05]">
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full opacity-70" style={{ height: `${20 + i * 10}%`, transition: 'all 1s ease' }}></div>
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
