import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
export default function Navbar() {
    return (_jsxs("header", { className: "container", style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }, children: [_jsx(NavLink, { to: "/", style: { fontWeight: 700 }, children: "SwapSkill" }), _jsxs("nav", { style: { display: "flex", gap: 16 }, children: [_jsx(NavLink, { to: "/", children: "Swipe" }), _jsx(NavLink, { to: "/matches", children: "Matches" }), _jsx(NavLink, { to: "/wallet", children: "Wallet" }), _jsx(NavLink, { to: "/skills", children: "My Skills" }), " "] })] }));
}
//# sourceMappingURL=Navbar.js.map