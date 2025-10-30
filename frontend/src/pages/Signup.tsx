import React, { useState } from 'react';
import { register, login } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user'|'admin'>('user');
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      // 1) Create the user (public endpoint)
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        role, // must be 'user' or 'admin' (lowercase)
      });

      // 2) Auto-login with the same credentials
      const r = await login(username.trim(), password);
      localStorage.setItem('access', r.data.access);
      localStorage.setItem('refresh', r.data.refresh);

      setMsg('✅ Account created! Logging you in…');
      // 3) Go to app
      nav('/');
    } catch (err: any) {
      // Show a helpful message from backend if present
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.email?.[0] ||
        err?.message ||
        'Registration failed.';
      setMsg(`❌ ${detail}`);
      console.error('Signup error:', err?.response || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{maxWidth:420}}>
      <h2>Sign Up</h2>
      <form className="row" onSubmit={onSubmit}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        <select
          className="input"
          value={role}
          onChange={e=>setRole(e.target.value as 'user'|'admin')}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      {msg && <p style={{marginTop:8}}>{msg}</p>}
    </div>
  );
}
