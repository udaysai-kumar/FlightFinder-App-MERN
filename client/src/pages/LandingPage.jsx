import React, { useEffect, useState, useContext } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [error, setError] = useState('');
  const [flights, setFlights] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const slideshowImages = [
    'https://blog-content.ixigo.com/wp-content/uploads/2015/07/shutterstock_139090601-770x430.jpg',
    'https://img.freepik.com/premium-photo/airplane-flying-tropical-island-with-sunset-background_664601-4767.jpg',
    'https://media.cntraveler.com/photos/635c4278f0baf4b80c23af8f/16:9/w_2560%2Cc_limit/Singapore_shawnanggg--S15r4VsQhY-unsplash.jpg',
    'https://s202.q4cdn.com/986123435/files/images/esg/2024/climate-change-hero-2000w.jpeg',
    'https://vacationtomaldives.com/wp-content/uploads/maldives-flights-768x433.jpg'
  ];

  const navigate = useNavigate();
  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') navigate('/admin');
    else if (userType === 'flight-operator') navigate('/flight-admin');
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const fetchFlights = async () => {
    const today = new Date();
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);

    if (checkBox) {
      if (departure && destination && departureDate && returnDate) {
        if (depDate > today && retDate > depDate) {
          setError('');
          try {
            const res = await axios.get('http://localhost:6001/fetch-flights');
            setFlights(res.data);
          } catch (err) {
            setError('Error fetching flight data');
          }
        } else setError('Please check the dates');
      } else setError('Please fill all the inputs');
    } else {
      if (departure && destination && departureDate) {
        if (depDate >= today) {
          setError('');
          try {
            const res = await axios.get('http://localhost:6001/fetch-flights');
            setFlights(res.data);
          } catch (err) {
            setError('Error fetching flight data');
          }
        } else setError('Please check the dates');
      } else setError('Please fill all the inputs');
    }
  };

  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
        navigate(`/book-flight/${id}`);
      } else if (destination === departure) {
        setTicketBookingDate(returnDate);
        navigate(`/book-flight/${id}`);
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <div
      className="landingPage"
    >
      <div className="slideshow">
        {slideshowImages.map((image, index) => (
          <div
            key={index}
            className={`slideshow-image ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>


      <div className="landingHero">
        <div className="landingHero-title">
          <h1>Navigating Your Air Travel Options!</h1>
          <p>Book extraordinary flight journeys to unforgettable destinations.</p>
        </div>

        <div className="Flight-search-container">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={(e) => setCheckBox(e.target.checked)}
              checked={checkBox}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Return journey
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <select className="form-select" value={departure} onChange={(e) => setDeparture(e.target.value)}>
              <option value="" disabled>Departure</option>
              {["Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore", "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata", "Varanasi", "Jaipur","New York","Paris","Sao Paulo","Abu Dhabi","Dubai",].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="" disabled>Destination</option>
              {["Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore", "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata", "Varanasi", "Jaipur","New York","Paris","Sao Paulo","Abu Dhabi","Dubai"].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <input
              type="date"
              className="form-control"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            {checkBox && (
              <input
                type="date"
                className="form-control"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            )}

            <button className="btn btn-light" onClick={fetchFlights}>
              Search
            </button>
          </div>

          {error && <p style={{ color: 'red',fontSize:'1.0rem' }}>{error}</p>}
        </div>

        {flights.length > 0 && (
          <div className="availableFlightsContainer">
            <h2>Available Flights</h2>
            <div className="Flights">
              {(checkBox
                ? flights.filter(f => (f.origin === departure && f.destination === destination) || (f.origin === destination && f.destination === departure))
                : flights.filter(f => f.origin === departure && f.destination === destination)
              ).map(flight => (
                <div className="Flight" key={flight._id}>
                  <div>
                    <p><b>{flight.flightName}</b></p>
                    <p><b>Flight Number:</b> {flight.flightId}</p>
                  </div>
                  <div>
                    <p><b>Start:</b> {flight.origin}</p>
                    <p><b>Departure Time:</b> {flight.departureTime}</p>
                  </div>
                  <div>
                    <p><b>Destination:</b> {flight.destination}</p>
                    <p><b>Arrival Time:</b> {flight.arrivalTime}</p>
                  </div>
                  <div>
                    <p><b>Starting Price:</b> ₹{flight.basePrice}</p>
                    <p><b>Available Seats:</b> {flight.totalSeats}</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleTicketBooking(flight._id, flight.origin, flight.destination)}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <section id="about" className="section-about p-4">
        <div className="container">
            <h2 className="section-title">About Us</h2>
            <p className="section-description">
                &nbsp; &nbsp;&nbsp; &nbsp; Welcome to our Flight ticket booking app, where we are dedicated to providing you with an exceptional travel experience from start to finish. Whether you're embarking on a daily commute, planning an exciting cross-country adventure, or seeking a leisurely scenic route, our app offers an extensive selection of Flight options to cater to your unique travel preferences.
            </p>
            <p className="section-description">
                &nbsp; &nbsp;&nbsp; &nbsp; We understand the importance of convenience and efficiency in your travel plans. Our user-friendly interface allows you to effortlessly browse through a wide range of Flight schedules, compare fares, and choose the most suitable seating options. With just a few taps, you can secure your Flight tickets and be one step closer to your desired destination. Our intuitive booking process enables you to customize your travel preferences, such as selecting specific departure times, opting for a window seat, or accommodating any special requirements.
            </p>

          <h5 style={{ textAlign: 'center' , fontSize : '1rem'}}>2025 ✈️ Flight Finder - &copy; All rights reserved</h5>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;
