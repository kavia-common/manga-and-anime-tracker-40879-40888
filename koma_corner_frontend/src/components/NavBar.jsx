import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation with brand, route links, and auth actions. */
  const { user, loading, error, signInWithGoogle, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">Koma Corner</Link>
        <div className="nav-actions">
          <NavLink to="/search" className="btn">Search</NavLink>
          <NavLink to="/favorites" className="btn">Favorites</NavLink>
          <NavLink to="/progress" className="btn">Progress</NavLink>
          <NavLink to="/protected" className="btn">Protected</NavLink>
          <div className="spacer" />
          {loading && <span className="badge">Checking session…</span>}
          {error && <span className="badge" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>Auth: {error}</span>}
          {user ? (
            <>
              <span className="helper">{user.email}</span>
              <button className="btn btn-danger" onClick={signOut} disabled={loading}>Logout</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={signInWithGoogle} disabled={loading}>Login with Google</button>
          )}
        </div>
      </div>
    </nav>
  );
}
