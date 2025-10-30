
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [err, setErr] = useState<string>('')
  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErr('')
    try{ await login(email, password); nav('/') }catch(e:any){ setErr(e.message || 'Login failed') }
  }
  return (
    <div className="card" style={{maxWidth:420}}>
      <h2>Login</h2>
      <p className="small">Use admin@example.com/admin123 or create user in Django admin.</p>
      {err && <div className="small" style={{color:'#fde68a'}}>{err}</div>}
      <form className="row" onSubmit={onSubmit}>
        <input className="input" placeholder="Email or Username" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn primary" type="submit">Login</button>
      </form>
      <p className="small" style={{marginTop:8}}>No account? <Link to="/signup">Ask admin or add via /admin</Link></p>
    </div>
  )
}
