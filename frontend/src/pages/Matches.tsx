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

type MiniUser = { id: string; username: string; full_name?: string; display_name?: string };
type Match = {
  id: string;
  user_a: MiniUser;
  user_b: MiniUser;
  status: string;
  created_at: string;
};

export default function Matches() {
  const [rows, setRows] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await listMatches();
      setRows(data || []);
    } finally {
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

  return (
    <div className="card" style={{ width: 760, maxWidth: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Matches</h3>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      {loading ? (
        <p style={{ marginTop: 12 }}>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ marginTop: 12 }}>No matches yet. Like someone on the Swipe page!</p>
      ) : (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User A</th>
              <th>User B</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td title={m.id}>{m.id.slice(0, 8)}…</td>
                <td>{m.user_a?.display_name || m.user_a?.full_name || m.user_a?.username}</td>
                <td>{m.user_b?.display_name || m.user_b?.full_name || m.user_b?.username}</td>
                <td>{m.status}</td>
                <td>{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
