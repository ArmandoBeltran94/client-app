import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RequestAppointment = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    notes: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('/appointmentrequests', formData);
      setStatus('success');
      setFormData({ patientName: '', phoneNumber: '', notes: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Hubo un error al procesar tu solicitud.');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Solicitar Cita</h2>
      <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Déjanos tus datos y nos pondremos en contacto contigo para agendar tu cita.
      </p>

      {status === 'success' && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center' }}>
          ¡Tu petición ha sido enviada exitosamente! Te llamaremos pronto.
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Nombre Completo</label>
          <input
            type="text"
            name="patientName"
            className="glass-input"
            value={formData.patientName}
            onChange={handleChange}
            required
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            name="phoneNumber"
            className="glass-input"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Ej. 555-123-4567"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Motivo o Notas (Opcional)</label>
          <textarea
            name="notes"
            className="glass-input"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Cuéntanos brevemente sobre tu molestia o el servicio que buscas..."
          />
        </div>

        <button
          type="submit"
          className="glass-button"
          disabled={status === 'loading'}
          style={{ marginTop: '1rem' }}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
        </button>

        <button
          type="button"
          className="glass-button"
          onClick={() => navigate('/login')}
          style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Volver a Inicio de Sesión
        </button>
      </form>
    </div>
  );
};

export default RequestAppointment;
