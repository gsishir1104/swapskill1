import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';
export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth();
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (role && user.role !== role)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=ProtectedRoute.js.map