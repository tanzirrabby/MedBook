import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/client.js';
import DoctorCard from '../components/DoctorCard.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [picked, setPicked] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  const fetchDoctors = async () => {
    const { data } = await api.get('/doctors', { params: { q: query } });
    setDoctors(data);
  };

  const fetchSlots = async (doctorId) => {
    const { data } = await api.get(`/doctors/${doctorId}/slots`, { params: { date: selectedDate } });
    setSlots(data.map((s) => ({ ...s, start: new Date(s.start).toISOString() })));
  };

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => {
    if (!selectedDoctor) return;
    fetchSlots(selectedDoctor._id);
    socket.connect();
    socket.emit('joinDoctorRoom', selectedDoctor._id);
    socket.on('slot:update', ({ slotStart, available }) => {
      setSlots((prev) => prev.map((s) => (s.start === new Date(slotStart).toISOString() ? { ...s, available } : s)));
    });
    return () => {
      socket.off('slot:update');
      socket.disconnect();
    };
  }, [selectedDoctor, selectedDate]);

  const book = async () => {
    if (!token) return setMessage('Please login to book appointment.');
    if (!picked || !selectedDoctor) return;
    try {
      await api.post('/appointments', { doctorId: selectedDoctor._id, slotStart: picked, reason: 'Consultation' });
      setMessage('Appointment booked.');
      fetchSlots(selectedDoctor._id);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <section className="card">
        <h2>Find doctors by specialty</h2>
        <div className="row">
          <input placeholder="Search specialty or doctor" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button onClick={fetchDoctors}>Search</button>
        </div>
      </section>

      <section className="grid">
        {doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} onSelect={setSelectedDoctor} />)}
      </section>

      {selectedDoctor && (
        <section className="card">
          <h3>Book with Dr. {selectedDoctor.name}</h3>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <SlotPicker slots={slots} onPick={setPicked} selected={picked} />
          <button onClick={book}>Book Appointment</button>
          {message && <p>{message}</p>}
        </section>
      )}
    </div>
  );
}
