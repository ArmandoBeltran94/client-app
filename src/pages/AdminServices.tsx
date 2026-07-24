import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Activity, Edit2 } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/admin/services');
      setServices(response.data);
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
        id: editingId || 0,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        isActive: true
      };

      if (editingId) {
        await api.put(`/admin/services/${editingId}`, payload);
      } else {
        await api.post('/admin/services', payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchServices();
      setFormData({ name: '', description: '', price: '', durationMinutes: '' });
    } catch (error) {
      alert("Error al guardar el servicio");
    }
  };

  const openEditModal = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString()
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', durationMinutes: '' });
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
          <h2>Gestión de Servicios</h2>
          <p className="text-secondary">Administra los tipos de terapia y sus costos.</p>
        </div>
        <button className="glass-button" onClick={openNewModal}>
          <Plus size={18} /> Nuevo Servicio
        </button>
      </div>

      <div className="grid grid-cols-3">
        {services.map(service => (
          <div key={service.id} className="glass-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                <Activity size={20} className="text-accent-primary" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => openEditModal(service)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <Edit2 size={16} />
                </button>
                <span className="badge completed">${service.price.toFixed(2)}</span>
              </div>
            </div>
            <h3 style={{ margin: '0.5rem 0 0' }}>{service.name}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{service.description}</p>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
              ⏱️ {service.durationMinutes} minutos
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Editar' : 'Nuevo'} Servicio de Terapia</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre de la Terapia</label>
                <input type="text" name="name" className="glass-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea name="description" className="glass-input" rows={3} value={formData.description} onChange={handleChange} required></textarea>
              </div>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input type="number" name="price" className="glass-input" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duración (minutos)</label>
                  <input type="number" name="durationMinutes" className="glass-input" min="1" value={formData.durationMinutes} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="glass-button outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="glass-button" style={{ flex: 1 }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
