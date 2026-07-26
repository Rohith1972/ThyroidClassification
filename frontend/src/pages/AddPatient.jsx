import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import patientService from "../services/patient.service";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ChevronLeft,
    User,
    Activity,
    Dna,
    AlertCircle,
    Save,
    FlaskConical,
    Check,
    Beaker,
    Stethoscope
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const schema = yup.object({
    name: yup.string().required("Patient name is required"),
    age: yup.number().typeError("Age must be a number").positive().integer().required("Age is required"),
    gender: yup.string().required("Gender selection is required"),

    tshMeasured: yup.boolean(),
    t3Measured: yup.boolean(),
    tt4Measured: yup.boolean(),
    t4uMeasured: yup.boolean(),
    ftiMeasured: yup.boolean(),

    tsh: yup.mixed().when("tshMeasured", {
        is: true,
        then: () => yup.number().typeError("Value required").required("Score required"),
        otherwise: () => yup.mixed().nullable().notRequired()
    }),
    tt4: yup.mixed().when("tt4Measured", {
        is: true,
        then: () => yup.number().typeError("Value required").required("Score required"),
        otherwise: () => yup.mixed().nullable().notRequired()
    }),
    t4u: yup.mixed().when("t4uMeasured", {
        is: true,
        then: () => yup.number().typeError("Value required").required("Score required"),
        otherwise: () => yup.mixed().nullable().notRequired()
    }),
    fti: yup.mixed().when("ftiMeasured", {
        is: true,
        then: () => yup.number().typeError("Value required").required("Score required"),
        otherwise: () => yup.mixed().nullable().notRequired()
    }),

    onThyroxine: yup.boolean(),
    queryOnThyroxine: yup.boolean(),
    onAntithyroidMedication: yup.boolean(),
    sick: yup.boolean(),
    pregnant: yup.boolean(),
    thyroidSurgery: yup.boolean(),
    i131Treatment: yup.boolean(),
    queryHypothyroid: yup.boolean(),
    queryHyperthyroid: yup.boolean(),
    lithium: yup.boolean(),
    goitre: yup.boolean(),
    tumor: yup.boolean(),
    hypopituitary: yup.boolean(),
    psych: yup.boolean(),
}).required();

const FormSection = ({ title, subtitle, icon: Icon, children, glowColor = "rgba(99,102,241,0.4)" }) => (
    <div className="relative pb-10">
        <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center text-white border border-slate-700 shadow-premium transition-transform duration-300 group-hover:scale-110" style={{ boxShadow: `0 0 20px ${glowColor}` }}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black tracking-tight uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 text-gradient-animate drop-shadow-md">{title}</h3>
                <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                    <span className="w-4 h-px bg-brand-500/50"></span>
                    {subtitle}
                </p>
            </div>
        </div>
        <div className="pl-0 lg:pl-16">
            {children}
        </div>
    </div>
);

const AddPatient = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tshMeasured: false,
            t3Measured: false,
            tt4Measured: false,
            t4uMeasured: false,
            ftiMeasured: false,
            gender: "Male",
            selectedService: "ensemble"
        }
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        const { name, age, gender, ...rest } = data;
        const payload = {
            name,
            age: parseInt(age),
            gender,
            selectedService: data.selectedService,
            labValues: {
                // Numeric values
                tsh: rest.tshMeasured ? (parseFloat(data.tsh) || 0.0) : null,
                tt4: rest.tt4Measured ? (parseFloat(data.tt4) || 0.0) : null,
                t4u: rest.t4uMeasured ? (parseFloat(data.t4u) || 0.0) : null,
                fti: rest.ftiMeasured ? (parseFloat(data.fti) || 0.0) : null,

                // Measurement flags
                tshMeasured: !!rest.tshMeasured,
                t3Measured: !!rest.t3Measured,
                tt4Measured: !!rest.tt4Measured,
                t4uMeasured: !!rest.t4uMeasured,
                ftiMeasured: !!rest.ftiMeasured,

                // Clinical flags
                onThyroxine: !!rest.onThyroxine,
                queryOnThyroxine: !!rest.queryOnThyroxine,
                onAntithyroidMedication: !!rest.onAntithyroidMedication,
                sick: !!rest.sick,
                pregnant: !!rest.pregnant,
                thyroidSurgery: !!rest.thyroidSurgery,
                i131Treatment: !!rest.i131Treatment,
                queryHypothyroid: !!rest.queryHypothyroid,
                queryHyperthyroid: !!rest.queryHyperthyroid,
                lithium: !!rest.lithium,
                goitre: !!rest.goitre,
                tumor: !!rest.tumor,
                hypopituitary: !!rest.hypopituitary,
                psych: !!rest.psych
            }
        };

        try {
            await patientService.createPatient(payload);
            toast.success("RECORD DEPLOYED TO NODE", { theme: "dark" });
            navigate("/patients");
        } catch (error) {
            console.error(error);
            toast.error("DEPLOYMENT FAILURE", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 relative z-10">
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-4 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-brand-200 to-brand-400 text-gradient-animate drop-shadow-md">Protocol Injection</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Clinical Intake Node v4.2</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="flex items-center gap-2 px-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] shadow-sm">
                        <ChevronLeft size={16} />
                        Abort Link
                    </Link>
                    <div className="px-6 py-4 bg-emerald-950/30 rounded-xl border border-emerald-900/50 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-0.5">Active Uplink</p>
                    </div>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl !p-8 lg:!p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <div className="w-64 h-64 bg-brand-500 blur-[80px] rounded-full translate-x-32 -translate-y-32"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 relative z-10">
                    {/* Section 1: Identity */}
                    <FormSection title="Biological Data" subtitle="Core Patient Info" icon={User} glowColor="rgba(99,102,241,0.4)">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Biological Designation</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors z-10" size={18} />
                                    <input {...register('name')} className="input-premium input-recessed pl-12 h-14 text-sm focus:shadow-glow-brand transition-all duration-300" placeholder="Subject Alpha" />
                                </div>
                                {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 tracking-widest uppercase">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Temporal Age</label>
                                <div className="relative group">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors z-10" size={18} />
                                    <input type="number" {...register('age')} className="input-premium input-recessed pl-12 h-14 text-sm focus:shadow-glow-brand transition-all duration-300" placeholder="25" />
                                </div>
                                {errors.age && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 tracking-widest uppercase">{errors.age.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Chromosome Node</label>
                                <div className="relative group">
                                    <Dna className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors z-10" size={18} />
                                    <select {...register('gender')} className="input-premium input-recessed pl-12 h-14 text-sm appearance-none cursor-pointer focus:shadow-glow-brand transition-all duration-300">
                                        <option value="Male" className="bg-slate-900 text-white">XY MALE</option>
                                        <option value="Female" className="bg-slate-900 text-white">XX FEMALE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 2: Laboratory Markers */}
                    <FormSection title="Diagnostic Markers" subtitle="Neural Processing Inputs" icon={FlaskConical} glowColor="rgba(244,63,94,0.4)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: 'tsh', measured: 'tshMeasured', label: 'TSH Indicator', unit: 'mIU/L', icon: Activity },
                                { id: 'tt4', measured: 'tt4Measured', label: 'TT4 Level', unit: 'ug/dL', icon: Beaker },
                                { id: 't4u', measured: 't4uMeasured', label: 'T4U Matrix', unit: 'Ratio', icon: FlaskConical },
                                { id: 'fti', measured: 'ftiMeasured', label: 'FTI Score', unit: 'Numeric', icon: Stethoscope },
                            ].map((field) => (
                                <div key={field.id} className={`p-8 rounded-3xl border transition-all duration-300 ${watch(field.measured) ? 'bg-slate-800/80 border-brand-500/50 shadow-glow-brand' : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/40'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-colors ${watch(field.measured) ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                                                <field.icon size={20} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-black text-white uppercase tracking-tight">{field.label}</label>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{field.unit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${watch(field.measured) ? 'text-brand-400' : 'text-slate-600'}`}>Tracked</span>
                                            <label className="relative cursor-pointer">
                                                <input type="checkbox" {...register(field.measured)} className="sr-only peer" />
                                                <div className="w-14 h-8 bg-slate-800 peer-checked:bg-gradient-to-r peer-checked:from-brand-600 peer-checked:to-brand-400 rounded-full transition-all border border-slate-700 peer-checked:border-brand-400 shadow-inner"></div>
                                                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-slate-400 peer-checked:bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {watch(field.measured) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-5 border-t border-slate-700/50">
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        {...register(field.id)}
                                                        className="w-full bg-slate-900/80 px-6 py-4 border-2 border-brand-500/30 rounded-2xl focus:outline-none focus:border-brand-400 focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/20 transition-all text-2xl font-black text-white placeholder:text-slate-600 shadow-inner focus:shadow-glow-brand input-recessed"
                                                        placeholder="0.00"
                                                        autoFocus
                                                    />
                                                    {errors[field.id] && <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1 uppercase tracking-widest">{errors[field.id].message}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Special case for T3 Measured only as per model features */}
                            <div className={`p-8 rounded-3xl border transition-all duration-300 ${watch('t3Measured') ? 'bg-slate-800/80 border-accent-500/50 shadow-glow-accent' : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/40'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors ${watch('t3Measured') ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                                            <Beaker size={20} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-black text-white uppercase tracking-tight">T3 Status</label>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Binary Flag Only</p>
                                        </div>
                                    </div>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" {...register('t3Measured')} className="sr-only peer" />
                                        <div className="w-14 h-8 bg-slate-800 peer-checked:bg-gradient-to-r peer-checked:from-accent-600 peer-checked:to-accent-400 rounded-full transition-all border border-slate-700 peer-checked:border-accent-400 shadow-inner"></div>
                                        <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-slate-400 peer-checked:bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 3: Clinical History */}
                    <FormSection title="Medical Context" subtitle="Metabolic History Flags" icon={Activity} glowColor="rgba(16,185,129,0.4)">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: 'onThyroxine', label: 'On Thyroxine' },
                                { id: 'queryOnThyroxine', label: 'Query Thyroxine' },
                                { id: 'onAntithyroidMedication', label: 'Antithyroid Meds' },
                                { id: 'sick', label: 'Clinical Illness' },
                                { id: 'pregnant', label: 'Gestational' },
                                { id: 'thyroidSurgery', label: 'Surgical Hist' },
                                { id: 'i131Treatment', label: 'I131 Therapy' },
                                { id: 'queryHypothyroid', label: 'Query Hypo' },
                                { id: 'queryHyperthyroid', label: 'Query Hyper' },
                                { id: 'lithium', label: 'Lithium Load' },
                                { id: 'goitre', label: 'Goitre Flag' },
                                { id: 'tumor', label: 'Neoplasm' },
                                { id: 'hypopituitary', label: 'Hypopituitary' },
                                { id: 'psych', label: 'Psychotropic' },
                            ].map(flag => (
                                <label key={flag.id} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${watch(flag.id) ? 'bg-slate-800 border-accent-500/50 text-accent-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800/80 hover:border-slate-600'}`}>
                                    <div className="relative">
                                        <input type="checkbox" {...register(flag.id)} className="sr-only" />
                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${watch(flag.id) ? 'bg-accent-500 border-accent-400 text-slate-900 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-slate-800/50 border-slate-600 text-transparent'}`}>
                                            <Check size={14} className="stroke-[3px]" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{flag.label}</span>
                                </label>
                            ))}
                        </div>
                    </FormSection>

                    {/* Section 4: AI Model Selection */}
                    <FormSection title="Neural Routing" subtitle="Select Target AI Microservice" icon={Cpu} glowColor="rgba(168,85,247,0.4)">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: 'ensemble', label: 'Global Ensemble', desc: 'Queries all available services and aggregates results for maximum certainty.' },
                                { id: 'ai-service-1', label: 'AI Service 1', desc: 'Standard Random Forest protocol. Best for generalized predictions.' },
                                { id: 'ai-service-2', label: 'AI Service 2', desc: 'CNN / TI-RADS heuristics matrix. Specialized for borderline cases.' },
                                { id: 'ai-service-3', label: 'AI Service 3', desc: 'Deep Node architecture. Advanced fallback simulation node.' }
                            ].map(service => (
                                <label key={service.id} className={`flex flex-col gap-2 p-5 rounded-xl cursor-pointer transition-all border ${watch('selectedService') === service.id ? 'bg-slate-800 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800/80 hover:border-slate-600'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <input type="radio" value={service.id} {...register('selectedService')} className="sr-only" />
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${watch('selectedService') === service.id ? 'bg-purple-500 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-800/50 border-slate-600'}`}>
                                                {watch('selectedService') === service.id && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{service.label}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 mt-1 pl-8 leading-relaxed opacity-80">{service.desc}</p>
                                </label>
                            ))}
                        </div>
                    </FormSection>

                    {/* Final Actions */}
                    <div className="pt-10 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4 text-slate-400 max-w-sm">
                            <AlertCircle size={24} className="text-brand-500 shrink-0 opacity-80" />
                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed text-slate-500">System Verification: Laboratory metrics will be validated against Neural Model v4.2 before finalization.</p>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary btn-volumetric !h-20 !px-16 w-full sm:w-auto text-lg active:scale-95 transition-all outline-none focus:ring-4 focus:ring-brand-500/30 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none mix-blend-multiply"></div>
                            {loading ? (
                                <Activity className="animate-spin text-white relative z-10" size={24} />
                            ) : (
                                <div className="flex items-center gap-3 relative z-10">
                                    <Save size={24} className="group-hover:-translate-y-1 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                    <span className="font-black uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Deploy Protocol</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddPatient;
