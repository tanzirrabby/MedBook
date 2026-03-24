export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div className="card">
      <h3>Dr. {doctor.name}</h3>
      <p><strong>{doctor.specialty}</strong></p>
      <p>{doctor.bio}</p>
      <p>{doctor.experienceYears} years experience · ${doctor.consultationFee}</p>
      <button onClick={() => onSelect(doctor)}>View Slots</button>
    </div>
  );
}
