
import React, { useEffect, useState } from 'react'
import { listCreditTxns } from '../api'
export default function Wallet(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ (async()=>{ const r = await listCreditTxns(); setRows(r.data) })() },[])
  return (
    <div className="card" style={{width:720}}>
      <h2>Wallet</h2>
      <table className="table">
        <thead><tr><th>When</th><th>Delta</th><th>Reason</th></tr></thead>
        <tbody>
          {rows.map((t:any)=>(<tr key={t.id}><td>{new Date(t.created_at).toLocaleString()}</td><td>{t.delta>0?`+${t.delta}`:t.delta}</td><td>{t.reason}</td></tr>))}
          {rows.length===0 && <tr><td colSpan={3}>No transactions yet.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
