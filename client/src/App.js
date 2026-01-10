import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import adminpage from "."
import Admin from "../src/Admins/Admin.jsx"
import SearchResults from "../src/Pages/SearchResults"
import AllUsers from "./Admins/AllUsers"
import AllBuses from "./Admins/AllBuses";
import SelectSeat from "./Pages/SelectSeat.jsx";
import PassengerDetails from "./Pages/PassengerDetails.jsx";
import Payment from "./Pages/Payment.jsx";
import PaymentSuccess from "./Pages/PaymentSuccess.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import AddOffers from "./Admins/AddOffers.jsx";
import Contact from "./Pages/Contact.jsx";
import Profile from "./Pages/Profile.jsx";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/admin/all-users" element={<AllUsers />} />
        <Route path="/admin/buses" element={<AllBuses />} />
        <Route path="/select-seat" element={<SelectSeat />} />
        <Route path="/passenger-details" element={<PassengerDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin/add-offers" element={<AddOffers />} />
       

      </Routes>
    </Router>
  );
};

export default App;
