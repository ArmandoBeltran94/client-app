import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <nav className="glass-panel nav-bar container" style={{ marginTop: '1rem', borderRadius: '16px' }}>
        <Link to="/" className="nav-link" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} />
          <span>TerapiaFísica</span>
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              {user?.roles.includes('Admin') && (
                <>
                  <Link to="/admin" className="nav-link">Panel Admin</Link>
                  <Link to="/admin/services" className="nav-link">Servicios</Link>
                  <Link to="/admin/therapists" className="nav-link">Terapeutas</Link>
                  <Link to="/admin/users" className="nav-link">Usuarios</Link>
                </>
              )}
              {user?.roles.includes('Therapist') && (
                <Link to="/therapist" className="nav-link">Panel Terapeuta</Link>
              )}
              {user?.roles.includes('Patient') && (
                <>
                  <Link to="/appointments/new" className="nav-link">Agendar Cita</Link>
                  <Link to="/payments" className="nav-link">Pagar Cita</Link>
                </>
              )}
              <Link to="/profile" className="nav-link" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                <User size={18} /> {user?.fullName}
              </Link>
              <button onClick={logout} className="glass-button outline" style={{ padding: '8px 16px' }}>
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="glass-button" style={{ textDecoration: 'none' }}>Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
