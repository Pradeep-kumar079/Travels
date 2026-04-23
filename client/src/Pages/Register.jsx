import React, { useState, useEffect } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEyeOff } from "react-icons/fi";
import { FaEye, FaSpinner } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
  });

  const [isAvailable, setIsAvailable] = useState(null);
  const [message, setMessage] = useState("");
  const [phoneValid, setPhoneValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // username check
  useEffect(() => {
    const checkUsername = async () => {
      if (!registerData.username.trim()) {
        setIsAvailable(null);
        setMessage("");
        return;
      }

      try {
        const res = await axios.get(
          `https://travel-backend-83lh.onrender.com/check-username/${registerData.username}`
        );

        setIsAvailable(res.data.available);
        setMessage(
          res.data.available
            ? "✓ Username is available"
            : "✗ Username already taken"
        );
      } catch (error) {
        console.log(error);
      }
    };

    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [registerData.username]);

  // phone validation
  useEffect(() => {
    setPhoneValid(
      registerData.phone_no.length === 10 || registerData.phone_no === ""
    );
  }, [registerData.phone_no]);

  // password match
  useEffect(() => {
    if (
      registerData.password &&
      registerData.confirmPassword
    ) {
      setPasswordMatch(
        registerData.password === registerData.confirmPassword
      );
    }
  }, [registerData.password, registerData.confirmPassword]);

  // password strength
  useEffect(() => {
    let strength = 0;
    const pwd = registerData.password;

    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;

    setPasswordStrength(Math.min(strength, 100));
  }, [registerData.password]);

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      return alert("Username is already taken");
    }

    if (!phoneValid) {
      return alert("Phone number must be 10 digits");
    }

    if (!passwordMatch) {
      return alert("Passwords do not match");
    }

    if (!agreeTerms) {
      return alert("Please accept Terms & Conditions");
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/register",
        {
          username: registerData.username,
          phone_no: registerData.phone_no,
          password: registerData.password,
        }
      );

      alert(res.data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    isAvailable &&
    phoneValid &&
    passwordMatch &&
    registerData.username &&
    registerData.phone_no &&
    registerData.password &&
    registerData.confirmPassword &&
    agreeTerms;

  return (
    <div className="register-container">
      <div className="register-wrapper">

        {/* LEFT SIDE */}
        <div className="visual-section">
          <img src={bgImage} alt="travel" />

          <div className="overlay-content">
            <h1>Explore The World</h1>
            <p>
              Start your dream journey with us.
              Travel smarter. Travel better.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="form-section">
          <div className="form-box">

            <h2>Create Account</h2>
            <p className="subtitle">
              Join your next adventure today
            </p>

            <form onSubmit={handleRegister}>

              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={registerData.username}
                  onChange={handleChange}
                  required
                />
                {message && (
                  <small
                    className={
                      isAvailable ? "success" : "error"
                    }
                  >
                    {message}
                  </small>
                )}
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_no"
                  placeholder="Enter phone number"
                  maxLength="10"
                  value={registerData.phone_no}
                  onChange={handleChange}
                  required
                />
                {!phoneValid && (
                  <small className="error">
                    Phone must be 10 digits
                  </small>
                )}
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={registerData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>

                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                    }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {!passwordMatch && (
                  <small className="error">
                    Passwords do not match
                  </small>
                )}
              </div>

              <div className="terms">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) =>
                    setAgreeTerms(e.target.checked)
                  }
                />
                <span>
                  I agree to Terms & Conditions
                </span>
              </div>

              <button
                className="register-btn"
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="login-link">
                Already have an account?
                <span onClick={() => navigate("/login")}>
                  Login
                </span>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;