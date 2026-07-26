import { useState, useEffect, useRef } from "react";
import { Search, Activity, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import patientService from "../services/patient.service";

const GlobalSearch = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Fetch all patients once for client-side filtering
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                setPatients(data);
            } catch (error) {
                console.error("Global search data sync failed:", error);
            }
        };
        fetchPatients();
    }, []);

    // Handle outside clicks to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredResults = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id?.toString().includes(searchTerm)
    ).slice(0, 5); // Limit to top 5 results

    const handleSelect = (id) => {
        setSearchTerm("");
        setIsFocused(false);
        navigate(`/patients/${id}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors z-10" size={18} />
            <input
                type="text"
                placeholder="Search neural parameters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-12 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:bg-slate-800 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-semibold text-white placeholder:text-slate-500 text-sm shadow-inner relative z-10"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X size={14} />
                </button>
            )}

            <AnimatePresence>
                {isFocused && searchTerm.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-[120%] mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-premium overflow-hidden z-[100]"
                    >
                        {filteredResults.length > 0 ? (
                            <div className="p-2">
                                <div className="px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Activity size={10} className="text-brand-400" />
                                    <span>Matching Registry Nodes</span>
                                </div>
                                <div className="space-y-1">
                                    {filteredResults.map((patient, idx) => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handleSelect(patient.id)}
                                            className="p-3 bg-white/0 hover:bg-slate-700/50 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-brand-400 flex items-center justify-center font-black text-xs group-hover:bg-brand-500/20 group-hover:border-brand-500/50 group-hover:text-brand-300 transition-all shadow-inner">
                                                    {patient.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">{patient.name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Hash: {patient.id?.toString().slice(-6)}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <Search size={24} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No nodes match</p>
                                <p className="text-[10px] text-slate-500 mt-1">Adjust search parameters</p>
                            </div>
                        )}
                        <div className="bg-slate-900/80 p-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Deep Neural Query</span>
                            <span className="text-[9px] font-bold text-brand-500 uppercase flex items-center gap-1"><span className="w-1 h-1 bg-brand-500 rounded-full animate-pulse"></span> Active</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlobalSearch;
