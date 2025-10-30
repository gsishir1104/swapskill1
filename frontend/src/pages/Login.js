import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [err, setErr] = useState('');
    async function onSubmit(e) {
        e.preventDefault();
        setErr('');
        try {
            await login(email, password);
            nav('/');
        }
        catch (e) {
            setErr(e.message || 'Login failed');
        }
    }
    return (_jsxs("div", { className: "card", style: { maxWidth: 420 }, children: [_jsx("h2", { children: "Login" }), _jsx("p", { className: "small", children: "Use admin@example.com/admin123 or create user in Django admin." }), err && _jsx("div", { className: "small", style: { color: '#fde68a' }, children: err }), _jsxs("form", { className: "row", onSubmit: onSubmit, children: [_jsx("input", { className: "input", placeholder: "Email or Username", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { className: "input", placeholder: "Password", type: "password", value: password, onChange: e => setPassword(e.target.value) }), _jsx("button", { className: "btn primary", type: "submit", children: "Login" })] }), _jsxs("p", { className: "small", style: { marginTop: 8 }, children: ["No account? ", _jsx(Link, { to: "/signup", children: "Ask admin or add via /admin" })] })] }));
}
//# sourceMappingURL=Login.js.map