import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Admin() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            // Quick admin view: reuse Django admin for CRUD; here only show counts
            const skills = await api.get('/skills/');
            setUsers(skills.data); // placeholder to keep page non-empty
        })();
    }, []);
    return _jsxs("div", { className: "card", style: { width: 720 }, children: [_jsx("h2", { children: "Admin" }), _jsxs("p", { className: "small", children: ["Use Django Admin at ", _jsx("code", { children: "/admin" }), " for full control."] })] });
}
//# sourceMappingURL=Admin.js.map