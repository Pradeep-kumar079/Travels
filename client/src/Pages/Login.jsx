import React, { useState } from "react";
import "./Login.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEyeOff } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.username.trim() || !loginData.password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/login",
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { message, role, username, token } = res.data;
      console.log("Login Response:", res.data);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
      }

      if (!role) {
        alert("Access denied: unknown role");
        setIsLoading(false);
        return;
      }

      if (role.toLowerCase() === "admin") {
        alert("Admin login successful");
        navigate("/admin");
      } else if (role.toLowerCase() === "user") {
        alert("User login successful");
        navigate("/home");
      } else {
        alert(`Access denied: unknown role (${role})`);
      }

    } catch (err) {
      console.error("Error during login:", err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login feature coming soon!");
  };

  return (
    <div className="login-container">
      <div className="bgimg">
        <picture>
          <img src={bgImage} alt="travel-background" />
        </picture>
        <div className="overlay-accent"></div>
      </div>

      <div className="login-section">
        <div className="login-wrapper">
          <div className="login-header">
            <span className="header-icon">✈️</span>
            <h1>Welcome Back</h1>
            <p>Continue your travel journey with us</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" size={18} /> Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button 
              type="button" 
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FaGoogle size={18} /> Continue with Google
            </button>

            <div className="login-footer">
              <span>Don't have an account? </span>
              <button 
                type="button"
                className="signup-link"
                onClick={() => navigate("/register")}
              >
                Create one now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;