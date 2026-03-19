import { useState, useEffect } from "react";
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
    Stethoscope,
    Cpu,
    Zap,
    Upload,
    ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const schema = yup.object({
    name: yup.string().required("Patient name is required"),
    age: yup.number().typeError("Age must be a number").positive().integer().required("Age is required"),
    gender: yup.string().required("Gender selection is required"),
    aiServiceType: yup.string().required("AI service selection is required"),

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
    
    // TI-RADS Features
    composition: yup.string(),
    echogenicity: yup.string(),
    shape: yup.string(),
    calcification: yup.string(),
    margin: yup.string(),

    // Image Upload
    ultrasoundImageBase64: yup.string().when("aiServiceType", {
        is: "AI_SERVICE_3",
        then: () => yup.string().required("Ultrasound image is required for this neural model."),
        otherwise: () => yup.string().nullable().notRequired()
    })
}).required();

const FormSection = ({ title, subtitle, icon: Icon, children, color = "bg-slate-100" }) => (
    <div className="relative pb-10">
        <div className="flex items-center gap-5 mb-8">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-105`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-200"></span>
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
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tshMeasured: false,
            t3Measured: false,
            tt4Measured: false,
            t4uMeasured: false,
            ftiMeasured: false,
            gender: "Male",
            aiServiceType: "AI_SERVICE_1",
            composition: "solid",
            echogenicity: "hypoechoic",
            shape: "wider-than-tall",
            calcification: "none",
            margin: "smooth",
            ultrasoundImageBase64: null
        }
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aiServicesLoading, setAiServicesLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    // Fallback static AI services in case the API call fails
    const FALLBACK_AI_SERVICES = [
        { name: "AI_SERVICE_1", displayName: "RandomForest Model", serviceName: "ai-service-1" },
        { name: "AI_SERVICE_2", displayName: "TI-RADS CNN Model", serviceName: "ai-service-2" },
        { name: "AI_SERVICE_3", displayName: "Deep Learning CNN", serviceName: "ai-service-3" },
        { name: "AI_SERVICE_4", displayName: "HistGradientBoosting", serviceName: "ai-service-4" },
    ];

    const [aiServices, setAiServices] = useState(FALLBACK_AI_SERVICES);

    useEffect(() => {
        const fetchAIServices = async () => {
            try {
                setAiServicesLoading(true);
                const response = await patientService.getAIServices();
                if (response.data && response.data.length > 0) {
                    setAiServices(response.data);
                } else {
                    // Keep fallback if API returns empty
                    setAiServices(FALLBACK_AI_SERVICES);
                }
            } catch (error) {
                console.error("Error fetching AI services, using defaults:", error);
                toast.warn("Using default AI service list (backend may still be loading)");
                setAiServices(FALLBACK_AI_SERVICES);
            } finally {
                setAiServicesLoading(false);
            }
        };
        fetchAIServices();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('ultrasoundImageBase64', reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const { name, age, gender, ...rest } = data;
        const payload = {
            name,
            age: parseInt(age),
            gender,
            aiServiceType: rest.aiServiceType,
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
                psych: !!rest.psych,
                
                // TI-RADS Features
                composition: rest.composition,
                echogenicity: rest.echogenicity,
                shape: rest.shape,
                calcification: rest.calcification,
                margin: rest.margin,
                
                // Base64 Image string for CNN
                ultrasoundImageBase64: rest.ultrasoundImageBase64
            }
        };

        try {
            await patientService.createPatient(payload);
            toast.success("PREDICTION COMPLETE");
            navigate("/patients");
        } catch (error) {
            console.error(error);
            toast.error("PREDICTION FAILURE");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase italic">Patient <span className="text-brand-500">Inbound</span></h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Clinical Intake Node v4.2</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-bold uppercase tracking-widest text-[10px]">
                        <ChevronLeft size={16} />
                        Back
                    </Link>
                    <div className="px-5 py-3 bg-brand-50 rounded-xl border border-brand-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></div>
                        <p className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Active Uplink</p>
                    </div>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium !p-8 lg:!p-12"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
                    {/* Section 1: Identity */}
                    <FormSection title="Biological Data" subtitle="Core Patient Info" icon={User} color="bg-brand-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                    <input {...register('name')} className="input-premium pl-12 h-14 text-sm" placeholder="Subject Alpha" />
                                </div>
                                {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Age</label>
                                <div className="relative group">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                    <input type="number" {...register('age')} className="input-premium pl-12 h-14 text-sm" placeholder="25" />
                                </div>
                                {errors.age && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.age.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Node</label>
                                <div className="relative group">
                                    <Dna className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                    <select {...register('gender')} className="input-premium pl-12 h-14 text-sm appearance-none cursor-pointer">
                                        <option value="Male">XY MALE</option>
                                        <option value="Female">XX FEMALE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* AI Service Selection */}
                    <FormSection title="AI Service Selection" subtitle="Choose Neural Processing Engine" icon={Cpu} color="bg-purple-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {aiServices.map((service) => (
                                <label key={service.name} className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                                    watch('aiServiceType') === service.name 
                                        ? 'bg-purple-50 border-purple-300 shadow-lg shadow-purple-500/10' 
                                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                }`}>
                                    <input
                                        type="radio"
                                        {...register('aiServiceType')}
                                        value={service.name}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl transition-all ${
                                            watch('aiServiceType') === service.name 
                                                ? 'bg-purple-500 text-white shadow-lg' 
                                                : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            <Cpu size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-1">
                                                {service.displayName}
                                            </h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {service.serviceName}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <Zap size={12} className="text-purple-500" />
                                                <span className={`text-[8px] font-bold uppercase tracking-widest ${
                                                    watch('aiServiceType') === service.name ? 'text-purple-600' : 'text-slate-400'
                                                }`}>
                                                    {watch('aiServiceType') === service.name ? 'SELECTED' : 'AVAILABLE'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.aiServiceType && <p className="text-[10px] text-rose-500 font-bold mt-4 ml-1">{errors.aiServiceType.message}</p>}
                    </FormSection>

                    {/* Conditional Sections based on AI Service Selection */}
                    {watch('aiServiceType') !== 'AI_SERVICE_3' && (
                        <>
                            {watch('aiServiceType') === 'AI_SERVICE_2' && (
                                <FormSection title="Ultrasound Features" subtitle="TI-RADS Image Parameters" icon={ImageIcon} color="bg-blue-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Composition</label>
                                            <select {...register('composition')} className="input-premium h-14 text-sm appearance-none cursor-pointer px-4">
                                                <option value="solid">Solid</option>
                                                <option value="cystic">Cystic</option>
                                                <option value="spongiform">Spongiform</option>
                                                <option value="mixed">Mixed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Echogenicity</label>
                                            <select {...register('echogenicity')} className="input-premium h-14 text-sm appearance-none cursor-pointer px-4">
                                                <option value="hypoechoic">Hypoechoic</option>
                                                <option value="very hypoechoic">Very Hypoechoic</option>
                                                <option value="isoechoic">Isoechoic</option>
                                                <option value="hyperechoic">Hyperechoic</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shape</label>
                                            <select {...register('shape')} className="input-premium h-14 text-sm appearance-none cursor-pointer px-4">
                                                <option value="wider-than-tall">Wider-than-tall</option>
                                                <option value="taller-than-wide">Taller-than-wide</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Calcification</label>
                                            <select {...register('calcification')} className="input-premium h-14 text-sm appearance-none cursor-pointer px-4">
                                                <option value="none">None or Large Comet-tail</option>
                                                <option value="macrocalcification">Macrocalcification</option>
                                                <option value="peripheral">Peripheral</option>
                                                <option value="punctate">Punctate</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Margin</label>
                                            <select {...register('margin')} className="input-premium h-14 text-sm appearance-none cursor-pointer px-4">
                                                <option value="smooth">Smooth</option>
                                                <option value="ill-defined">Ill-defined</option>
                                                <option value="lobulated">Lobulated</option>
                                                <option value="extrathyroidal">Extrathyroidal extension</option>
                                            </select>
                                        </div>
                                    </div>
                                </FormSection>
                            )}
                            
                            {/* Section 2: Laboratory Markers */}
                    <FormSection title="Diagnostic Markers" subtitle="Neural Processing Inputs" icon={FlaskConical} color="bg-rose-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: 'tsh', measured: 'tshMeasured', label: 'TSH Indicator', unit: 'mIU/L', icon: Activity },
                                { id: 'tt4', measured: 'tt4Measured', label: 'TT4 Level', unit: 'ug/dL', icon: Beaker },
                                { id: 't4u', measured: 't4uMeasured', label: 'T4U Matrix', unit: 'Ratio', icon: FlaskConical },
                                { id: 'fti', measured: 'ftiMeasured', label: 'FTI Score', unit: 'Numeric', icon: Stethoscope },
                            ].map((field) => (
                                <div key={field.id} className={`p-8 rounded-3xl border transition-all duration-300 ${watch(field.measured) ? 'bg-slate-50 border-brand-200' : 'bg-white border-slate-100 hover:bg-slate-50/50'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${watch(field.measured) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <field.icon size={20} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-black text-slate-900 uppercase tracking-tight">{field.label}</label>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{field.unit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold uppercase transition-colors ${watch(field.measured) ? 'text-brand-600' : 'text-slate-300'}`}>Measured?</span>
                                            <label className="relative cursor-pointer">
                                                <input type="checkbox" {...register(field.measured)} className="sr-only peer" />
                                                <div className="w-14 h-8 bg-slate-100 peer-checked:bg-brand-500 rounded-full transition-all border border-slate-200"></div>
                                                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
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
                                                <div className="pt-4 border-t border-slate-200">
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        {...register(field.id)}
                                                        className="w-full bg-white px-6 py-4 border-2 border-brand-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all text-2xl font-black text-slate-900 placeholder:text-slate-100"
                                                        placeholder="0.00"
                                                        autoFocus
                                                    />
                                                    {errors[field.id] && <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors[field.id].message}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Special case for T3 Measured only as per model features */}
                            <div className={`p-8 rounded-3xl border transition-all duration-300 ${watch('t3Measured') ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${watch('t3Measured') ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Beaker size={20} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-black text-slate-900 uppercase tracking-tight">T3 Status</label>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Binary Flag Only</p>
                                        </div>
                                    </div>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" {...register('t3Measured')} className="sr-only peer" />
                                        <div className="w-14 h-8 bg-slate-100 peer-checked:bg-emerald-500 rounded-full transition-all border border-slate-200"></div>
                                        <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 3: Clinical History */}
                    <FormSection title="Medical Context" subtitle="Metabolic History Flags" icon={Activity} color="bg-emerald-500">
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
                                <label key={flag.id} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${watch(flag.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                                    <div className="relative">
                                        <input type="checkbox" {...register(flag.id)} className="sr-only" />
                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${watch(flag.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                            <Check size={14} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{flag.label}</span>
                                </label>
                            ))}
                        </div>
                    </FormSection>
                        </>
                    )}

                    {/* Section 3 for Upload */}
                    {watch('aiServiceType') === 'AI_SERVICE_3' && (
                        <FormSection title="Ultrasound Upload" subtitle="Deep Learning Image Input" icon={Upload} color="bg-indigo-500">
                            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-white" />
                                        <button 
                                            type="button" 
                                            onClick={() => { setImagePreview(null); setValue('ultrasoundImageBase64', null); }}
                                            className="absolute -top-4 -right-4 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg font-bold"
                                        >
                                            X
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm mb-4">
                                            <Upload size={32} />
                                        </div>
                                        <span className="text-lg font-black text-slate-800 uppercase">Select Image</span>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">JPEG, PNG up to 5MB</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                            {errors.ultrasoundImageBase64 && <p className="text-[10px] text-rose-500 font-bold mt-4 uppercase text-center">{errors.ultrasoundImageBase64.message}</p>}
                        </FormSection>
                    )}

                    {/* Final Actions */}
                    <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4 text-slate-400 max-w-sm">
                            <AlertCircle size={24} className="text-brand-500 shrink-0" />
                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">System Verification: Laboratory metrics will be validated against Neural Model v4.2 before finalization.</p>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary !h-20 !px-16 w-full sm:w-auto text-lg shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                            {loading ? (
                                <Activity className="animate-spin text-white" size={24} />
                            ) : (
                                <>
                                    <Save size={24} />
                                    <span className="font-black uppercase tracking-widest">Predict</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddPatient;
