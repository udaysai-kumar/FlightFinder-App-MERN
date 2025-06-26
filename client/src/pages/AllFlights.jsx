import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AllFlights.css';

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();



  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-flights');
      setFlights(response.data);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="allFlightsPage">
      <h1>All Available Flights</h1>
      <div className="allFlights-wrapper">
        <div className="allFlights-grid">
          {flights.map((flight) => (
            <div className="allFlights-Flight" key={flight._id}>
             
              <h3>{flight.flightName}</h3>
              <p><b>Flight ID:</b> {flight.flightId}</p>
              <p><b>From:</b> {flight.origin} → <b>To:</b> {flight.destination}</p>
              <p><b>Departure:</b> {new Date(flight.departureTime).toLocaleString()}</p>
              <p><b>Arrival:</b> {new Date(flight.arrivalTime).toLocaleString()}</p>
              <p><b>Base Price:</b> ₹{flight.basePrice}</p>
              <p><b>Total Seats:</b> {flight.totalSeats}</p>
              <button className="btn" onClick={() => navigate(`/book-flight/${flight._id}`)}>Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFlights;
