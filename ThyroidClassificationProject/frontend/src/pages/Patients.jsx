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
    ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Patients = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const queryTerm = searchParams.get("search");
        if (queryTerm !== null) {
            setSearchTerm(queryTerm);
        }
    }, [searchParams]);

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

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id?.toString().includes(searchTerm);
            
        let matchesFilter = true;
        if (filterStatus === "POSITIVE") {
            matchesFilter = patient.prediction?.result?.toLowerCase().includes("positive");
        } else if (filterStatus === "NEGATIVE") {
            matchesFilter = patient.prediction?.result && !patient.prediction?.result?.toLowerCase().includes("positive");
        }
        
        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
    const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Accessing Registry Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="badge-premium border-slate-200 text-slate-500 bg-white shadow-sm">Registry Core</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Verified Dataset
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Clinical <span className="text-brand-500">Registry</span></h2>
                    <p className="text-slate-500 font-bold flex items-center gap-2 text-xs">
                        <Users size={14} className="text-brand-500" />
                        Managing <span className="text-brand-600 underline underline-offset-4 decoration-brand-200">{patients.length}</span> active patient protocol records
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none transition-all shadow-sm text-sm font-bold placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 font-bold rounded-xl border transition-all text-sm ${isFilterOpen || filterStatus !== 'ALL' ? 'bg-brand-50 text-brand-600 border-brand-200' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                        >
                            <Filter size={16} />
                            {filterStatus === 'ALL' ? 'Filter' : filterStatus === 'POSITIVE' ? 'Findings' : 'Normal'}
                        </button>
                        
                        {/* Filter Dropdown */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-2"
                                >
                                    <button 
                                        onClick={() => { setFilterStatus("ALL"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${filterStatus === 'ALL' ? 'text-brand-600' : 'text-slate-600'}`}
                                    >
                                        All Records
                                    </button>
                                    <button 
                                        onClick={() => { setFilterStatus("POSITIVE"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 transition-colors ${filterStatus === 'POSITIVE' ? 'text-rose-600' : 'text-slate-600'}`}
                                    >
                                        Findings Detected
                                    </button>
                                    <button 
                                        onClick={() => { setFilterStatus("NEGATIVE"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-emerald-50 transition-colors ${filterStatus === 'NEGATIVE' ? 'text-emerald-600' : 'text-slate-600'}`}
                                    >
                                        Normal Result
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link to="/add-patient" className="flex-1 sm:flex-none btn-primary h-auto !py-2 !px-5 text-sm rounded-xl">
                            <Plus size={16} />
                            New Record
                        </Link>
                    </div>
                </div>
            </div>

            {/* Registry Table */}
            <div className="card-premium !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Identity</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Diagnostic Score</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Date</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Conclusion</th>
                                <th className="px-6 py-3 text-right pr-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedPatients.map((patient, index) => (
                                <motion.tr
                                    key={patient.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                >
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-600 flex items-center justify-center font-black text-base border border-slate-200 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all">
                                                {patient.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{patient.name}</p>
                                                <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">ID: {patient.id?.toString().slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <Activity size={12} className="text-brand-500" />
                                                <span className="text-xs font-black text-slate-900">{(patient.prediction?.certainty ?? (patient.prediction?.confidence != null ? (patient.prediction.confidence > 1 ? patient.prediction.confidence : (patient.prediction.confidence * 100).toFixed(1)) : "N/A"))}%</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className="h-full bg-brand-500 rounded-full"
                                                    style={{ width: `${patient.prediction?.certainty ?? (patient.prediction?.confidence != null ? (patient.prediction.confidence > 1 ? patient.prediction.confidence : patient.prediction.confidence * 100) : 0)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                                                <FlaskConical size={12} />
                                            </span>
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-tight">
                                                {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        {patient.prediction?.result?.toLowerCase().includes("positive") ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full">
                                                <Activity size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Findings Detected</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
                                                <ShieldCheck size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Normal Result</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                                                <ArrowUpRight size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                                                <Users size={24} />
                                            </div>
                                            <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
                                                {patients.length === 0 ? 'No patient records found. Add a new patient to get started.' : 'No patients match your search.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Status */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Displaying {filteredPatients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} Registered Nodes
                </p>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${i === currentPage ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {i}
                        </button>
                    ))}
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center transition-all ml-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Patients;
