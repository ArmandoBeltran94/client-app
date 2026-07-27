import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminServices from './pages/AdminServices';
import AdminTherapists from './pages/AdminTherapists';
import AdminUsers from './pages/AdminUsers';
import TherapistDashboard from './pages/TherapistDashboard';
import Profile from './pages/Profile';
import NewAppointment from './pages/NewAppointment';
import ProcessPayment from './pages/ProcessPayment';
import RequestAppointment from './pages/RequestAppointment';
import AdminRequests from './pages/AdminRequests';

import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, roles = [] }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles.length > 0 && user) {
    const hasRequiredRole = roles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.roles.includes('Admin')) return <Navigate to="/admin" />;
  if (user?.roles.includes('Therapist')) return <Navigate to="/therapist" />;
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="solicitar-cita" element={<RequestAppointment />} />
            <Route path="admin" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/services" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminServices />
              </ProtectedRoute>
            } />
            <Route path="admin/therapists" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminTherapists />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="admin/requests" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminRequests />
              </ProtectedRoute>
            } />
            <Route path="therapist" element={
              <ProtectedRoute roles={['Therapist']}>
                <TherapistDashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="appointments/new" element={
              <ProtectedRoute>
                <NewAppointment />
              </ProtectedRoute>
            } />
            <Route path="payments" element={
              <ProtectedRoute>
                <ProcessPayment />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
