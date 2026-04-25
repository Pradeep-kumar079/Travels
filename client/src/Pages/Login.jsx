import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      return setError("Please fill in all fields.");
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/login",
        {
          username: loginData.username,
          password: loginData.password,
        }
      );
      if (rememberMe) {
        localStorage.setItem("username", loginData.username);
      }
      alert(res.data.message || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = loginData.username && loginData.password;

  return (
    <div className="lg-root">

      {/* Decorative background lines */}
      <div className="lg-lines">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="lg-line" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className="lg-card">

        {/* LEFT — Big typographic panel */}
        <div className="lg-left">
          <div className="lg-left-inner">

            <div className="lg-wordmark">
              <span className="lg-dot" />
              <span className="lg-brand">Wandr</span>
            </div>

            <div className="lg-hero-text">
              <p className="lg-eyebrow">Welcome back,</p>
              <h1 className="lg-display">
                The world<br />
                is waiting<br />
                <span className="lg-display-stroke">for you.</span>
              </h1>
            </div>

            <div className="lg-destinations">
              <p className="lg-dest-label">Trending right now</p>
              <div className="lg-dest-list">
                {["Kyoto", "Santorini", "Marrakech", "Reykjavik"].map((d, i) => (
                  <span key={d} className="lg-dest-tag" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative circle */}
            <div className="lg-circle-deco" />
          </div>
        </div>

        {/* RIGHT — Login form */}
        <div className="lg-right">
          <div className="lg-form-wrap">

            <div className="lg-form-header">
              <h2 className="lg-form-title">Sign in</h2>
              <p className="lg-form-sub">
                Don't have an account?{" "}
                <span className="lg-link" onClick={() => navigate("/register")}>
                  Create one
                </span>
              </p>
            </div>

            {error && (
              <div className="lg-error-bar">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="lg-form" noValidate>

              {/* Username */}
              <div className={`lg-field ${focusedField === "username" ? "lg-field--on" : ""}`}>
                <label className="lg-label">Username</label>
                <input
                  className="lg-input"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                  required
                />
                <span className="lg-underline" />
              </div>

              {/* Password */}
              <div className={`lg-field ${focusedField === "password" ? "lg-field--on" : ""}`}>
                <div className="lg-label-row">
                  <label className="lg-label">Password</label>
                  <span className="lg-forgot">Forgot password?</span>
                </div>
                <div className="lg-pass-wrap">
                  <input
                    className="lg-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lg-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <span className="lg-underline" />
              </div>

              {/* Remember me */}
              <div className="lg-remember">
                <div
                  className={`lg-toggle ${rememberMe ? "lg-toggle--on" : ""}`}
                  onClick={() => setRememberMe(!rememberMe)}
                  role="checkbox"
                  aria-checked={rememberMe}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === " " && setRememberMe(!rememberMe)}
                >
                  <div className="lg-toggle-thumb" />
                </div>
                <span className="lg-remember-label">Keep me signed in</span>
              </div>

              {/* Submit */}
              <button
                className={`lg-submit ${isFormValid ? "lg-submit--active" : ""}`}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="lg-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <FiArrowRight className="lg-arrow" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="lg-divider">
                <span />
                <p>or continue with</p>
                <span />
              </div>

              {/* Google */}
              <button type="button" className="lg-google">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;