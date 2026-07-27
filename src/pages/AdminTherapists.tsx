import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { UserPlus, Stethoscope, Edit2 } from 'lucide-react';

interface Therapist {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  specialization: string;
  isAvailable: boolean;
  yearsOfExperience: number;
  bio: string;
  phoneNumber: string;
}

const AdminTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    specialization: '',
    yearsOfExperience: '',
    bio: ''
  });

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await api.get('/admin/therapists');
      setTherapists(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        specialization: formData.specialization,
        yearsOfExperience: Number(formData.yearsOfExperience),
        bio: formData.bio
      };

      if (editingId) {
        await api.put(`/admin/therapists/${editingId}`, payload);
      } else {
        await api.post('/admin/therapists', { ...payload, password: formData.password });
      }

      setShowModal(false);
      setEditingId(null);
      fetchTherapists();
      setFormData({ fullName: '', email: '', phoneNumber: '', password: '', specialization: '', yearsOfExperience: '', bio: '' });
    } catch (error: any) {
      alert("Error al guardar el terapeuta: " + JSON.stringify(error.response?.data));
    }
  };

  const openEditModal = (therapist: Therapist) => {
    setEditingId(therapist.id);
    setFormData({
      fullName: therapist.fullName,
      email: therapist.email,
      phoneNumber: therapist.phoneNumber || '',
      password: '',
      specialization: therapist.specialization,
      yearsOfExperience: therapist.yearsOfExperience?.toString() || '0',
      bio: therapist.bio || ''
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ fullName: '', email: '', phoneNumber: '', password: '', specialization: '', yearsOfExperience: '', bio: '' });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Gestión de Terapeutas</h2>
          <p className="text-secondary">Crea cuentas y asigna especialistas al equipo.</p>
        </div>
        <button className="glass-button" onClick={openNewModal}>
          <UserPlus size={18} /> Nuevo Terapeuta
        </button>
      </div>

      <div className="grid grid-cols-3">
        {therapists.map(t => (
          <div key={t.id} className="glass-panel card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <Stethoscope size={24} style={{ color: 'var(--accent-secondary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.fullName}</h3>
                <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{t.specialization}</span>
              </div>
              <button onClick={() => openEditModal(t)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Edit2 size={16} />
              </button>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t.email}</p>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <span className={`badge ${t.isAvailable ? 'completed' : 'cancelled'}`}>
                {t.isAvailable ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Editar' : 'Registrar'} Terapeuta</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input type="text" name="fullName" className="glass-input" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Correo (Usuario)</label>
                  <input type="email" name="email" className="glass-input" value={formData.email} onChange={handleChange} required disabled={!!editingId} />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" name="phoneNumber" className="glass-input" value={formData.phoneNumber} onChange={handleChange} />
                </div>
              </div>
              {!editingId && (
                <div className="form-group">
                  <label className="form-label">Contraseña Temporal</label>
                  <input type="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} required minLength={6} />
                </div>
              )}
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Especialización</label>
                  <input type="text" name="specialization" className="glass-input" value={formData.specialization} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Años de Experiencia</label>
                  <input type="number" name="yearsOfExperience" className="glass-input" min="0" value={formData.yearsOfExperience} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Biografía</label>
                <textarea name="bio" className="glass-input" rows={3} value={formData.bio} onChange={handleChange}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="glass-button outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="glass-button" style={{ flex: 1 }}>{editingId ? 'Guardar' : 'Registrar'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminTherapists;
