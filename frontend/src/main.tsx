import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import './styles.css'
import { AuthProvider, useAuth } from './auth'
import ProtectedRoute from './ProtectedRoute'
import App from './pages/App'
import Matches from './pages/Matches'
import Wallet from './pages/Wallet'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import MySkills from './pages/MySkills'

function Topbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header className="topbar">
      <div className="logo"><Link to="/">SwapSkill</Link></div>
      <nav className="nav">
        {user ? (
          <>
            <NavLink to="/" end>Swipe</NavLink>
            <NavLink to="/matches">Matches</NavLink>
            <NavLink to="/wallet">Wallet</NavLink>
            <NavLink to="/skills">My Skills</NavLink> {/* NEW */}
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <button className="btn" onClick={()=>{logout(); nav('/login')}}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

function Layout(){
  return (
    <div className="container">
      <Topbar />
      <main className="main">
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* authed */}
          <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><MySkills /></ProtectedRoute>} /> {/* PROTECTED */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="footer">Fullstack • Django REST + SQLite + JWT • React + Vite</footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
