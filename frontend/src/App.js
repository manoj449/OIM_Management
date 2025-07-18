// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

import OrderPage from "./pages/OrderPage";
import InventoryPage from "./pages/InventoryPage";
import SupplierPage from "./pages/SupplierPage";
import StorePage from "./pages/StorePage";
import AdminPage from "./pages/AdminPage";
// App.js
import './App.css';

function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRole(res.data.role);
          setUser(res.data.username);
        })
        .catch(() => {
          setRole(null);
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", backgroundColor: "#eee" }}>
        {user ? (
          <>
            {role === "admin" || role === "branch_user" ? (
              <Link to="/order" style={{ marginRight: "10px" }}>Order</Link>
            ) : null}
            {role === "admin" || role === "inventory_user" ? (
              <Link to="/inventory" style={{ marginRight: "10px" }}>Inventory</Link>
            ) : null}
            {role === "admin" || role === "supplier" ? (
              <Link to="/supplier" style={{ marginRight: "10px" }}>Supplier</Link>
            ) : null}
            {role === "admin" || role === "store_user" ? (
              <Link to="/store" style={{ marginRight: "10px" }}>Store</Link>
            ) : null}
            {role === "admin" && (
              <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login setRole={setRole} setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/order"
          element={
            <ProtectedRoute role={role} allowed={["admin", "branch_user"]}>
              <OrderPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute role={role} allowed={["admin", "inventory_user"]}>
              <InventoryPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute role={role} allowed={["admin", "supplier"]}>
              <SupplierPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute role={role} allowed={["admin", "store_user"]}>
              <StorePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} allowed={["admin"]}>
              <AdminPage user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
