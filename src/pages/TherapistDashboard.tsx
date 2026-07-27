import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, User as UserIcon, CheckCircle, LogOut } from 'lucide-react';

interface Appointment {
  id: number;
  appointmentDate: string;
  patientName: string;
  serviceName: string;
  status: number;
  paymentStatus?: number;
  isPaid?: boolean;
  notes: string;
}

const TherapistDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/therapist/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: number) => {
    try {
      await api.put(`/therapist/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dashboard del Terapeuta</h2>
        <p className="text-secondary">Bienvenido, {user?.fullName}. Aquí tienes tus citas programadas.</p>
      </div>

      <div className="grid grid-cols-3">
        {appointments.map(apt => (
          <div key={apt.id} className="glass-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className={`badge ${apt.status === 0 ? 'pending' : apt.status === 1 ? 'info' : apt.status === 2 ? 'success' : 'cancelled'}`}>
                  {apt.status === 0 ? 'Programada' : apt.status === 1 ? 'Confirmada / En Sala' : apt.status === 2 ? 'Finalizada' : 'Cancelada'}
                </span>
                <span className={`badge ${apt.isPaid ? 'success' : 'pending'}`}>
                  {apt.isPaid ? 'Pagado' : 'Pago Pendiente'}
                </span>
              </div>
            </div>
            
            <h3 style={{ margin: '0.5rem 0' }}>{apt.serviceName}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={16} className="text-accent-primary" />
                {new Date(apt.appointmentDate).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} className="text-accent-primary" />
                {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={16} className="text-accent-primary" />
                Paciente: {apt.patientName}
              </div>
              {apt.notes && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                  <strong>Notas:</strong> {apt.notes}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              {apt.status === 0 && (
                <button onClick={() => updateStatus(apt.id, 1)} className="glass-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>
                  <CheckCircle size={16} /> Llegada
                </button>
              )}
              {apt.status === 1 && (
                <button onClick={() => updateStatus(apt.id, 2)} className="glass-button outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
                  <LogOut size={16} /> Salida
                </button>
              )}
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tienes citas programadas.
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
