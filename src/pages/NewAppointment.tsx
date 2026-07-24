import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar as CalendarIcon } from 'lucide-react';

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

const NewAppointment = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    therapistId: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<{ time: string, value: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      }
    };
    fetchSlots();
  }, [formData.therapistId, formData.date, formData.serviceId, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      setError('Debes seleccionar un horario');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/appointments', {
        therapistId: Number(formData.therapistId),
        serviceId: Number(formData.serviceId),
        appointmentDate: formData.time,
        notes: formData.notes
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Agendar Nueva Cita</h2>
        <p className="text-secondary">Selecciona el servicio y la fecha para consultar disponibilidad</p>
      </div>
      
      {error && <div className="glass-panel" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Servicio</label>
            <select name="serviceId" className="glass-input glass-select" value={formData.serviceId} onChange={handleChange} required>
              <option value="">Selecciona un servicio</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - ${s.price.toFixed(2)} ({s.durationMinutes} min)</option>
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
        </div>

        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
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
        </div>

        <div className="form-group">
          <label className="form-label">Notas Adicionales (Opcional)</label>
          <textarea name="notes" className="glass-input" rows={3} value={formData.notes} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="glass-button" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          <CalendarIcon size={18} /> {loading ? 'Agendando...' : 'Confirmar Cita'}
        </button>
      </form>
    </div>
  );
};

export default NewAppointment;
