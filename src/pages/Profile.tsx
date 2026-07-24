import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User as UserIcon, Save, Key, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: '' // We don't have phoneNumber in AuthContext user by default, but we can update it
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/account/me', {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      });
      
      setSuccess('Perfil actualizado correctamente');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Mi Perfil</h2>
        <p className="text-secondary">Administra tu información personal y credenciales de acceso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
        <div style={{ gridColumn: 'span 1' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <UserCheck size={40} className="text-accent-primary" />
            </div>
            <h3>{user?.fullName}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {user?.roles.map(role => (
                <span key={role} className="badge" style={{ background: 'var(--glass-border)', color: 'var(--text-primary)' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <div className="glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <UserIcon size={20} className="text-accent-primary" /> Información Personal
            </h3>
            
            {error && <div className="glass-panel" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--completed)', color: 'var(--completed)', padding: '1rem', marginBottom: '1rem' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input type="text" name="fullName" className="glass-input" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="phoneNumber" className="glass-input" value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Key size={20} className="text-accent-primary" /> Cambiar Contraseña
              </h3>

              <div className="form-group">
                <label className="form-label">Contraseña Actual <span className="text-secondary" style={{fontWeight: 'normal'}}>(Requerido si deseas cambiarla)</span></label>
                <input type="password" name="currentPassword" className="glass-input" value={formData.currentPassword} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nueva Contraseña</label>
                  <input type="password" name="newPassword" className="glass-input" value={formData.newPassword} onChange={handleChange} minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input type="password" name="confirmPassword" className="glass-input" value={formData.confirmPassword} onChange={handleChange} minLength={6} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" className="glass-button" disabled={loading}>
                  <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
