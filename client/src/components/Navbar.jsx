import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiCheckSquare, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <FiCheckSquare className="brand-icon" />
          <span>TaskFlow</span>
        </Link>

        <button
          className="navbar-toggle"
          id="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link
                to="/tasks"
                className={`navbar-link ${isActive('/tasks') ? 'active' : ''}`}
                id="nav-tasks"
                onClick={() => setIsOpen(false)}
              >
                <FiCheckSquare />
                <span>Tasks</span>
              </Link>
              <Link
                to="/dashboard"
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                id="nav-dashboard"
                onClick={() => setIsOpen(false)}
              >
                <FiBarChart2 />
                <span>Dashboard</span>
              </Link>
              <div className="navbar-user">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff&rounded=true&size=32`} 
                  alt="User Avatar" 
                  className="user-avatar-img"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <span>{user?.name}</span>
              </div>
              <button
                className="navbar-logout"
                id="nav-logout"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                id="nav-login"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="navbar-cta"
                id="nav-register"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
