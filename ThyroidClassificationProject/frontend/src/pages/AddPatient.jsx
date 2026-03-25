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
    ImageIcon,
    Loader2
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

const FormSection = ({ title, subtitle, icon: Icon, children, color = "bg-slate-100 dark:bg-dark-card" }) => (
    <div className="relative pb-10">
        <div className="flex items-center gap-5 mb-8">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-105`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
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
        { name: "AI_SERVICE_2", displayName: "HistGB Thyroid Service", serviceName: "ai-service-2" },
        { name: "AI_SERVICE_3", displayName: "Deep Learning CNN", serviceName: "ai-service-3" },
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
            navigate("/app/patients");
        } catch (error) {
            console.error(error);
            toast.error("PREDICTION FAILURE");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto pb-20"
        >
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-dark-border">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Add New Patient</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Input clinical data for AI analysis</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/app/patients" className="btn-secondary">
                        <ChevronLeft size={16} />
                        Back to Registry
                    </Link>
                    <button
                        type="submit"
                        form="patient-form"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={20} />
                                Process Patient
                            </>
                        )}
                    </button>
                </div>
            </header>
            <form id="patient-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Section 1: Identity */}
                <FormSection title="Patient Demographics" subtitle="Basic Information" icon={User} color="bg-indigo-500 dark:bg-violet-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Full Name</label>
                            <input {...register('name')} className="input-premium" placeholder="e.g. John Doe" />
                            {errors.name && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Age</label>
                            <input type="number" {...register('age')} className="input-premium" placeholder="e.g. 45" />
                            {errors.age && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">{errors.age.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Biological Sex</label>
                            <select {...register('gender')} className="input-premium appearance-none cursor-pointer">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </FormSection>

                {/* AI Service Selection */}
                <FormSection title="Model Selection" subtitle="Choose AI Engine" icon={Cpu} color="bg-indigo-500 dark:bg-violet-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {aiServices.map((service) => (
                            <label key={service.name} className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                                watch('aiServiceType') === service.name 
                                    ? 'bg-indigo-50 border-indigo-300 dark:bg-violet-900/40 dark:border-violet-500' 
                                    : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-dark-card dark:border-dark-border'
                            }`}>
                                    <input
                                        type="radio"
                                        {...register('aiServiceType')}
                                        value={service.name}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg transition-all ${
                                            watch('aiServiceType') === service.name 
                                                ? 'bg-indigo-500 text-white dark:bg-violet-600' 
                                                : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-gray-400'
                                        }`}>
                                            <Cpu size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold text-sm mb-1 ${watch('aiServiceType') === service.name ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-gray-300'}`}>
                                                {service.displayName}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">
                                                {service.serviceName}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.aiServiceType && <p className="text-xs text-rose-500 font-medium mt-2">{errors.aiServiceType.message}</p>}
                    </FormSection>

                    {/* Conditional Sections based on AI Service Selection */}
                    {watch('aiServiceType') !== 'AI_SERVICE_3' && (
                        <>
                            {/* Removed TI-RADS Ultrasound Features for AI_SERVICE_2 since it is changed to HistGB Model */}
                                {/* Removed Ultrasound Features component */}
                            
                            {/* Section 2: Laboratory Markers */}
                    <FormSection title="Laboratory Values" subtitle="Blood Test Results" icon={FlaskConical} color="bg-indigo-500 dark:bg-violet-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: 'tsh', measured: 'tshMeasured', label: 'TSH Indicator', unit: 'mIU/L', icon: Activity },
                                { id: 'tt4', measured: 'tt4Measured', label: 'TT4 Level', unit: 'ug/dL', icon: Beaker },
                                { id: 't4u', measured: 't4uMeasured', label: 'T4U Matrix', unit: 'Ratio', icon: FlaskConical },
                                { id: 'fti', measured: 'ftiMeasured', label: 'FTI Score', unit: 'Numeric', icon: Stethoscope },
                            ].map((field) => (
                                <div key={field.id} className={`p-6 rounded-xl border transition-all duration-300 ${watch(field.measured) ? 'bg-indigo-50 border-indigo-200 dark:bg-violet-900/10 dark:border-violet-800' : 'bg-white border-slate-200 dark:bg-dark-card dark:border-dark-border hover:bg-slate-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${watch(field.measured) ? 'bg-indigo-500 dark:bg-violet-600 text-white' : 'bg-slate-100 dark:bg-dark-surface text-slate-500 dark:text-gray-400'}`}>
                                                <field.icon size={20} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-900 dark:text-white">{field.label}</label>
                                                <p className="text-xs font-medium text-slate-500">{field.unit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-slate-500">Measured</span>
                                            <label className="relative cursor-pointer">
                                                <input type="checkbox" {...register(field.measured)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-checked:bg-indigo-500 dark:peer-checked:bg-violet-500 rounded-full transition-all"></div>
                                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {watch(field.measured) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        {...register(field.id)}
                                                        className="w-full bg-white dark:bg-dark-card px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-violet-500 transition-all text-lg font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-500"
                                                        placeholder="0.00"
                                                        autoFocus
                                                    />
                                                    {errors[field.id] && <p className="text-xs text-rose-500 font-medium mt-1">{errors[field.id].message}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            <div className={`p-6 rounded-xl border transition-all duration-300 ${watch('t3Measured') ? 'bg-indigo-50 border-indigo-200 dark:bg-violet-900/10 dark:border-violet-800' : 'bg-white border-slate-200 dark:bg-dark-card dark:border-dark-border hover:bg-slate-50'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${watch('t3Measured') ? 'bg-indigo-500 text-white dark:bg-violet-600' : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-gray-400'}`}>
                                            <Beaker size={20} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-900 dark:text-white">T3 Status</label>
                                            <p className="text-xs font-medium text-slate-500">Measured Flag</p>
                                        </div>
                                    </div>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" {...register('t3Measured')} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-checked:bg-indigo-500 dark:peer-checked:bg-violet-500 rounded-full transition-all"></div>
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 3: Clinical History */}
                    <FormSection title="Medical History" subtitle="Clinical Flags" icon={Activity} color="bg-indigo-500 dark:bg-violet-600">
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
                                <label key={flag.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${watch(flag.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-violet-900/10 dark:border-violet-800 dark:text-violet-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-dark-card dark:border-dark-border dark:text-gray-400 dark:hover:bg-dark-surface'}`}>
                                    <div className="relative">
                                        <input type="checkbox" {...register(flag.id)} className="sr-only" />
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${watch(flag.id) ? 'bg-indigo-500 border-indigo-500 text-white dark:bg-violet-600 dark:border-violet-600' : 'bg-white border-slate-300 text-transparent dark:bg-dark-surface dark:border-gray-600'}`}>
                                            <Check size={12} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{flag.label}</span>
                                </label>
                            ))}
                        </div>
                    </FormSection>
                        </>
                    )}

                    {/* Section 3 for Upload */}
                    {watch('aiServiceType') === 'AI_SERVICE_3' && (
                        <FormSection title="Ultrasound Upload" subtitle="Deep Learning Image Input" icon={Upload} color="bg-indigo-500 dark:bg-violet-600">
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-dark-surface hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-xl shadow-sm border-2 border-white dark:border-gray-700" />
                                        <button 
                                            type="button" 
                                            onClick={() => { setImagePreview(null); setValue('ultrasoundImageBase64', null); }}
                                            className="absolute -top-3 -right-3 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md font-bold text-xs hover:bg-rose-600 transition-colors"
                                        >
                                            <Check className="rotate-45" size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <div className="w-16 h-16 bg-white dark:bg-dark-card border border-slate-200 dark:border-gray-700 rounded-full flex items-center justify-center text-slate-500 dark:text-gray-400 shadow-sm mb-4">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-base font-semibold text-slate-900 dark:text-white">Click to Upload Ultrasound</span>
                                        <span className="text-xs text-slate-500 dark:text-gray-400 mt-1">JPEG, PNG up to 5MB</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                            {errors.ultrasoundImageBase64 && <p className="text-sm text-rose-500 font-medium mt-3 text-center">{errors.ultrasoundImageBase64.message}</p>}
                        </FormSection>
                    )}

                    {/* Final Actions */}
                    <div className="pt-8 flex justify-end">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? (
                                <Activity className="animate-spin text-white" size={20} />
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Analyze Patient Data</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
    );
};

export default AddPatient;
