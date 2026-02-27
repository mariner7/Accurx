import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="profile-page">
        <div className="card">
          <h2>Mi Perfil</h2>
          <div style={{ marginTop: '16px' }}>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.role}</p>
            {user?.patientId && <p><strong>ID Paciente:</strong> {user.patientId}</p>}
            {user?.doctorId && <p><strong>ID Médico:</strong> {user.doctorId}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
