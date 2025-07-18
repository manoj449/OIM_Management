import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      const { token, role, username } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      // ✅ Redirect based on role
      if (role === "admin") navigate("/admin");
      else if (role === "branch_user") navigate("/orders");
      else if (role === "inventory_user") navigate("/inventory");
      else if (role === "supplier") navigate("/supplier");
      else if (role === "store_user") navigate("/store");
      else navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
