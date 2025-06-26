import React, { useContext, useEffect, useState } from 'react';
import '../styles/BookFlight.css';
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import PaymentForm from '../components/PaymentForm';

const BookFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticketBookingDate } = useContext(GeneralContext);

  // Flight Info
  const [flightName, setFlightName] = useState('');
  const [flightId, setFlightId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [StartCity, setStartCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [startTime, setStartTime] = useState();

  // User Inputs
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [coachType, setCoachType] = useState('');
  const [journeyDate, setJourneyDate] = useState(ticketBookingDate);
  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [passengerDetails, setPassengerDetails] = useState([]);

  // Seat selection and payment
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  // Price
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(`http://localhost:6001/fetch-flight/${id}`);
        setFlightName(response.data.flightName);
        setFlightId(response.data.flightId);
        setBasePrice(response.data.basePrice);
        setStartCity(response.data.origin);
        setDestinationCity(response.data.destination);
        setStartTime(response.data.departureTime);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };
    fetchFlightData();
  }, [id]);

  useEffect(() => {
    const seatClassPrice = {
      'economy': 1,
      'premium-economy': 2,
      'business': 3,
      'first-class': 4
    };
    if (coachType && basePrice && numberOfPassengers) {
      setTotalPrice(seatClassPrice[coachType] * basePrice * numberOfPassengers);
    } else {
      setTotalPrice(0);
    }
  }, [coachType, basePrice, numberOfPassengers]);

  const handlePassengerChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setNumberOfPassengers(value);
    setPassengerDetails(Array(value).fill({}));
  };

  const handlePassengerDetailsChange = (index, key, value) => {
    setPassengerDetails((prevDetails) => {
      const updated = [...prevDetails];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleBookingInitiation = () => {
    if (numberOfPassengers === 0) {
      alert("Please enter number of passengers");
      return;
    }
    if (!coachType) {
      alert("Please select seat class");
      return;
    }
    if (!email || !mobile) {
      alert("Please fill email and mobile");
      return;
    }
    if (selectedSeats.length !== numberOfPassengers) {
      alert("Please select seats equal to number of passengers");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    const inputs = {
      user: localStorage.getItem('userId'),
      flight: id,
      flightName,
      flightId,
      departure: StartCity,
      journeyTime: startTime,
      destination: destinationCity,
      email,
      mobile,
      passengers: passengerDetails.map((p, i) => ({
        ...p,
        seatNumber: selectedSeats[i]
      })),
      totalPrice,
      journeyDate,
      seatClass: coachType
    };

    try {
      await axios.post('http://localhost:6001/book-ticket', inputs);
      alert("🎉 Booking successful");
      navigate('/bookings');
    } catch (err) {
      alert("❌ Booking failed!");
      console.error(err);
    }
  };

  return (
    <div className='BookFlightPage'>
      <div className="BookingFlightPageContainer">
        <h2>Book Ticket</h2>
        <span>
          <p><b>Flight Name: </b> {flightName}</p>
          <p><b>Flight No: </b> {flightId}</p>
        </span>
        <span>
          <p><b>Base Price: </b> ₹{basePrice}</p>
        </span>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <label>Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile"
          />
          <label>Mobile</label>
        </div>

        <span className='span3'>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              value={numberOfPassengers}
              min="0"
              onChange={handlePassengerChange}
            />
            <label>No of Passengers</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />
            <label>Journey Date</label>
          </div>
          <div className="form-floating mb-3">
            <select
              className="form-select"
              value={coachType}
              onChange={(e) => setCoachType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first-class">First Class</option>
            </select>
            <label>Seat Class</label>
          </div>
        </span>

        <div className="new-passengers">
          {Array.from({ length: numberOfPassengers }).map((_, index) => (
            <div className='new-passenger' key={index}>
              <h4>Passenger {index + 1}</h4>
              <div className="new-passenger-inputs">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={passengerDetails[index]?.name || ''}
                    onChange={(e) => handlePassengerDetailsChange(index, 'name', e.target.value)}
                    placeholder="Name"
                  />
                  <label>Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control"
                    value={passengerDetails[index]?.age || ''}
                    onChange={(e) => handlePassengerDetailsChange(index, 'age', e.target.value)}
                    placeholder="Age"
                  />
                  <label>Age</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h5>Select Your Seats</h5>
        <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />

        <h6><b>Total Price</b>: ₹{totalPrice}</h6>

        {!showPayment ? (
          <button className='btn btn-primary' onClick={handleBookingInitiation}>Book Now</button>
        ) : (
          <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
        )}
      </div>
    </div>
  );
};

export default BookFlight;
