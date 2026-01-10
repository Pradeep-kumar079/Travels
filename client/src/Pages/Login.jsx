import React, { useState } from "react";
import "./Register.css";
import bgImage from "../Assets/travel-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ correct

    if (!loginData.username.trim() || !loginData.password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      // ✅ FIX 1: use correct backend URL
      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/login",
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ FIX 2: safely read response
      const { message, role, username, token } = res.data;
      console.log("Login Response:", res.data);

      // ✅ FIX 3: store token (important)
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
      }

      if (!role) {
        alert("Access denied: unknown role");
        return;
      }

      // ✅ FIX 4: role-based navigation
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
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>

        <div className="username">
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            required
          />
        </div>

        <div className="password">
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
        </div>

        <div className="extra">
          <a href="/register">Don't have an account? Register</a>
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="button" className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="divider">
          <h2>OR</h2>
        </div>

        <button className="login-btn">Login with Google</button>
      </div>

      <div className="bgimg">
        <picture>
          <img src={bgImage} alt="Background" />
        </picture>
      </div>
    </div>
  );
};

export default Login;
