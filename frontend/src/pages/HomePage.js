import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Order Management System</h1>

      {loggedIn ? (
        <>
          <nav>
            <Link to="/orders">Order Management</Link>
            <Link to="/inventory">Inventory Management</Link>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      )}
    </div>
  );
}

export default HomePage;
