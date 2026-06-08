import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          Voleergo
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/jobs" className={isActive('/jobs')} onClick={() => setMobileOpen(false)}>
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" className={isActive('/login')} onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <span className="btn btn-primary btn-sm">Get Started</span>
              </Link>
            </>
          ) : (
            <>
              {user.role === 'candidate' && (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/my-applications" className={isActive('/my-applications')} onClick={() => setMobileOpen(false)}>
                    My Applications
                  </Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className={isActive('/employer/dashboard')} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/employer/create-job" className={isActive('/employer/create-job')} onClick={() => setMobileOpen(false)}>
                    Post Job
                  </Link>
                </>
              )}
              <Link to="/profile" className={isActive('/profile')} onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
              <div className="navbar-user">
                <div className="navbar-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
