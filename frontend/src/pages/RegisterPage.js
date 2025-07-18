import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      alert(res.data.msg);
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <select name="role" onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="branch_user">Branch User</option>
        <option value="inventory_user">Inventory User</option>
        <option value="supplier">Supplier</option>
        <option value="store_user">Store User</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
