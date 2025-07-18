import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/users", form);
    setForm({ username: "", role: "" });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/users/${id}`, form);
    fetchUsers();
  };

  return (
    <div class="container">
      <h2>Admin Page - Manage Users</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username}
               onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="branch_user">Branch User</option>
          <option value="inventory_user">Inventory User</option>
          <option value="store_user">Store User</option>
          <option value="supplier">Supplier</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} - {u.role}
            <button onClick={() => setForm(u)}>Edit</button>
            <button onClick={() => handleUpdate(u.id)}>Update</button>
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
