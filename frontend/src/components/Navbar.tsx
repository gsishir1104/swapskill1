import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0"}}>
      <NavLink to="/" style={{fontWeight:700}}>SwapSkill</NavLink>
      <nav style={{display:"flex",gap:16}}>
        <NavLink to="/">Swipe</NavLink>
        <NavLink to="/matches">Matches</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
        <NavLink to="/skills">My Skills</NavLink> {/* new */}
      </nav>
    </header>
  );
}
