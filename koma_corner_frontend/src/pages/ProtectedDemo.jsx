import React from 'react';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedDemo() {
  /**
   * A simple protected page that verifies authentication.
   * Displays current user's email.
   */
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">Protected Area</h2>
        <p className="helper">You are signed in as:</p>
        <div className="filters">
          <div className="row">
            <strong>{user?.email}</strong>
          </div>
          <div className="row">
            <span className="helper">Only visible when authenticated.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
