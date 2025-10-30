
import React, { useEffect, useState } from 'react'
import api from '../api'
export default function Admin(){
  const [users, setUsers] = useState<any[]>([])
  useEffect(()=>{ (async()=>{
    // Quick admin view: reuse Django admin for CRUD; here only show counts
    const skills = await api.get('/skills/')
    setUsers(skills.data) // placeholder to keep page non-empty
  })() },[])
  return <div className="card" style={{width:720}}><h2>Admin</h2><p className="small">Use Django Admin at <code>/admin</code> for full control.</p></div>
}
