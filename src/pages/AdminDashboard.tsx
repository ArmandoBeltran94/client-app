import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Activity, Calendar as CalendarIcon, DollarSign, Stethoscope } from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  totalTherapists: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  recentAppointments: {
    id: number;
    appointmentDate: string;
    patientName: string;
    therapistName: string;
    serviceName: string;
    status: number;
  }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div>Cargando estadísticas...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Panel de Administración</h2>
        <p className="text-secondary">Visión general del negocio y métricas clave.</p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Users size={24} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Pacientes</p>
              <h3>{stats.totalPatients}</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Stethoscope size={24} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Terapeutas</p>
              <h3>{stats.totalTherapists}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Activity size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Citas Pendientes</p>
              <h3>{stats.pendingAppointments}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <DollarSign size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Ingresos Totales</p>
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel card">
        <h3 style={{ marginBottom: '1rem' }}>Citas Recientes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Terapeuta</th>
                <th>Servicio</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patientName}</td>
                  <td>{apt.therapistName}</td>
                  <td>{apt.serviceName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarIcon size={14} style={{ color: 'var(--accent-primary)' }} />
                      {new Date(apt.appointmentDate).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${apt.status === 0 ? 'pending' : apt.status === 1 ? 'completed' : 'cancelled'}`}>
                      {apt.status === 0 ? 'Pendiente' : apt.status === 1 ? 'Completada' : 'Cancelada'}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay citas recientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
