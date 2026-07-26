import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    LogOut,
    Stethoscope,
    Menu,
    X,
    Bell,
    Settings,
    ChevronRight,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBackground from "../components/AuroraBackground";
import SettingsModal from "../components/SettingsModal";
import GlobalSearch from "../components/GlobalSearch";

const MainLayout = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { path: "/", icon: LayoutDashboard, label: "Neural Dashboard" },
        { path: "/patients", icon: Users, label: "Patients Registry" },
    ];

    return (
        <div className="flex h-screen bg-[#050505] font-sans selection:bg-indigo-500/30 selection:text-indigo-100 overflow-hidden relative">
            {/* Dynamic Aurora Background */}
            <AuroraBackground />

            <div className="flex w-full h-full p-4 gap-6 z-10">
                {/* Floating Sidebar (Desktop) */}
                <aside className="hidden lg:flex w-72 flex-col h-full overflow-hidden transition-all duration-500 glass-panel">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

                    <div className="p-8 relative z-10">
                        <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => navigate("/")}>
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 border border-slate-700 group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                <Stethoscope size={20} className="relative z-10" />
                            </div>
                            <div>
                                <span className="font-extrabold text-2xl tracking-tight block leading-tight text-slate-100 group-hover:text-white transition-all duration-300">
                                    Thyro<span className="text-indigo-400 font-light group-hover:text-indigo-300">Lab</span>
                                </span>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`sidebar-item group ${isActive ? "sidebar-item-active-premium" : "sidebar-item-inactive"}`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? "text-indigo-300 bg-white/[0.04]" : "text-slate-400 group-hover:text-indigo-300 group-hover:bg-white/[0.05]"}`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className={`tracking-wide text-sm font-semibold transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>{item.label}</span>
                                        {isActive && <ChevronRight size={14} className="ml-auto opacity-70 text-indigo-400" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 pt-0 relative z-10 w-full mb-4">
                        <div className="glass-panel border-white/5 rounded-2xl p-4 mb-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group bg-slate-800/20 backdrop-blur-xl">
                            <div className="w-10 h-10 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                                {currentUser?.username?.charAt(0).toUpperCase() || 'Dr'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Dr. {currentUser?.username || 'Specialist'}</p>
                                <p className="text-xs text-slate-400 truncate">Verified</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex-1 flex items-center justify-center p-3 text-slate-400 hover:text-white rounded-xl transition-all border border-transparent hover:border-white/10 hover:bg-white/5"
                            >
                                <Settings size={18} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 flex items-center justify-center p-3 text-rose-400 hover:text-rose-300 rounded-xl transition-all border border-transparent hover:border-rose-500/20 hover:bg-rose-500/10"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">

                    {/* Header Top-Bar */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-4 mb-4 rounded-3xl shrink-0 z-20 glass-panel">
                        <div className="flex items-center gap-4 flex-1 max-w-md">
                            <GlobalSearch />
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all relative">
                                <Bell size={18} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-700/50 mx-2"></div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-indigo-300 leading-none tracking-wide">System Active</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-y-auto rounded-3xl scroll-smooth relative z-10 custom-scrollbar">
                        <div className="pb-8 max-w-[1400px] mx-auto min-h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Navigation Header */}
            <header className="lg:hidden fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 border border-slate-700">
                        <Stethoscope size={20} className="relative z-10" />
                    </div>
                    <span className="font-bold text-xl text-slate-100">Thyro<span className="text-indigo-400 font-light">Lab</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
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
                        className="fixed inset-0 bg-[#020617]/95 backdrop-blur-3xl z-50 lg:hidden p-8 flex flex-col pt-24"
                    >
                        <nav className="space-y-4 flex-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 p-5 font-bold rounded-2xl border transition-all ${isActive
                                            ? "bg-white/[0.05] text-indigo-400 border-white/[0.1] shadow-sm"
                                            : "bg-transparent text-slate-300 border-white/[0.05] hover:bg-white/[0.02]"
                                            }`}
                                    >
                                        <Icon size={22} className={isActive ? "text-brand-400" : "text-slate-400"} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="pt-8 border-t border-slate-800">
                            <button onClick={handleLogout} className="flex items-center justify-center gap-4 p-5 w-full text-rose-400 font-bold rounded-2xl bg-rose-950/30 border border-rose-900/50 transition-all active:scale-95">
                                <LogOut size={22} />
                                Terminate Session
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Preferences Panel */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default MainLayout;
