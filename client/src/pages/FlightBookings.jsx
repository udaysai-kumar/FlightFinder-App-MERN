import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/FlightBookings.css'; // Make sure to create or update this CSS file

const FlightBookings = () => {
  const [userDetails, setUserDetails] = useState();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:6001/fetch-user/${id}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

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
      alert('Ticket cancelled!');
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
    }
  };

  return (
    <div className="user-bookingsPage">
      {userDetails?.approval === 'not-approved' ? (
        <div className="notApproved-box">
          <h3>Approval Required!!</h3>
          <p>Your application is under processing. Kindly wait for administrator approval.</p>
        </div>
      ) : userDetails?.approval === 'approved' ? (
        <>
          <h2 className="booking-title">Your Bookings</h2>
          <div className="user-bookings">
            {bookings
              .filter((booking) => booking.flightName === localStorage.getItem('username'))
              .map((booking) => (
                <div className="user-booking" key={booking._id}>
                  <div className="booking-row">
                    <span><strong>Booking ID:</strong> {booking._id.slice(-6)}</span>
                    <span><strong>Status:</strong> {booking.bookingStatus}</span>
                  </div>
                  <div className="booking-row">
                    <span><strong>Flight:</strong> {booking.flightName}</span>
                    <span><strong>ID:</strong> {booking.flightId}</span>
                  </div>
                  <div className="booking-row">
                    <span><strong>From:</strong> {booking.departure}</span>
                    <span><strong>To:</strong> {booking.destination}</span>
                  </div>
                  <div className="booking-row">
                    <span><strong>Date:</strong> {booking.journeyDate.slice(0, 10)}</span>
                    <span><strong>Time:</strong> {booking.journeyTime}</span>
                  </div>
                  <div className="booking-row">
                    <span><strong>Seats:</strong> {booking.seats}</span>
                    <span><strong>Total:</strong> ₹{booking.totalPrice}</span>
                  </div>
                  <div className="booking-row">
                    <strong>Passengers:</strong>
                    <ul className="passenger-list">
                      {booking.passengers.map((p, i) => (
                        <li key={i}>{p.name} ({p.age})</li>
                      ))}
                    </ul>
                  </div>
                  {booking.bookingStatus === 'confirmed' && (
                    <button className="cancel-btn" onClick={() => cancelTicket(booking._id)}>
                      Cancel Ticket
                    </button>
                  )}
                </div>
              ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default FlightBookings;
