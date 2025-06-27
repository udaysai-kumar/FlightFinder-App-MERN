import React, { useEffect, useState } from 'react';
import '../styles/Bookings.css';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const cancelTicket = async (id) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${id}`);
      alert("Ticket cancelled!");
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
    }
  };

  return (
    <div className="user-bookingsPage">
      <h2 className="booking-heading">Your Bookings</h2>
      <div className="user-bookings">
        {bookings.filter(b => b.user === userId).map((booking) => (
          <div className="booking-card" key={booking._id}>
            <div className="ticket-header">
              <div className="flight-name">{booking.flightName}</div>
              <div className={`booking-status ${booking.bookingStatus}`}>
                {booking.bookingStatus}
              </div>
            </div>

            <div className="ticket-row">
              <div><strong>Flight ID:</strong> {booking.flightId}</div>
              <div><strong>Date:</strong> {booking.journeyDate.slice(0, 10)}</div>
            </div>

            <div className="ticket-row">
              <div><strong>From:</strong> {booking.departure}</div>
              <div><strong>To:</strong> {booking.destination}</div>
            </div>

            <div className="ticket-row">
              <div><strong>Time:</strong> {booking.journeyTime}</div>
              <div><strong>Total:</strong> ₹{booking.totalPrice}</div>
            </div>

            <div className="ticket-row">
              <div><strong>Seats:</strong> {booking.seats}</div>
              <div><strong>Booking Date:</strong> {booking.bookingDate.slice(0, 10)}</div>
            </div>

            <div className="ticket-row">
              <strong>Passengers:</strong>
              <ul className="passenger-list">
                {booking.passengers.map((p, i) => (
                  <li key={i}>{p.name} (Age: {p.age})</li>
                ))}
              </ul>
            </div>

            {booking.bookingStatus === 'confirmed' && (
              <button className="btn" onClick={() => cancelTicket(booking._id)}>
                Cancel Ticket
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
