import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { UserPlus, Calendar, X, Check } from 'lucide-react';

interface AppointmentRequest {
  id: number;
  patientName: string;
  phoneNumber: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface Therapist {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
}

const AdminRequests = () => {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Data for modal
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ time: string, value: string }[]>([]);

  // Form data for processing
  const [formData, setFormData] = useState({
    therapistId: '',
    serviceId: '',
    date: '',
    time: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRequests = async () => {
    try {
      const response = await api.get('/appointmentrequests');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Fetch form data for processing modal
    const fetchFormData = async () => {
      try {
        const response = await api.get('/appointments/form-data');
        setTherapists(response.data.therapists);
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching form data", error);
      }
    };
    fetchFormData();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.therapistId && formData.date && formData.serviceId) {
        const service = services.find(s => s.id === Number(formData.serviceId));
        if (!service) return;

        try {
          const response = await api.get('/appointments/available-slots', {
            params: {
              therapistId: formData.therapistId,
              date: formData.date,
              durationMinutes: service.durationMinutes
            }
          });
          setAvailableSlots(response.data);
        } catch (error) {
          console.error("Error fetching slots", error);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchSlots();
  }, [formData.therapistId, formData.date, formData.serviceId, services]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openProcessModal = (id: number) => {
    setProcessingId(id);
    setFormData({ therapistId: '', serviceId: '', date: '', time: '' });
    setError('');
    setSuccess('');
  };

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      setError('Debes seleccionar un horario');
      return;
    }

    setError('');

    try {
      await api.post(`/appointmentrequests/${processingId}/process`, {
        therapistId: Number(formData.therapistId),
        serviceId: Number(formData.serviceId),
        appointmentDate: formData.time
      });
      setSuccess('Petición procesada y cita creada exitosamente.');
      setTimeout(() => {
        setProcessingId(null);
        fetchRequests();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la petición');
    }
  };

  if (loading) return <div>Cargando peticiones...</div>;

  const modalContent = processingId !== null ? (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Asignar Cita</h3>
          <button onClick={() => setProcessingId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={18} /> {success}</div>}

        {!success && (
          <form onSubmit={handleProcessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Servicio</label>
              <select name="serviceId" className="glass-input glass-select" value={formData.serviceId} onChange={handleChange} required>
                <option value="">Selecciona un servicio</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Terapeuta</label>
              <select name="therapistId" className="glass-input glass-select" value={formData.therapistId} onChange={handleChange} required>
                <option value="">Selecciona un terapeuta</option>
                {therapists.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input type="date" name="date" className="glass-input" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="form-group">
              <label className="form-label">Hora Disponible</label>
              <select name="time" className="glass-input glass-select" value={formData.time} onChange={handleChange} required disabled={!availableSlots.length || !formData.date}>
                <option value="">Selecciona horario</option>
                {availableSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.time}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="glass-button" style={{ marginTop: '1rem' }}>
              Confirmar y Crear Cita
            </button>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Peticiones de Cita</h2>
        <p className="text-secondary">Gestiona las solicitudes de personas que dejaron sus datos.</p>
      </div>

      <div className="glass-panel card">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Teléfono</th>
                <th>Motivo / Notas</th>
                <th>Fecha de Solicitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{req.patientName}</td>
                  <td>{req.phoneNumber}</td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {req.notes || '-'}
                  </td>
                  <td>{new Date(req.createdAt.endsWith('Z') ? req.createdAt : req.createdAt + 'Z').toLocaleString()}</td>
                  <td>
                    <button
                      className="glass-button"
                      onClick={() => openProcessModal(req.id)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      <UserPlus size={14} style={{ marginRight: '0.25rem' }} /> Procesar
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay peticiones pendientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalContent && createPortal(modalContent, document.body)}
    </div>
  );
};

export default AdminRequests;
