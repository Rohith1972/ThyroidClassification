import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Bell,
    UserPlus,
    Activity,
    Clock,
    Stethoscope,
    ChevronRight,
    Search,
    Zap
} from "lucide-react";

const LiveFeed = ({ isOpen, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-thyroid");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                setConnected(true);
                client.subscribe("/topic/activities", (message) => {
                    const activity = JSON.parse(message.body);
                    setActivities(prev => [activity, ...prev].slice(0, 50));
                });
            },
            onDisconnect: () => setConnected(false),
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    const activityVariants = {
        hidden: { opacity: 0, x: 20, y: 10 },
        visible: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900/95 border-l border-white/5 backdrop-blur-2xl z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-slate-900/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl rounded-full bg-brand-500 translate-x-1/2 -translate-y-1/2"></div>

                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                                        <Bell size={20} className={connected ? "animate-pulse" : ""} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Activity Stream</h2>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-400'}`}></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {connected ? 'Real-time Linked' : 'Connection Lost'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Search/Filter Bar */}
                        <div className="px-6 py-4 bg-slate-900/30 border-b border-white/5">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Filter neural activities..."
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all backdrop-blur-md shadow-inner"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {activities.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50"
                                    >
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                                            <Zap size={24} className="text-slate-700" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">No activities detected</p>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Standby for incoming node data...</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    activities.map((activity, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={activityVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                            className="group relative"
                                        >
                                            <div className="card-premium !bg-slate-800/30 border-holographic !p-4 hover:!bg-slate-800/50 transition-all cursor-pointer">
                                                <div className="flex gap-4">
                                                    <div className="relative">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${activity.type === 'PATIENT_REGISTERED'
                                                            ? 'bg-brand-500/10 border-brand-500/20 text-brand-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                                            : 'bg-accent-500/10 border-accent-500/20 text-accent-400 shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                                                            }`}>
                                                            {activity.type === 'PATIENT_REGISTERED' ? <UserPlus size={18} /> : <Activity size={18} />}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${activity.type === 'PATIENT_REGISTERED' ? 'bg-brand-400' : 'bg-accent-400'}`}></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activity.type.replace('_', ' ')}</span>
                                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
                                                                <Clock size={10} />
                                                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                        <p className="text-white text-xs font-bold leading-relaxed mb-2 group-hover:text-brand-200 transition-colors">
                                                            {activity.message}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2 rounded-lg border border-white/5">
                                                                <Stethoscope size={12} className="text-brand-400" />
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Node: {activity.actor || 'System'}</span>
                                                            </div>
                                                            <ChevronRight size={12} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Status */}
                        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Activity Interface v1.0.42</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LiveFeed;
