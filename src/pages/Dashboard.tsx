import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Calendar, Clock, User as UserIcon, DollarSign, X } from 'lucide-react';

interface Appointment {
  id: number;
  appointmentDate: string;
  patientName: string;
  therapistName: string;
  serviceName: string;
  price: number;
  status: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: number) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      try {
        await api.post(`/appointments/${id}/cancel`);
        fetchAppointments();
      } catch (error) {
        alert('Error al cancelar la cita');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Hola, {user?.fullName}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Aquí están tus citas programadas</p>

      <div className="grid grid-cols-3">
        {appointments.map(apt => (
          <div key={apt.id} className="glass-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge ${apt.status === 0 ? 'pending' : apt.status === 1 ? 'completed' : 'cancelled'}`}>
                {apt.status === 0 ? 'Pendiente' : apt.status === 1 ? 'Completada' : 'Cancelada'}
              </span>
              {apt.status === 0 && (
                <button onClick={() => cancelAppointment(apt.id)} className="glass-button outline danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  <X size={14} /> Cancelar
                </button>
              )}
            </div>
            
            <h3 style={{ margin: '0.5rem 0' }}>{apt.serviceName}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
                {new Date(apt.appointmentDate).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
                {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={16} style={{ color: 'var(--accent-primary)' }} />
                {user?.roles.includes('Therapist') ? `Paciente: ${apt.patientName}` : `Terapeuta: ${apt.therapistName}`}
              </div>
              {apt.price && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={16} style={{ color: 'var(--accent-primary)' }} />
                  ${apt.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {appointments.length === 0 && (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>No tienes citas programadas actualmente.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
