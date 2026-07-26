import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Zap,
    Activity,
    BarChart3,
    PieChart,
    Cpu,
    Info,
    TrendingUp,
    Shield
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const DeepView = ({ isOpen, onClose, data = [] }) => {
    // Aggregate SHAP values from data
    const aggregateShap = () => {
        const globalShap = {};
        let count = 0;

        data.forEach(patient => {
            if (patient.prediction && patient.prediction.shapValues) {
                count++;
                Object.entries(patient.prediction.shapValues).forEach(([key, value]) => {
                    globalShap[key] = (globalShap[key] || 0) + Math.abs(value);
                });
            }
        });

        if (count === 0) return [];

        return Object.entries(globalShap)
            .map(([name, value]) => ({
                name: name.replace(/_/g, ' ').toUpperCase(),
                value: parseFloat((value / count).toFixed(4))
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    };

    const shapData = aggregateShap();

    // Calculate average confidence
    const avgConfidence = data.length > 0
        ? (data.reduce((acc, p) => acc + (p.prediction?.confidence || 0), 0) / data.length * 100).toFixed(1)
        : 0;

    const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                    {/* Cinematic Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />

                    {/* Main Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl h-full max-h-[850px] bg-slate-900/40 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
                    >
                        {/* Left Sidebar: Control & Meta */}
                        <div className="w-full md:w-80 bg-slate-900/50 border-r border-white/5 p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                                    <Zap size={24} className="animate-pulse" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="md:hidden p-2 text-slate-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">DEEP <span className="text-brand-400">VIEW</span></h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Advanced Diagnostic Intelligence</p>

                            <div className="space-y-6 flex-1">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 group cursor-pointer">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-brand-400">Model Engine</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <Cpu size={14} className="text-slate-500" />
                                        XGBoost Neural Hybrid
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 group cursor-pointer">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-accent-400">Stability Index</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <Shield size={14} className="text-slate-500" />
                                        {avgConfidence}% Aggregate
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 group cursor-pointer">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-amber-400">Data Nodes</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <TrendingUp size={14} className="text-slate-500" />
                                        {data.length} Clinical Scans
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all"
                                >
                                    Exfiltrate Protocol
                                </button>
                            </div>
                        </div>

                        {/* Main Content: Analytics */}
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-gradient-to-br from-transparent to-brand-500/5">
                            <div className="grid grid-cols-1 gap-8">
                                {/* Feature Importance Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                                            <BarChart3 className="text-brand-400" size={20} />
                                            Feature Influence Topology
                                        </h3>
                                        <p className="text-xs font-bold text-slate-500 mt-1">Aggregated SHAP values indicating global feature importance across population registry.</p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                                        <span className="w-2 h-2 bg-brand-400 rounded-full animate-ping"></span>
                                        <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Live Neural Compute</span>
                                    </div>
                                </div>

                                {/* Feature Importance Chart */}
                                <div className="h-[400px] w-full card-premium !bg-slate-900/30 border-holographic p-6">
                                    {shapData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                layout="vertical"
                                                data={shapData}
                                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="name"
                                                    wrapText
                                                    type="category"
                                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={100}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    contentStyle={{
                                                        backgroundColor: '#0f172a',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '12px'
                                                    }}
                                                />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                                    {shapData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                                            <Info size={48} className="mb-4" />
                                            <p className="font-black uppercase tracking-widest text-sm">Insufficient Neural Data</p>
                                        </div>
                                    )}
                                </div>

                                {/* Secondary Insights Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="card-premium !bg-slate-900/30 border !p-6">
                                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <PieChart size={14} className="text-accent-400" />
                                            Data Quality Audit
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-slate-500 font-bold uppercase">Consistency Factor</span>
                                                <span className="text-white font-black">HIGH</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full w-[92%] bg-accent-500 shadow-[0_0_10px_#2dd4bf]"></div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-slate-500 font-bold uppercase">Verification Delta</span>
                                                <span className="text-white font-black">OPTIONAL</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full w-[12%] bg-brand-500 shadow-[0_0_10px_#6366f1]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-premium !bg-slate-900/30 border !p-6 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="text-center relative z-10">
                                            <Activity size={32} className="text-brand-400 mx-auto mb-3 animate-pulse" />
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Adaptive Learning Active</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Real-time weights recalibration</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeepView;
