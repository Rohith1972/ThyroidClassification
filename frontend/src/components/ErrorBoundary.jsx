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
                <div className="min-h-screen bg-medical-base flex items-center justify-center p-6 font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl w-full card-premium p-10 !rounded-[2.5rem] shadow-2xl shadow-rose-100/50 border-rose-100"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-rose-50 text-rose-500 rounded-3xl mb-6">
                                <AlertTriangle size={48} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Encountered an Error</h1>
                            <p className="text-slate-500 font-medium mt-2 mb-8">
                                A critical error occurred while processing the request. Our technical team has been notified.
                            </p>

                            <div className="w-full bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100 overflow-hidden">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Diagnostic Trace</p>
                                <div className="max-h-40 overflow-y-auto text-xs font-mono text-rose-600/80 leading-relaxed CustomScrollbar">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 btn-primary bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 py-4"
                                >
                                    <RefreshCw size={18} /> Retry Session
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 shadow-lg shadow-brand-100"
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
