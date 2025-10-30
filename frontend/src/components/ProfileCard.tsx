
import React from 'react'
import type { User } from '../types'
export default function ProfileCard({ u }: { u: User }){
  return (
    <div className="card card-profile">
      <h2>{u.full_name || u.username}</h2>
      <div className="small">Role: {u.role} • Rep {u.reputation} • Credits {u.credits}</div>
      <p style={{marginTop:8}}>{u.bio || '—'}</p>
      <div className="small" style={{marginTop:8}}>Timezone: {u.timezone || '—'}</div>
      <div className="small" style={{marginTop:8}}>ID: {u.id.slice(0,8)}…</div>
    </div>
  )
}
