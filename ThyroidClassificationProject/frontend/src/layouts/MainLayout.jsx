import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import patientService from "../services/patient.service";
import {
    LayoutDashboard,
    Users,
    LogOut,
    Stethoscope,
    Menu,
    X,
    Bell,
    Settings,
    Search as SearchIcon,
    ChevronRight,
    Activity,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

const MainLayout = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState("");
    const [todayPositives, setTodayPositives] = useState([]);

    useEffect(() => {
        const fetchTodayNotifications = async () => {
            try {
                const response = await patientService.getAll();
                const data = response.data?.content || response.data || [];
                
                const today = new Date().toLocaleDateString('en-US');
                
                const isPatientPositive = (patient) => {
                    const result = String(patient.prediction?.result || "Unknown").toLowerCase();
                    const service = String(patient.prediction?.serviceName || patient.prediction?.service || "1").toLowerCase();
                    if (result.includes("error") || result === "unknown") return false;
                    if (service.includes("1")) return result.includes("positive");
                    if (service.includes("2")) return result !== "-" && !result.includes("negative") && !result.includes("normal");
                    if (service.includes("3")) return !result.includes("normal") && !result.includes("negative") && !result.includes("benign");
                    return false;
                };

                const positives = data.filter(p => {
                    if (!p.createdAt) return false;
                    const patientDate = new Date(p.createdAt).toLocaleDateString('en-US');
                    return patientDate === today && isPatientPositive(p);
                });
                
                setTodayPositives(positives);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        fetchTodayNotifications();
        
        const interval = setInterval(fetchTodayNotifications, 300000); // refresh every 5 mins
        return () => clearInterval(interval);
    }, []);

    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter') {
            if (globalSearchTerm.trim()) {
                navigate(`/app/patients?search=${encodeURIComponent(globalSearchTerm.trim())}`);
            } else {
                navigate(`/app/patients`);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { path: "/app", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/app/patients", icon: Users, label: "Patients Registry" },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-black font-sans selection:bg-brand-200 selection:text-brand-900 overflow-hidden">
            {/* Clean Sidebar */}
            <aside className="hidden lg:flex w-72 bg-white dark:bg-black flex-col h-full z-30 border-r border-slate-200 dark:border-gray-800 transition-all duration-500 overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => navigate("/app")}>
                        <div className="w-12 h-12 bg-brand-500 dark:bg-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/20 dark:shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight block">
                                Thyro<span className="text-brand-500 dark:text-violet-500">Lab</span>
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                                Diagnostic Registry
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <p className="px-4 text-[10px] font-black dark:text-gray-400 text-slate-400 dark:text-gray-400 uppercase tracking-[0.3em] mb-4">Main Registry</p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-brand-50 text-brand-700 dark:bg-violet-900/40 dark:text-violet-300" : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-dark-surface"}`}
                                >
                                    <Icon size={18} className={isActive ? "text-brand-600 dark:text-violet-400" : "text-slate-400 dark:text-gray-500"} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 pt-0">
                    <div 
                        className="bg-medical-card dark:bg-dark-card rounded-2xl p-5 mb-6 border border-medical-border dark:border-dark-border group cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-border transition-all relative"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-dark-surface border border-medical-border dark:border-dark-border rounded-xl flex items-center justify-center text-brand-500 dark:text-violet-400 font-black shadow-sm group-hover:bg-brand-500 dark:group-hover:bg-violet-600 group-hover:text-white dark:group-hover:text-white transition-all">
                                {currentUser?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-dark-text truncate tracking-tight">Dr. {currentUser?.username}</p>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-dark-text-muted uppercase tracking-widest truncate flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>

                        {/* Profile Popover Overlay */}
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full left-0 w-full mb-4 bg-medical-surface dark:bg-dark-surface border border-medical-border dark:border-dark-border rounded-2xl shadow-2xl p-5 cursor-default z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-brand-50 dark:bg-violet-900/40 border-2 border-brand-100 dark:border-violet-800 rounded-2xl flex items-center justify-center text-brand-600 dark:text-violet-400 font-black text-2xl mb-3 shadow-inner relative">
                                            {currentUser?.username?.charAt(0).toUpperCase()}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-surface rounded-full"></div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Dr. {currentUser?.username}</h4>
                                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Clinician</p>
                                        
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors font-medium text-sm"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-all border border-slate-200">
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all border border-rose-100"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header */}
                <header className="hidden lg:flex items-center justify-between px-10 py-5 bg-medical-surface dark:bg-dark-surface border-b border-medical-border dark:border-dark-border shrink-0">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search universal patient records... (Press Enter)"
                                value={globalSearchTerm}
                                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                                onKeyDown={handleGlobalSearch}
                                className="w-full pl-12 pr-4 py-3 bg-medical-card dark:bg-dark-card border border-medical-border dark:border-dark-border rounded-xl focus:bg-white dark:focus:bg-dark-surface focus:border-brand-500 dark:focus:border-violet-500 focus:outline-none transition-all text-xs font-bold placeholder:text-slate-400 dark:placeholder:text-dark-text-muted"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <ThemeToggle />
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-3 rounded-xl transition-all border relative ${isNotificationsOpen ? 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-dark-text border-slate-300 dark:border-dark-border' : 'text-slate-400 dark:text-dark-text-muted hover:bg-slate-50 dark:hover:bg-dark-card hover:text-slate-600 dark:hover:text-dark-text border-slate-200 dark:border-dark-border'}`}
                            >
                                <Bell size={18} />
                                {todayPositives.length > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-dark-surface animate-pulse"></span>
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="px-5 py-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-dark-card">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Live Notifications</h4>
                                            <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                                {todayPositives.length} New
                                            </span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {todayPositives.length > 0 ? (
                                                todayPositives.reverse().map(patient => (
                                                    <div 
                                                        key={patient.id} 
                                                        onClick={() => { setIsNotificationsOpen(false); navigate(`/app/patients/${patient.id}`); }}
                                                        className="p-4 border-b border-slate-50 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-card cursor-pointer transition-colors"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-lg shrink-0">
                                                                <Activity size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{patient.name}</p>
                                                                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium line-clamp-2">Positive Finding Detected Today</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-5 py-8 text-center bg-white dark:bg-dark-surface">
                                                    <div className="w-12 h-12 bg-slate-50 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-dark-text-muted">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-600 dark:text-gray-300">All Clear Today</p>
                                                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">No abnormal cases recorded today.</p>
                                                </div>
                                            )}
                                        </div>
                                        {todayPositives.length > 0 && (
                                            <div className="p-3 border-t border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-center">
                                                <button onClick={() => { setIsNotificationsOpen(false); navigate('/app/patients'); }} className="text-xs font-bold text-brand-600 dark:text-violet-400 hover:text-brand-700 dark:hover:text-violet-300">
                                                    View Registry
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-8 w-px bg-slate-200 dark:bg-violet-900 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-black dark:text-white text-slate-400 dark:text-dark-text-muted uppercase leading-none mb-1">AI Health</p>
                                <p className="text-[10px] font-black text-brand-500 dark:text-violet-500 uppercase flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 bg-brand-500 dark:bg-violet-500 rounded-full animate-pulse"></span>
                                    Sync Live
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 lg:p-10 max-w-[1400px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Mobile Navigation Header */}
            <header className="lg:hidden fixed top-0 w-full bg-medical-surface dark:bg-dark-surface border-b border-medical-border dark:border-dark-border z-40 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-500 dark:bg-violet-600 rounded-lg flex items-center justify-center text-white">
                        <Stethoscope size={20} />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Thyro<span className="text-brand-500 dark:text-violet-500">Lab</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-slate-100 rounded-lg">
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Mobile Navigation Hub */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="fixed inset-0 bg-medical-surface dark:bg-dark-surface z-50 lg:hidden p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-black dark:text-white text-2xl tracking-tighter text-slate-900 dark:text-dark-text uppercase">Navigation</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-dark-card rounded-lg text-slate-600 dark:text-dark-text"><X size={20} /></button>
                        </div>
                        <nav className="space-y-4 flex-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 p-5 text-slate-600 dark:text-dark-text font-bold rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-dark-border active:bg-brand-50 active:text-brand-600 transition-all font-sans"
                                    >
                                        <Icon size={22} className="text-brand-500" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="pt-8 border-t border-slate-100 dark:border-dark-border">
                            <button onClick={handleLogout} className="flex items-center justify-center gap-4 p-5 w-full text-rose-500 dark:text-rose-400 font-bold rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 transition-all active:scale-95">
                                <LogOut size={22} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MainLayout;
