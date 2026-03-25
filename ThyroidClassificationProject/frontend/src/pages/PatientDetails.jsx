import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import patientService from "../services/patient.service";
import { 
    ChevronLeft, 
    User, 
    Activity, 
    Calendar, 
    FlaskConical, 
    AlertCircle, 
    CheckCircle,
    FileText,
    Cpu,
    Trash2
} from "lucide-react";
import { motion } from "framer-motion";

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-dark-border last:border-0">
        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
            {value !== null && value !== undefined && value !== "" ? value.toString() : "N/A"}
        </span>
    </div>
);

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await patientService.getPatient(id);
                setPatient(response.data);
            } catch (error) {
                console.error("Error fetching patient details:", error);
                // Optionally navigate back or show error state
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPatientDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this patient record?")) return;
        try {
            await patientService.deletePatient(id);
            navigate("/app/patients");
        } catch (error) {
            console.error("Error deleting patient:", error);
            alert("Failed to delete patient record.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="font-semibold text-slate-500 dark:text-gray-400">Loading Patient File...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <User size={48} className="text-slate-300 dark:text-gray-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Patient Record Not Found</h2>
                <Link to="/app/patients" className="btn-secondary mt-4">Return to Registry</Link>
            </div>
        );
    }

    const rawResult = patient.prediction?.result || "Unknown";
    const safeResult = String(rawResult).toLowerCase();
    const serviceUsed = String(patient.prediction?.serviceName || patient.prediction?.service || "1").toLowerCase();
    
    // Determine the status color based on service and result
    let isPositive = false;
    let isErr = false;
    let statusLabel = rawResult;

    if (safeResult.includes("error") || safeResult === "unknown" || rawResult === "Prediction failed") {
        isErr = true;
        statusLabel = "Inference Error";
    } else if (serviceUsed.includes("1")) {
        isPositive = safeResult.includes("positive");
        statusLabel = isPositive ? "Positive" : "Negative";
    } else if (serviceUsed.includes("2")) {
        isPositive = rawResult !== "-" && !safeResult.includes("negative") && !safeResult.includes("normal");
        statusLabel = isPositive ? `Positive - ${rawResult}` : "Negative";
    } else if (serviceUsed.includes("3")) {
        isPositive = !safeResult.includes("normal") && !safeResult.includes("negative") && !safeResult.includes("benign");
        statusLabel = isPositive ? rawResult : rawResult;
    }

    const certainty = patient.prediction?.certainty ?? patient.prediction?.confidence ?? 0;
    const confidencePct = Math.round(certainty * (certainty <= 1 ? 100 : 1));

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto pb-16 space-y-6"
        >
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="btn-secondary px-3 py-2">
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            {patient.name}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                            Registered: {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button 
                        onClick={handleDelete}
                        className="btn-secondary px-4 py-2 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                        title="Delete Patient Record"
                    >
                        <Trash2 size={16} />
                    </button>
                   {isErr ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400 rounded-lg shadow-sm">
                            <AlertCircle size={18} />
                            <span className="font-bold text-sm uppercase tracking-wide">{statusLabel}</span>
                        </div>
                    ) : isPositive ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 rounded-lg shadow-sm">
                            <AlertCircle size={18} />
                            <span className="font-bold text-sm uppercase tracking-wide">{statusLabel}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 rounded-lg shadow-sm">
                            <CheckCircle size={18} />
                            <span className="font-bold text-sm uppercase tracking-wide">{statusLabel}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Demographics & AI Analysis */}
                <div className="space-y-6">
                    {/* AI Prediction Card */}
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 bg-indigo-50 dark:bg-violet-900/30 text-indigo-600 dark:text-violet-400 rounded-lg">
                                <Cpu size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Conclusion</h3>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">Assigned Framework</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{serviceUsed}</p>
                            </div>
                            
                            <div>
                                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">Diagnostic Score</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{confidencePct}%</span>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <div className="w-full h-2 bg-slate-100 dark:bg-dark-surface rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${isErr ? 'bg-orange-500' : isPositive ? 'bg-red-600' : 'bg-emerald-500'}`}
                                        style={{ width: `${confidencePct}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Biological Data */}
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-gray-300 rounded-lg">
                                <User size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Demographics</h3>
                        </div>
                        <div className="space-y-1">
                            <DetailRow label="Patient Name" value={patient.name} />
                            <DetailRow label="Biological Age" value={`${patient.age} years`} />
                            <DetailRow label="Gender" value={patient.gender} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Labs & Medical History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lab Markers */}
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-gray-300 rounded-lg">
                                <FlaskConical size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Laboratory Findings</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <DetailRow label="TSH Level" value={patient.tsh} />
                            <DetailRow label="T3 Status" value={patient.t3Measured ? "Measured" : "Not Measured"} />
                            <DetailRow label="TT4 Value" value={patient.tt4} />
                            <DetailRow label="T4U Ratio" value={patient.t4u} />
                            <DetailRow label="FTI Score" value={patient.fti} />
                        </div>
                    </div>

                    {/* Clinical History */}
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-gray-300 rounded-lg">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clinical Context Flags</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { k: 'onThyroxine', label: 'On Thyroxine' },
                                { k: 'queryOnThyroxine', label: 'Query Thyroxine' },
                                { k: 'onAntithyroidMedication', label: 'Anti-Thyroid Meds' },
                                { k: 'sick', label: 'Clinical Illness' },
                                { k: 'pregnant', label: 'Pregnant' },
                                { k: 'thyroidSurgery', label: 'Thyroid Surgery' },
                                { k: 'i131Treatment', label: 'I131 Therapy' },
                                { k: 'queryHypothyroid', label: 'Query Hypothyroid' },
                                { k: 'queryHyperthyroid', label: 'Query Hyperthyroid' },
                                { k: 'lithium', label: 'Lithium Regimen' },
                                { k: 'goitre', label: 'Goitre Present' },
                                { k: 'tumor', label: 'Tumor Present' },
                                { k: 'hypopituitary', label: 'Hypopituitarism' },
                                { k: 'psych', label: 'Psychotropic Meds' },
                            ].map((flag) => (
                                <div key={flag.k} className="flex flex-col p-3 rounded-lg border border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
                                    <span className="text-xs text-slate-500 dark:text-gray-400 mb-1">{flag.label}</span>
                                    {patient[flag.k] ? (
                                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> True
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-400 dark:text-gray-500 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-gray-600"></div> False
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PatientDetails;
