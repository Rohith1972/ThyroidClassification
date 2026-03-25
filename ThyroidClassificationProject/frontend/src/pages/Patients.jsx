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
    Trash2
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

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to permanently delete this patient record?")) return;
        try {
            await patientService.deletePatient(id);
            setPatients(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting patient:", err);
            alert("Failed to delete patient record.");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

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

    const isPatientError = (patient) => {
        const result = String(patient.prediction?.result || "Unknown").toLowerCase();
        return result.includes("error") || result === "unknown";
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id?.toString().includes(searchTerm);
            
        let matchesFilter = true;
        
        if (filterStatus === "POSITIVE") {
            matchesFilter = isPatientPositive(patient) === true;
        } else if (filterStatus === "NEGATIVE") {
            matchesFilter = isPatientPositive(patient) === false && !isPatientError(patient);
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
                <div className="w-12 h-12 border-4 border-slate-100 dark:border-violet-900 border-t-brand-500 dark:border-t-violet-400 rounded-full animate-spin"></div>
                <p className="font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest text-[10px]">Accessing Registry Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        Patient Registry
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                        View and manage diagnosed cases
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-premium pl-9 py-2 max-w-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="btn-secondary py-2 px-4 shadow-sm"
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
                                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl z-20 py-2"
                                >
                                    <button 
                                        onClick={() => { setFilterStatus("ALL"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-dark-border transition-colors ${filterStatus === 'ALL' ? 'text-brand-600 dark:text-violet-400' : 'text-slate-600 dark:text-dark-text'}`}
                                    >
                                        All Records
                                    </button>
                                    <button 
                                        onClick={() => { setFilterStatus("POSITIVE"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors ${filterStatus === 'POSITIVE' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-dark-text'}`}
                                    >
                                        Findings Detected
                                    </button>
                                    <button 
                                        onClick={() => { setFilterStatus("NEGATIVE"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors ${filterStatus === 'NEGATIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-dark-text'}`}
                                    >
                                        Normal Result
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link to="/app/add-patient" className="btn-primary flex items-center gap-2 text-sm px-4">
                            <Plus size={16} />
                            Add Patient
                        </Link>
                    </div>
                </div>
            </div>

            {/* Registry Table */}
            <div className="card-premium !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-dark-card/50 border-b border-slate-100 dark:border-dark-border">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 hidden xl:table-cell">Gender / Age</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 hidden md:table-cell">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-right pr-6 text-xs font-semibold text-slate-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                            {paginatedPatients.map((patient, index) => (
                                <motion.tr
                                    key={patient.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group hover:bg-slate-50/50 dark:hover:bg-dark-card/30 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/app/patients/${patient.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{patient.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden xl:table-cell">
                                        <p className="text-sm text-slate-700 dark:text-gray-300">{patient.gender}</p>
                                        <p className="text-xs text-slate-500 dark:text-gray-400">{patient.age} years</p>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-sm text-slate-700 dark:text-gray-300">
                                            {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const rawResult = patient.prediction?.result || "Unknown";
                                            const safeResult = String(rawResult).toLowerCase();
                                            const serviceUsed = String(patient.prediction?.serviceName || patient.prediction?.service || "1").toLowerCase();
                                            let isPos = false;
                                            let isErr = false;
                                            let badgeText = rawResult;
                                            
                                            if (safeResult.includes("error") || safeResult === "unknown" || rawResult === "Prediction failed") {
                                                isErr = true;
                                                badgeText = "Inference Error";
                                            } else if (serviceUsed.includes("1")) {
                                                isPos = safeResult.includes("positive");
                                                badgeText = isPos ? "Positive" : "Negative";
                                            } else if (serviceUsed.includes("2")) {
                                                isPos = rawResult !== "-" && !safeResult.includes("negative") && !safeResult.includes("normal");
                                                badgeText = isPos ? `Positive - ${rawResult}` : "Negative";
                                            } else if (serviceUsed.includes("3")) {
                                                isPos = !safeResult.includes("normal") && !safeResult.includes("negative") && !safeResult.includes("benign");
                                                badgeText = isPos ? rawResult : rawResult; 
                                            }
                                            
                                            if (isErr) {
                                                return (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400 uppercase tracking-widest text-center shadow-sm">
                                                        {badgeText}
                                                    </span>
                                                );
                                            }
                                            
                                            return isPos ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 border border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 uppercase tracking-widest text-center shadow-sm">
                                                    {badgeText}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 uppercase tracking-widest text-center shadow-sm">
                                                    {badgeText}
                                                </span>
                                            );
                                        })()}
                                        <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                            {Math.round((patient.prediction?.certainty ?? patient.prediction?.confidence ?? 0) * (patient.prediction?.confidence <= 1 ? 100 : 1))}% conf.
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link to={`/app/patients/${patient.id}`} className="text-brand-600 dark:text-violet-400 hover:text-brand-900 dark:hover:text-violet-300 text-sm font-medium">
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={(e) => handleDelete(patient.id, e)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                                                title="Delete Patient"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-card flex items-center justify-center text-slate-300 dark:text-dark-text-muted">
                                                <Users size={24} />
                                            </div>
                                            <p className="font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest text-[10px]">
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
                <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest">
                    Displaying {filteredPatients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} Registered Nodes
                </p>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${i === currentPage ? 'bg-brand-500 dark:bg-violet-600 text-white shadow-lg shadow-brand-500/20 dark:shadow-violet-900/20' : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-500 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-dark-border'}`}
                        >
                            {i}
                        </button>
                    ))}
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-500 dark:text-dark-text flex items-center justify-center transition-all ml-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-dark-border cursor-pointer'}`}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Patients;
