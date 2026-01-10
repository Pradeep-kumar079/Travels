import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset, faTicket, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import logo from "../Assets/logo.png";
import posters from "../Assets/travel-back.jpg";
import { FaRightLeft } from "react-icons/fa6";
import Offers from "../Pages/Offers.jsx";
import Footer from "../Pages/Footer.jsx";

const Home = () => {
  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState({ from: "", to: "", date: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("https://travel-backend-83lh.onrender.com/");
        setMsg(response.data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);

  const LogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const MyBookings = () => {
    navigate("/my-bookings");
  };


const handleSearch = () => {
  if (!searchTerm.from || !searchTerm.to || !searchTerm.date) {
    alert("Please enter From, To and Date");
    return;
  }

  navigate("/search-results", {
    state: {
      from: searchTerm.from.trim().toLowerCase(),
      to: searchTerm.to.trim().toLowerCase(),
      travelDate: searchTerm.date
    }
  });
};


// const handleSearch = () => {
//   if (!searchTerm.from || !searchTerm.to || !searchTerm.date) {
//     alert("Please enter From, To and Date");
//     return;
//   }

//   navigate("/search-results", {
//     state: {
//       from: searchTerm.from.trim().toLowerCase(),
//       to: searchTerm.to.trim().toLowerCase(),
//       travelDate: searchTerm.date,
//     },
//   });
// };



  return (
    <div className="home-container">
      <p>{msg}</p>

      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="TravelF Logo" />
        </div>
        <div className="links">
          <div className="contact">
            <FontAwesomeIcon icon={faHeadset} />
            <Link to="/contact"><p>Contact Us</p></Link>
          </div>
          <div className="bookings" onClick={MyBookings}>
            <FontAwesomeIcon icon={faTicket} />
            <p>My Bookings</p>
          </div>
          <div className="account">
            <FontAwesomeIcon icon={faUser} />
            <Link to="/profile"><p>My Account</p></Link>
          </div>

          <div className="logout" onClick={LogOut}>
            <p>Log Out</p>
          </div>
        </div>
      </div>

      <div className="poster">
        <img src={posters} alt="Travel Poster" />
      </div>

      <div className="search">
        <h3>Search the bus</h3>
          <div className="searchcol">
              <div className="from">
                <input
                type="text"
                placeholder="From"
                value={searchTerm.from}
                onChange={(e) => setSearchTerm({ ...searchTerm, from: e.target.value })}
                />
              </div>

              <div className="exchange">
              <FaRightLeft />
              </div>

              <div className="to">
                <input
                type="text"
                placeholder="To"
                value={searchTerm.to}
                onChange={(e) => setSearchTerm({ ...searchTerm, to: e.target.value })}
                />
              </div>

              <div className="date">
                <input
                type="date"
                value={searchTerm.date}
                onChange={(e) => setSearchTerm({ ...searchTerm, date: e.target.value })}
                />
              </div>

          </div>
        <button onClick={handleSearch}>Search</button>
      </div>

    <Offers />

    <Footer />
      
    </div>
  );
};

export default Home;
