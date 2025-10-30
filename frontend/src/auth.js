import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, me as apiMe } from './api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        (async () => {
            const t = localStorage.getItem('access');
            if (t) {
                try {
                    const r = await apiMe();
                    setUser(r.data);
                }
                catch {
                    localStorage.clear();
                }
            }
        })();
    }, []);
    async function login(email, password) {
        const r = await apiLogin(email, password);
        localStorage.setItem('access', r.data.access);
        localStorage.setItem('refresh', r.data.refresh);
        const me = await apiMe();
        setUser(me.data);
    }
    function logout() { localStorage.clear(); setUser(null); }
    return _jsx(AuthContext.Provider, { value: { user, login, logout }, children: children });
}
export function useAuth() { const v = useContext(AuthContext); if (!v)
    throw new Error('useAuth inside provider'); return v; }
//# sourceMappingURL=auth.js.map