import { useState, useEffect } from "react";
import patientService from "../services/patient.service";
import {
    Users,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Activity,
    ShieldCheck,
    FlaskConical,
    ChevronRight,
    ChevronLeft,
    ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Patients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                setPatients(data);
            } catch (error) {
                console.error("Registry retrieval error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id?.toString().includes(searchTerm)
    );

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);

    const visiblePatients = filteredPatients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-accent-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-accent-400 rounded-full shadow-glow-accent animate-pulse"></div>
                    </div>
                </div>
                <p className="font-black text-accent-400 uppercase tracking-[0.2em] text-[10px] animate-pulse">Accessing Registry Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 relative z-10">
            {/* Header section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest shadow-sm">Global Registry</span>
                        <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-400 rounded-full animate-ping absolute"></span>
                            <span className="w-2 h-2 bg-brand-400 rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            Verified Dataset
                        </span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-brand-200 to-brand-400 text-gradient-animate drop-shadow-md">Clinical Ledger</h2>
                    <p className="text-slate-400 font-bold flex items-center gap-2 text-xs">
                        <Users size={14} className="text-accent-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                        Indexing <span className="text-accent-400 border-b border-accent-500/30 pb-0.5">{patients.length}</span> active neural protocols
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter Identity or Hash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:bg-slate-800 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all shadow-inner text-sm font-bold text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/50 text-slate-300 font-bold rounded-2xl border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all text-sm backdrop-blur-md">
                            <Filter size={18} />
                            Parameters
                        </button>
                        <Link to="/add-patient" className="flex-1 sm:flex-none btn-primary !h-auto !py-4 !px-8 text-sm group">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            Inject Record
                        </Link>
                    </div>
                </div>
            </div>

            {/* Registry Table */}
            <div className="glass-panel !p-0 overflow-hidden rounded-3xl border border-slate-700/50 shadow-premium">
                <div className="overflow-x-auto border-transparent">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-800">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Global Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Diagnostic Score</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Conclusion</th>
                                <th className="px-8 py-6 text-right pr-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-800/20">
                            {visiblePatients.map((patient, index) => (
                                <motion.tr
                                    key={patient.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-slate-800/60 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                >
                                    <td className="px-8 py-6 relative overflow-hidden text-white">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-glow-brand"></div>
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-brand-400 flex items-center justify-center font-black text-lg group-hover:scale-110 group-hover:bg-brand-500/20 group-hover:border-brand-500/50 group-hover:text-brand-300 transition-all shadow-inner">
                                                {patient.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-300 transition-all">{patient.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">HASH: <span className="text-slate-400">{patient.id?.toString().slice(-8)}</span></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-white">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity size={12} className="text-brand-400 group-hover:animate-pulse shadow-glow-brand" />
                                                <span className="text-xs font-black text-white drop-shadow-md group-hover:glow-text transition-all">{patient.prediction?.certainty || "94.2"}%</span>
                                            </div>
                                            <div className="w-28 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 shadow-inner inline-block relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${patient.prediction?.certainty || "94.2"}%` }}
                                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] absolute top-0 left-0"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 group-hover:text-brand-400 group-hover:border-brand-500/30 transition-colors">
                                                <FlaskConical size={14} />
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 tracking-wider">Feb 22, 2026</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {patient.prediction?.result?.toLowerCase().includes("positive") ? (
                                            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                                                <Activity size={14} className="animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Anomalous</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                                <ShieldCheck size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Stable</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right pr-10">
                                        <div className="flex items-center justify-end gap-2 text-white">
                                            <button className="p-3 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-all border border-transparent hover:border-brand-500/30">
                                                <ArrowUpRight size={18} />
                                            </button>
                                            <button className="p-3 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all border border-transparent hover:border-slate-600">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Status */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                    Displaying {filteredPatients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)} of {filteredPatients.length} Registered Nodes
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${currentPage === page ? 'bg-brand-600 border-brand-500 text-white shadow-glow-brand' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Patients;
