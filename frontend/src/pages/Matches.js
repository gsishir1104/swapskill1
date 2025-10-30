import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React, { useEffect, useState } from "react";
// import { listMatches } from "../api";
// type MiniUser = { id: string; username?: string; full_name?: string };
// type Match = {
//   id: string;
//   user_a?: MiniUser | string; // tolerate old shape
//   user_b?: MiniUser | string; // tolerate old shape
//   status: string;
//   created_at: string;
// };
// function displayName(u?: MiniUser | string) {
//   if (!u) return "—";
//   if (typeof u === "string") return u.slice(0, 8) + "…"; // old API fallback
//   return u.full_name?.trim() || u.username || (u.id ? u.id.slice(0, 8) + "…" : "—");
// }
// export default function Matches() {
//   const [rows, setRows] = useState<Match[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string>("");
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await listMatches();
//         if (mounted) setRows(res.data || []);
//       } catch (e: any) {
//         console.error(e);
//         setErr("Failed to load matches.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);
//   if (loading) return <div className="card">Loading…</div>;
//   if (err) return <div className="card">❌ {err}</div>;
//   return (
//     <div className="card" style={{ width: 760, maxWidth: "100%" }}>
//       <h3>Matches</h3>
//       {rows.length === 0 ? (
//         <p>No matches yet.</p>
//       ) : (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>User A</th>
//               <th>User B</th>
//               <th>Status</th>
//               <th>Created</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((m) => (
//               <tr key={m.id}>
//                 <td>{m.id.slice(0, 8)}…</td>
//                 <td>{displayName(m.user_a)}</td>
//                 <td>{displayName(m.user_b)}</td>
//                 <td>{m.status}</td>
//                 <td>{new Date(m.created_at).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { listMatches } from "../api";
export default function Matches() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    async function load() {
        setLoading(true);
        try {
            const { data } = await listMatches();
            setRows(data || []);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
        // also refresh when tab becomes visible, so a fresh like shows up
        const onVis = () => document.visibilityState === "visible" && load();
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);
    return (_jsxs("div", { className: "card", style: { width: 760, maxWidth: "100%" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h3", { style: { margin: 0 }, children: "Matches" }), _jsx("button", { className: "btn", onClick: load, children: "Refresh" })] }), loading ? (_jsx("p", { style: { marginTop: 12 }, children: "Loading\u2026" })) : rows.length === 0 ? (_jsx("p", { style: { marginTop: 12 }, children: "No matches yet. Like someone on the Swipe page!" })) : (_jsxs("table", { className: "table", style: { marginTop: 12 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "User A" }), _jsx("th", { children: "User B" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Created" })] }) }), _jsx("tbody", { children: rows.map((m) => (_jsxs("tr", { children: [_jsxs("td", { title: m.id, children: [m.id.slice(0, 8), "\u2026"] }), _jsx("td", { children: m.user_a?.display_name || m.user_a?.full_name || m.user_a?.username }), _jsx("td", { children: m.user_b?.display_name || m.user_b?.full_name || m.user_b?.username }), _jsx("td", { children: m.status }), _jsx("td", { children: new Date(m.created_at).toLocaleString() })] }, m.id))) })] }))] }));
}
//# sourceMappingURL=Matches.js.map