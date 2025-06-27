import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/AllBookings.css';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    fetchBookings();
    setDynamicBackground();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const cancelTicket = async (id) => {
    try {
      await axios.put(`http://localhost:6001/cancel-ticket/${id}`);
      alert("Ticket cancelled!");
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling ticket:', error);
    }
  };

  const setDynamicBackground = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setBackgroundImage("url('https://img.freepik.com/premium-photo/airplane-model-with-laptop-computer-wooden-table-composition-with-toy-plane-table-laptop-travel-planning-concept-globalization-business-processing-concept_96727-2359.jpg')");
    } else if (hour >= 12 && hour < 19) {
      setBackgroundImage("url('https://img.freepik.com/premium-photo/airplane-model-with-laptop-computer-wooden-table-composition-with-toy-plane-table-laptop-travel-planning-concept-globalization-business-processing-concept_96727-2359.jpg')");
    } else {
      setBackgroundImage("url('https://img.freepik.com/premium-photo/airplane-model-with-laptop-computer-wooden-table-composition-with-toy-plane-table-laptop-travel-planning-concept-globalization-business-processing-concept_96727-2359.jpg')");
    }
  };

  return (
    <div
      className="bookings-page"
      style={{ backgroundImage }}
    >
      <h2 className="bookings-title">All Bookings</h2>
      <div className="bookings-wrapper">
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>{booking.flightName}</h3>
              <p><b>From:</b> {booking.departure} → <b>To:</b> {booking.destination}</p>
              <p><b>Date:</b> {booking.journeyDate.slice(0, 10)}</p>
              <p><b>Time:</b> {booking.journeyTime}</p>
              <p><b>Passengers:</b> {booking.passengers.length}</p>
              <p><b>Seats:</b> {booking.seats}</p>
              <p><b>Total:</b> ₹{booking.totalPrice}</p>
              <p className={`status ${booking.bookingStatus}`}>
                <b>Status:</b> {booking.bookingStatus}
              </p>
              {booking.bookingStatus === 'confirmed' && (
                <button className="btn btn-danger" onClick={() => cancelTicket(booking._id)}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
