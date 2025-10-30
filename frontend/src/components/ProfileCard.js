import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export default function ProfileCard({ u }) {
    return (_jsxs("div", { className: "card card-profile", children: [_jsx("h2", { children: u.full_name || u.username }), _jsxs("div", { className: "small", children: ["Role: ", u.role, " \u2022 Rep ", u.reputation, " \u2022 Credits ", u.credits] }), _jsx("p", { style: { marginTop: 8 }, children: u.bio || '—' }), _jsxs("div", { className: "small", style: { marginTop: 8 }, children: ["Timezone: ", u.timezone || '—'] }), _jsxs("div", { className: "small", style: { marginTop: 8 }, children: ["ID: ", u.id.slice(0, 8), "\u2026"] })] }));
}
//# sourceMappingURL=ProfileCard.js.map