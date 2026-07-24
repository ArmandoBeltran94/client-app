import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Edit2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await api.put(`/admin/users/${editingId}`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password || undefined
      });
      setShowModal(false);
      setEditingId(null);
      fetchUsers();
      setFormData({ fullName: '', email: '', phoneNumber: '', password: '' });
    } catch (error: any) {
      alert("Error al actualizar el usuario: " + JSON.stringify(error.response?.data));
    }
  };

  const openEditModal = (user: User) => {
    setEditingId(user.id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="text-secondary">Administra la información de acceso de todos los usuarios.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Usuario</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Correo / Teléfono</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Roles</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                      <Users size={20} className="text-accent-primary" />
                    </div>
                    <span style={{ fontWeight: '500' }}>{u.fullName} {u.id === currentUser?.id ? '(Tú)' : ''}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>{u.email}</div>
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{u.phoneNumber || 'Sin teléfono'}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {u.roles.map(role => (
                      <span key={role} className="badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}>
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => openEditModal(u)} className="glass-button outline" style={{ padding: '0.5rem 1rem' }}>
                    <Edit2 size={16} /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Editar Usuario</h3>
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
                <input type="tel" name="phoneNumber" className="glass-input" value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Nueva Contraseña <span className="text-secondary" style={{fontWeight: 'normal'}}>(Opcional, déjalo en blanco para no cambiarla)</span></label>
                <div style={{ position: 'relative' }}>
                  <input type="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} minLength={6} />
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--warning)' }}>
                <ShieldAlert size={20} />
                <span style={{ fontSize: '0.875rem' }}>Al modificar el correo o la contraseña, el usuario deberá usar las nuevas credenciales para iniciar sesión.</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="glass-button outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="glass-button" style={{ flex: 1 }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
