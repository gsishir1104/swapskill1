import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { listCreditTxns } from '../api';
export default function Wallet() {
    const [rows, setRows] = useState([]);
    useEffect(() => { (async () => { const r = await listCreditTxns(); setRows(r.data); })(); }, []);
    return (_jsxs("div", { className: "card", style: { width: 720 }, children: [_jsx("h2", { children: "Wallet" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "When" }), _jsx("th", { children: "Delta" }), _jsx("th", { children: "Reason" })] }) }), _jsxs("tbody", { children: [rows.map((t) => (_jsxs("tr", { children: [_jsx("td", { children: new Date(t.created_at).toLocaleString() }), _jsx("td", { children: t.delta > 0 ? `+${t.delta}` : t.delta }), _jsx("td", { children: t.reason })] }, t.id))), rows.length === 0 && _jsx("tr", { children: _jsx("td", { colSpan: 3, children: "No transactions yet." }) })] })] })] }));
}
//# sourceMappingURL=Wallet.js.map