export default function SlotPicker({ slots, onPick, selected }) {
  return (
    <div className="slots">
      {slots.map((slot) => (
        <button
          key={slot.start}
          disabled={!slot.available}
          className={selected === slot.start ? 'selected' : ''}
          onClick={() => onPick(slot.start)}
        >
          {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {!slot.available && ' (Booked)'}
        </button>
      ))}
    </div>
  );
}
