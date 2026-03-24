import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/appointments/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>Patient Medical History Dashboard</h2>
      <div className="grid stats">
        <div className="card"><h3>{data.stats.totalAppointments}</h3><p>Total Appointments</p></div>
        <div className="card"><h3>{data.stats.upcoming}</h3><p>Upcoming</p></div>
        <div className="card"><h3>{data.stats.completed}</h3><p>Completed</p></div>
      </div>
      <section className="card">
        <h3>Recent Appointments</h3>
        {data.recentAppointments.map((a) => (
          <p key={a._id}>
            {new Date(a.slotStart).toLocaleString()} · Dr. {a.doctorId?.name} · {a.doctorId?.specialty} · {a.status}
          </p>
        ))}
      </section>
    </div>
  );
}
