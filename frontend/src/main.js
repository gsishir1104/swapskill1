import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { AuthProvider, useAuth } from './auth';
import ProtectedRoute from './ProtectedRoute';
import App from './pages/App';
import Matches from './pages/Matches';
import Wallet from './pages/Wallet';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import MySkills from './pages/MySkills';
function Topbar() {
    const { user, logout } = useAuth();
    const nav = useNavigate();
    return (_jsxs("header", { className: "topbar", children: [_jsx("div", { className: "logo", children: _jsx(Link, { to: "/", children: "SwapSkill" }) }), _jsx("nav", { className: "nav", children: user ? (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/", end: true, children: "Swipe" }), _jsx(NavLink, { to: "/matches", children: "Matches" }), _jsx(NavLink, { to: "/wallet", children: "Wallet" }), _jsx(NavLink, { to: "/skills", children: "My Skills" }), " ", user.role === 'admin' && _jsx(NavLink, { to: "/admin", children: "Admin" }), _jsx("button", { className: "btn", onClick: () => { logout(); nav('/login'); }, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/login", children: "Login" }), _jsx(NavLink, { to: "/signup", children: "Signup" })] })) })] }));
}
function Layout() {
    return (_jsxs("div", { className: "container", children: [_jsx(Topbar, {}), _jsx("main", { className: "main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(App, {}) }) }), _jsx(Route, { path: "/matches", element: _jsx(ProtectedRoute, { children: _jsx(Matches, {}) }) }), _jsx(Route, { path: "/wallet", element: _jsx(ProtectedRoute, { children: _jsx(Wallet, {}) }) }), _jsx(Route, { path: "/skills", element: _jsx(ProtectedRoute, { children: _jsx(MySkills, {}) }) }), " ", _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { role: "admin", children: _jsx(Admin, {}) }) })] }) }), _jsx("footer", { className: "footer", children: "Fullstack \u2022 Django REST + SQLite + JWT \u2022 React + Vite" })] }));
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(Layout, {}) }) }) }));
//# sourceMappingURL=main.js.map