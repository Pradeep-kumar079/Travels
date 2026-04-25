import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEyeOff, FiEye, FiUser, FiPhone, FiLock, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

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
  const [strengthLabel, setStrengthLabel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
        setMessage(res.data.available ? "Username is available" : "Username already taken");
      } catch (error) {
        console.log(error);
      }
    };
    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [registerData.username]);

  useEffect(() => {
    setPhoneValid(registerData.phone_no.length === 10 || registerData.phone_no === "");
  }, [registerData.phone_no]);

  useEffect(() => {
    if (registerData.password && registerData.confirmPassword) {
      setPasswordMatch(registerData.password === registerData.confirmPassword);
    }
  }, [registerData.password, registerData.confirmPassword]);

  useEffect(() => {
    let strength = 0;
    const pwd = registerData.password;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    const s = Math.min(strength, 100);
    setPasswordStrength(s);
    if (s === 0) setStrengthLabel("");
    else if (s <= 30) setStrengthLabel("Weak");
    else if (s <= 60) setStrengthLabel("Fair");
    else if (s <= 85) setStrengthLabel("Good");
    else setStrengthLabel("Strong");
  }, [registerData.password]);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isAvailable) return alert("Username is already taken");
    if (!phoneValid) return alert("Phone number must be 10 digits");
    if (!passwordMatch) return alert("Passwords do not match");
    if (!agreeTerms) return alert("Please accept Terms & Conditions");
    try {
      setIsLoading(true);
      const res = await axios.post("https://travel-backend-83lh.onrender.com/register", {
        username: registerData.username,
        phone_no: registerData.phone_no,
        password: registerData.password,
      });
      alert(res.data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
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

  const strengthColor =
    passwordStrength <= 30 ? "#d45555" :
    passwordStrength <= 60 ? "#d4943a" :
    passwordStrength <= 85 ? "#c46c37" : "#4caf7d";

  return (
    <div className="rg-root">
      <div className="rg-card">

        {/* LEFT — Big typographic panel (matches Login) */}
        <div className="rg-panel-left">
          <div className="rg-left-inner">

            <div className="rg-wordmark">
              <span className="rg-dot" />
              <span className="rg-brand">Wandr</span>
            </div>

            <div className="rg-hero-text">
              <p className="rg-eyebrow">Join us today,</p>
              <h1 className="rg-display">
                Your next<br />
                adventure<br />
                <span className="rg-display-stroke">awaits you.</span>
              </h1>
            </div>

            <div className="rg-perks">
              <p className="rg-perk-label">Why travelers love us</p>
              {[
                { icon: "✦", text: "180+ countries & destinations" },
                { icon: "◈", text: "Smart AI-powered itineraries" },
                { icon: "◉", text: "2M+ happy travelers worldwide" },
              ].map((p, i) => (
                <div key={i} className="rg-perk" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
                  <span className="rg-perk-icon">{p.icon}</span>
                  <span className="rg-perk-text">{p.text}</span>
                </div>
              ))}
            </div>

            <div className="rg-circle-deco" />
          </div>
        </div>

        {/* RIGHT — Register form */}
        <div className="rg-panel-right">
          <div className="rg-form-wrap">

            <div className="rg-form-header">
              <h2 className="rg-form-title">Create account</h2>
              <p className="rg-form-sub">
                Already a traveler?{" "}
                <span className="rg-link" onClick={() => navigate("/login")}>
                  Sign in
                </span>
              </p>
            </div>

            <form onSubmit={handleRegister} className="rg-form" noValidate>

              {/* Username */}
              <div className={`rg-field ${focusedField === "username" ? "rg-field--focused" : ""}`}>
                <label className="rg-label">Username</label>
                <div className="rg-input-wrap">
                  <FiUser className="rg-icon-left" />
                  <input
                    className="rg-input"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {registerData.username && (
                    <span className="rg-status-icon">
                      {isAvailable === true && <FiCheckCircle className="rg-icon-ok" />}
                      {isAvailable === false && <FiXCircle className="rg-icon-err" />}
                    </span>
                  )}
                </div>
                <span className="rg-underline" />
                {message && (
                  <p className={`rg-hint ${isAvailable ? "rg-hint--ok" : "rg-hint--err"}`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className={`rg-field ${focusedField === "phone_no" ? "rg-field--focused" : ""}`}>
                <label className="rg-label">Phone number</label>
                <div className="rg-input-wrap">
                  <FiPhone className="rg-icon-left" />
                  <input
                    className="rg-input"
                    type="tel"
                    name="phone_no"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    value={registerData.phone_no}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone_no")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>
                <span className="rg-underline" />
                {!phoneValid && (
                  <p className="rg-hint rg-hint--err">Phone must be exactly 10 digits</p>
                )}
              </div>

              {/* Password */}
              <div className={`rg-field ${focusedField === "password" ? "rg-field--focused" : ""}`}>
                <label className="rg-label">Password</label>
                <div className="rg-input-wrap">
                  <FiLock className="rg-icon-left" />
                  <input
                    className="rg-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={registerData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <button
                    type="button"
                    className="rg-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <span className="rg-underline" />
                {registerData.password && (
                  <div className="rg-strength">
                    <div className="rg-strength-track">
                      <div
                        className="rg-strength-fill"
                        style={{ width: `${passwordStrength}%`, backgroundColor: strengthColor }}
                      />
                    </div>
                    <span className="rg-strength-label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`rg-field ${focusedField === "confirmPassword" ? "rg-field--focused" : ""}`}>
                <label className="rg-label">Confirm password</label>
                <div className="rg-input-wrap">
                  <FiLock className="rg-icon-left" />
                  <input
                    className="rg-input"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {registerData.confirmPassword && (
                    <span className="rg-status-icon">
                      {passwordMatch
                        ? <FiCheckCircle className="rg-icon-ok" />
                        : <FiXCircle className="rg-icon-err" />}
                    </span>
                  )}
                </div>
                <span className="rg-underline" />
                {registerData.confirmPassword && !passwordMatch && (
                  <p className="rg-hint rg-hint--err">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <div className="rg-terms" onClick={() => setAgreeTerms(!agreeTerms)}>
                <div className={`rg-checkbox ${agreeTerms ? "rg-checkbox--checked" : ""}`}>
                  {agreeTerms && <span className="rg-check-tick">✓</span>}
                </div>
                <span className="rg-terms-text">
                  I agree to the <span className="rg-link">Terms of Service</span> and{" "}
                  <span className="rg-link">Privacy Policy</span>
                </span>
              </div>

              {/* Submit */}
              <button
                className={`rg-submit ${isFormValid ? "rg-submit--active" : ""}`}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="rg-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <FiArrowRight />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;