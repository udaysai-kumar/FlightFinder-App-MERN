import React from 'react';
import './SeatSelection.css';

const SeatSelection = ({ selectedSeats, setSelectedSeats }) => {
  const seatNumbers = Array.from({ length: 36 }, (_, i) => i + 1); // 6x6 grid

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="seat-container">
      {seatNumbers.map((seat) => (
        <div
          key={seat}
          className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
          onClick={() => toggleSeat(seat)}
        >
          {seat}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;
