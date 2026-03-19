import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ allowedRoles, fallback = "/login", children }) => {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-medical-base flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-brand-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Verifying Credentials...
                    </p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to={fallback} replace />;
    }

    // Role check - assuming basic structure, can be expanded
    if (allowedRoles && !allowedRoles.some(role => currentUser.roles?.includes(role))) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
