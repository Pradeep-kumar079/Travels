import React, { useState, useEffect } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEyeOff } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from 'react-icons/md';

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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedUsername, setCheckedUsername] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
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

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    const pwd = registerData.password;
    
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 10;
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [registerData.password]);

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
    if (!agreeTerms) {
      alert("Please agree to the Terms & Conditions.");
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
      navigate("/login");
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
                      registerData.password && registerData.confirmPassword &&
                      agreeTerms;

  const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) return "";
    if (strength < 40) return "Weak";
    if (strength < 70) return "Fair";
    return "Strong";
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength === 0) return "transparent";
    if (strength < 40) return "#ef4444";
    if (strength < 70) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Left Section - Image */}
        <div className="register-image">
          <picture>
            <img src={bgImage} alt="travel-background" />
          </picture>
          <div className="image-overlay"></div>
          <div className="floating-card card-1">
            <span className="icon">🌍</span>
            <p>Explore 195 Countries</p>
          </div>
          <div className="floating-card card-2">
            <span className="icon">✈️</span>
            <p>Book Flights & Hotels</p>
          </div>
          <div className="floating-card card-3">
            <span className="icon">🏖️</span>
            <p>Plan Adventures</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="register-form-section">
          <div className="form-container">
            {/* Header */}
            <div className="register-header">
              <div className="header-badge">NEW MEMBER</div>
              <h1>Create Your Account</h1>
              <p>Start your journey with us today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="register-form">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username">
                  <span>Username</span>
                  {isAvailable === true && <span className="status-badge available">Available</span>}
                  {isAvailable === false && <span className="status-badge taken">Taken</span>}
                </label>
                <div className="input-wrapper">
                  <input
                    id="username"
                    type="text"
                    placeholder="Choose your unique travel name"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                    className={`form-input ${
                      registerData.username && checkedUsername === registerData.username
                        ? isAvailable ? 'success' : 'error'
                        : ''
                    }`}
                    required
                  />
                  {registerData.username && checkedUsername === registerData.username && (
                    isAvailable ? 
                      <FaCheckCircle className="input-icon success" /> : 
                      <MdError className="input-icon error" />
                  )}
                </div>
                {message && (
                  <p className={`field-message ${isAvailable ? 'success' : 'error'}`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 Enter 10-digit number"
                    value={registerData.phone_no}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone_no: e.target.value })
                    }
                    maxLength="10"
                    className={`form-input ${registerData.phone_no && !phoneValid ? 'error' : ''}`}
                    required
                  />
                  {registerData.phone_no && phoneValid && registerData.phone_no.length === 10 && (
                    <FaCheckCircle className="input-icon success" />
                  )}
                </div>
                {registerData.phone_no && !phoneValid && (
                  <p className="field-message error">Must be exactly 10 digits</p>
                )}
              </div>

              {/* Password Field */}
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
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {registerData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength)
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{color: getPasswordStrengthColor(passwordStrength)}}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
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
                    className={`form-input ${
                      registerData.confirmPassword && !passwordMatch ? 'error' : registerData.confirmPassword && passwordMatch ? 'success' : ''
                    }`}
                    required
                  />
                  {registerData.confirmPassword && (
                    passwordMatch ? 
                      <FaCheckCircle className="input-icon success" /> : 
                      <MdError className="input-icon error" />
                  )}
                </div>
                {registerData.confirmPassword && !passwordMatch && (
                  <p className="field-message error">Passwords do not match</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="form-group terms-group">
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required 
                  />
                  <label htmlFor="terms">
                    I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!isFormValid || isLoading}
                className="btn-register"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" size={18} /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="form-divider">
                <span>Already a member?</span>
              </div>

              {/* Login Link */}
              <button 
                type="button" 
                className="btn-login" 
                onClick={() => navigate("/login")}
              >
                Sign In Instead
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;