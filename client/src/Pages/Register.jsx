import React, { useState, useEffect } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { FaCheckCircle } from 'react-icons/fa';
import { Eye, EyeOff, FaCheckCircle,  Loader } from "react-icons/fa";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    phone_no: "",
    password: "",
    confirmPassword: ""
  });
  const [isAvailable, setIsAvailable] = useState(null);
  const [message, setMessage] = useState("");
  const [phoneValid, setPhoneValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedUsername, setCheckedUsername] = useState("");
  const navigate = useNavigate();

  // Check username availability with debounce
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
        setCheckedUsername(registerData.username);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    };

    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [registerData.username]);

  // Show availability message
  useEffect(() => {
    if (isAvailable === true) setMessage("✓ Username is available");
    else if (isAvailable === false) setMessage("✗ Username is taken");
    else setMessage("");
  }, [isAvailable]);

  // Phone validation
  useEffect(() => {
    setPhoneValid(registerData.phone_no.toString().length === 10 || registerData.phone_no === "");
  }, [registerData.phone_no]);

  // Password match validation
  useEffect(() => {
    if (registerData.password && registerData.confirmPassword) {
      setPasswordMatch(registerData.password === registerData.confirmPassword);
    }
  }, [registerData.password, registerData.confirmPassword]);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isAvailable) {
      alert("Username is already taken.");
      setIsLoading(false);
      return;
    }
    if (!phoneValid) {
      alert("Phone number must be 10 digits.");
      setIsLoading(false);
      return;
    }
    if (!passwordMatch) {
      alert("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/register",
        {
          username: registerData.username,
          phone_no: registerData.phone_no,
          password: registerData.password
        }
      );
      alert(res.data.message || "Registration successful");
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = isAvailable && phoneValid && passwordMatch && 
                      registerData.username && registerData.phone_no && 
                      registerData.password && registerData.confirmPassword;

  return (
    <div className="register-container">
      <div className="bgimg">
        <picture>
          <img src={bgImage} alt="travel-background" />
        </picture>
        <div className="overlay-accent"></div>
      </div>

      <div className="details">
        <div className="header">
          <span className="globe-icon">✈️</span>
          <h1>Explore the World</h1>
          <p>Join us for your next adventure</p>
        </div>

        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                placeholder="Choose your travel name"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                required
              />
              {registerData.username && checkedUsername === registerData.username && (
                isAvailable ? 
                  <FaCheckCircle className="status-icon available" /> : 
                  <FaCheckCircle className="status-icon taken" />
              )}
            </div>
            {message && (
              <p className={`status-message ${isAvailable ? 'available' : 'taken'}`}>
                {message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="10-digit phone number"
              value={registerData.phone_no}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone_no: e.target.value })
              }
              maxLength="10"
              required
            />
            {registerData.phone_no && !phoneValid && (
              <p className="error-message">Enter a valid 10-digit number</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                required
              />
              {registerData.confirmPassword && !passwordMatch && (
                <XCircle className="status-icon taken" />
              )}
              {registerData.confirmPassword && passwordMatch && (
                <FaCheckCircle className="status-icon available" />
              )}
            </div>
            {registerData.confirmPassword && !passwordMatch && (
              <p className="error-message">Passwords do not match</p>
            )}
          </div>

          <div className="form-group terms-group">
            <div className="checkbox-wrapper">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the Terms & Conditions and Privacy Policy</label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid || isLoading}
            className="btn-register"
          >
            {isLoading ? (
              <>
                <Loader className="spinner" size={18} /> Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            className="btn-login" 
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;