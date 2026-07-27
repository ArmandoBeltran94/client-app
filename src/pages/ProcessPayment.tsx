import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, CheckCircle } from 'lucide-react';

interface AppointmentPending {
  id: number;
  appointmentDate: string;
  serviceName: string;
  therapistName: string;
  price: number;
  isPaid: boolean;
}

const ProcessPayment = () => {
  const [appointments, setAppointments] = useState<AppointmentPending[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnpaid = async () => {
      try {
        const response = await api.get('/appointments');
        const unpaid = response.data.filter((a: any) => a.status === 0);
        setAppointments(unpaid);
      } catch (error) {
        console.error("Error fetching unpaid appointments", error);
      }
    };
    fetchUnpaid();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const apt = appointments.find(a => a.id === Number(selectedAppointment));
    if (!apt) return;

    try {
      await api.post('/payments/process', {
        appointmentId: apt.id,
        amount: apt.price,
        paymentMethod
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert("Error procesando pago");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
        <h2>Pago Exitoso</h2>
        <p className="text-secondary">Tu pago ha sido procesado correctamente.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Redirigiendo al dashboard...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Procesar Pago</h2>
        <p className="text-secondary">Selecciona la cita a pagar y el método de pago</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Cita Pendiente de Pago</label>
          <select className="glass-input glass-select" value={selectedAppointment} onChange={e => setSelectedAppointment(e.target.value)} required>
            <option value="">Selecciona una cita</option>
            {appointments.filter(a => a.isPaid === false).map(a => (
              <option key={a.id} value={a.id}>
                {new Date(a.appointmentDate).toLocaleDateString()} - {new Date(a.appointmentDate).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })} - {a.serviceName} (${a.price})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Método de Pago</label>
          <select className="glass-input glass-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required>
            <option value="CreditCard">Tarjeta de Crédito</option>
            <option value="Cash">Efectivo</option>
            <option value="BankTransfer">Transferencia Bancaria</option>
          </select>
        </div>

        <button type="submit" className="glass-button" style={{ width: '100%', marginTop: '1rem' }} disabled={loading || !selectedAppointment}>
          <CreditCard size={18} /> {loading ? 'Procesando...' : 'Pagar Ahora'}
        </button>
      </form>
    </div>
  );
};

export default ProcessPayment;
