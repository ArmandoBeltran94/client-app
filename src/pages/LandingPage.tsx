import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Shield, Activity, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      if (user?.roles.includes('Admin')) navigate('/admin');
      else if (user?.roles.includes('Therapist')) navigate('/therapist');
      else navigate('/dashboard');
    } else {
      navigate('/solicitar-cita');
    }
  };

  const services = [
    {
      title: 'Rehabilitación Deportiva',
      description: 'Recupérate más rápido y vuelve a tu deporte favorito con nuestros programas especializados de alto rendimiento.',
      image: '/images/sports_rehab.png',
      icon: <Activity size={24} style={{ color: 'var(--accent-primary)' }} />
    },
    {
      title: 'Terapia Manual',
      description: 'Alivio del dolor crónico y agudo mediante técnicas de masaje profesional y manipulación articular.',
      image: '/images/manual_therapy.png',
      icon: <Users size={24} style={{ color: 'var(--accent-secondary)' }} />
    },
    {
      title: 'Electroterapia Avanzada',
      description: 'Tratamiento de vanguardia para la reducción del dolor y estimulación muscular con tecnología moderna.',
      image: '/images/electrotherapy.png',
      icon: <Shield size={24} style={{ color: 'var(--warning)' }} />
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '6rem 2rem',
        background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
        marginBottom: '4rem'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Recupera tu Movilidad,<br/>Mejora tu Vida
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Clínica de fisioterapia especializada. Tratamientos personalizados y tecnología de vanguardia para garantizar tu bienestar y recuperación total.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="glass-button" 
            onClick={handleCtaClick}
            style={{ 
              fontSize: '1.1rem', 
              padding: '1rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            <Calendar size={20} />
            {isAuthenticated ? 'Ir a mi Panel' : 'Agendar una Cita'}
          </button>
          {!isAuthenticated && (
            <button 
              className="glass-button outline" 
              onClick={() => navigate('/login')}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nuestros Servicios</h2>
          <p className="text-secondary">Conoce los tratamientos que ofrecemos para ayudarte a sentirte mejor.</p>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {services.map((service, index) => (
            <div 
              key={index} 
              className="glass-panel card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                    {service.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{service.title}</h3>
                </div>
                <p className="text-secondary" style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {service.description}
                </p>
                <button 
                  onClick={() => navigate('/solicitar-cita')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--accent-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    padding: 0
                  }}
                >
                  Saber más <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section style={{ marginTop: '6rem' }}>
        <div className="glass-panel" style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%)'
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-3" style={{ gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div>
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Profesionales</h3>
              <p className="text-secondary">Especialistas certificados con años de experiencia clínica.</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Tecnología</h3>
              <p className="text-secondary">Equipamiento moderno y técnicas basadas en evidencia científica.</p>
            </div>
            <div>
              <h3 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>Personalizado</h3>
              <p className="text-secondary">Tratamientos diseñados específicamente para tus necesidades únicas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
