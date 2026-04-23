import React, { useState, useEffect } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEyeOff } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

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
  const [focusedField, setFocusedField] = useState(null);
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

  return (
    <div className="register-container">
      {/* Animated Background Elements */}
      <div className="geometric-elements">
        <div className="geo-circle geo-1"></div>
        <div className="geo-circle geo-2"></div>
        <div className="geo-square geo-3"></div>
        <div className="geo-triangle geo-4"></div>
        <div className="geo-circle geo-5"></div>
      </div>

      <div className="register-wrapper">
        {/* Left Side - Visual Section */}
        <div className="visual-section">
          <div className="image-container">
            <picture>
              <img src={bgImage} alt="travel-background" />
            </picture>
            <div className="gradient-overlay"></div>
          </div>

          {/* Floating Badges */}
          <div className="floating-badge badge-1">
            <div className="badge-icon">🌏</div>
            <div className="badge-content">
              <div className="badge-title">Global</div>
              <div className="badge-desc">190+ Countries</div>
            </div>
          </div>

          <div className="floating-badge badge-2">
            <div className="badge-icon">✈️</div>
            <div className="badge-content">
              <div className="badge-title">Adventures</div>
              <div className="badge-desc">Await You</div>
            </div>
          </div>

          <div className="floating-badge badge-3">
            <div className="badge-icon">🗺️</div>
            <div className="badge-content">
              <div className="badge-title">Explore</div>
              <div className="badge-desc">Every Corner</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="form-section">
          <div className="form-content">
            {/* Decorative Header */}
            <div className="form-header">
              <div className="header-line line-1"></div>
              <div className="header-text">
                <h2>Begin Your</h2>
                <h1>Journey</h1>
                <p>Create an account and unlock the world</p>
              </div>
              <div className="header-line line-2"></div>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`step ${registerData.username && isAvailable ? 'completed' : ''}`}>1</div>
              <div className={`step ${registerData.phone_no && phoneValid ? 'completed' : ''}`}>2</div>
              <div className={`step ${registerData.password && passwordMatch ? 'completed' : ''}`}>3</div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="register-form">
              {/* Username Field */}
              <div className={`form-group ${focusedField === 'username' ? 'focused' : ''}`}>
                <div className="field-label">
                  <label htmlFor="username">Travel Name</label>
                  {isAvailable === true && <span className="tag available">✓ Available</span>}
                  {isAvailable === false && <span className="tag taken">✗ Taken</span>}
                </div>
                <div className="input-container">
                  <span className="field-icon">👤</span>
                  <input
                    id="username"
                    type="text"
                    placeholder="Your unique identity"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
                {message && (
                  <p className={`field-hint ${isAvailable ? 'success' : 'error'}`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}>
                <label htmlFor="phone">Phone Number</label>
                <div className="input-container">
                  <span className="field-icon">📱</span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={registerData.phone_no}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone_no: e.target.value })
                    }
                    maxLength="10"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
                {registerData.phone_no && !phoneValid && (
                  <p className="field-hint error">Must be 10 digits</p>
                )}
              </div>

              {/* Password Field */}
              <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <span className="field-icon">🔐</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                {registerData.password && (
                  <div className="strength-indicator">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: 
                            passwordStrength < 40 ? '#ef4444' :
                            passwordStrength < 70 ? '#f59e0b' : '#10b981'
                        }}
                      ></div>
                    </div>
                    <span className="strength-label">
                      {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className={`form-group ${focusedField === 'confirm' ? 'focused' : ''}`}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <span className="field-icon">✓</span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirmPassword: e.target.value })
                    }
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
                {registerData.confirmPassword && !passwordMatch && (
                  <p className="field-hint error">Passwords don't match</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="terms-section">
                <label className="checkbox-custom">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required 
                  />
                  <span className="checkbox-label">
                    I agree to <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!isFormValid || isLoading}
                className="btn-submit"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" /> Creating...
                  </>
                ) : (
                  <>
                    <span>Join Now</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="login-prompt">
                <p>Already exploring? 
                  <button 
                    type="button"
                    onClick={() => navigate("/login")}
                    className="login-link"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;