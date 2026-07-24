import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/account/register', {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      login(response.data.token);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Error al registrarse. Verifica tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Crear Cuenta</h2>
        <p className="text-secondary">Únete para comenzar a agendar tus citas</p>
      </div>

      {error && <div className="glass-panel" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre Completo</label>
          <input type="text" name="fullName" className="glass-input" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <input type="email" name="email" className="glass-input" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input type="tel" name="phoneNumber" className="glass-input" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" className="glass-input" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
          </div>
        </div>
        
        <button type="submit" className="glass-button" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          <UserPlus size={18} /> {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
