import React from 'react';
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl w-full card-premium p-10 !rounded-[2.5rem] shadow-2xl shadow-rose-100/50 dark:shadow-violet-500/20 border-rose-100 dark:border-violet-800"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-3xl mb-6">
                                <AlertTriangle size={48} />
                            </div>
                            <h1 className="text-3xl font-black dark:text-white text-slate-900 dark:text-white tracking-tight">System Encountered an Error</h1>
                            <p className="text-slate-500 dark:text-gray-400 font-medium mt-2 mb-8">
                                A critical error occurred while processing the request. Our technical team has been notified.
                            </p>

                            <div className="w-full bg-slate-50 dark:bg-gray-900 rounded-2xl p-6 text-left mb-8 border border-slate-100 dark:border-gray-800 overflow-hidden">
                                <p className="text-[10px] font-black dark:text-gray-400 text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-3">Diagnostic Trace</p>
                                <div className="max-h-40 overflow-y-auto text-xs font-mono text-rose-600/80 dark:text-rose-400/80 leading-relaxed CustomScrollbar">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 btn-primary bg-slate-800 dark:bg-gray-800 hover:bg-slate-900 dark:hover:bg-gray-700 flex items-center justify-center gap-2 py-4"
                                >
                                    <RefreshCw size={18} /> Retry Session
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 shadow-lg shadow-brand-100 dark:shadow-violet-500/20"
                                >
                                    <Home size={18} /> Dashboard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
