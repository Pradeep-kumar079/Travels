import React, { useState, useEffect } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    phone_no: "",
    password: ""
  });
  const [isAvailable, setIsAvailable] = useState(null);
  const [message, setMessage] = useState("");
  const [phoneValid, setPhoneValid] = useState(true);
  const navigate = useNavigate();

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (registerData.username.trim() === "") {
        setIsAvailable(null);
        return;
      }
      try {
        const res = await axios.get(
          `https://travel-backend-83lh.onrender.com/check-username/${registerData.username}`
        );
        setIsAvailable(res.data.available);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    };

    const timeout = setTimeout(checkUsername, 500); // debounce
    return () => clearTimeout(timeout);
  }, [registerData.username]);

  // Show availability message
  useEffect(() => {
    if (isAvailable === true) setMessage("Username is available");
    else if (isAvailable === false) setMessage("Username is taken");
    else setMessage("");
  }, [isAvailable]);

  // Phone validation
  useEffect(() => {
    if (registerData.phone_no.toString().length === 10) {
      setPhoneValid(true);
    } else {
      setPhoneValid(false);
    }
  }, [registerData.phone_no]);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      alert("Username is already taken.");
      return;
    }
    if (!phoneValid) {
      alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/register",
        registerData
      );
      alert(res.data.message || "Registration successful");
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="bgimg">
        <picture>
          <img src={bgImage} alt="Background" />
        </picture>
      </div>

      <div className="details">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="name">
            <div className="username">
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                required
              />
            </div>
            <p className="available">{message}</p>
          </div>

          <div className="phone">
            <input
              type="number"
              placeholder="Phone Number"
              value={registerData.phone_no}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone_no: e.target.value })
              }
              required
            />
            {!phoneValid && <p className="error">Phone number must be 10 digits</p>}
          </div>

          <div className="password">
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="privacy">
            <div className="box">
              <input type="checkbox" required />
            </div>
            <div className="msg">
              <p>I agree to the Terms and Conditions</p>
            </div>
          </div>

          <button type="submit" disabled={!isAvailable || !phoneValid}>
            Register
          </button>

          <h2>OR</h2>

          <button type="button" className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
