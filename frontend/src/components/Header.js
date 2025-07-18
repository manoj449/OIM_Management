import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("branch");
    navigate("/login");
  };

  return React.createElement(
    "div",
    null,
    React.createElement(
      "style",
      null,
      `
        .header {
          background-color: #232f3e;
          color: white;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-title-container {
          display: flex;
          align-items: center;
        }
        .hamburger-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          margin-right: 15px;
        }
        .header-title {
          margin: 0;
          font-size: 20px;
        }
        .header-nav {
          display: flex;
          align-items: center;
        }
        .header-nav a {
          margin: 0 10px;
          color: white;
          text-decoration: none;
        }
        .header-nav a:hover {
          text-decoration: underline;
        }
        .username {
          margin: 0 10px;
          color: #ddd;
        }
        .logout-btn {
          background-color: #e74c3c;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background-color: #c0392b;
        }
      `
    ),
    React.createElement(
      "header",
      { className: "header" },
      React.createElement(
        "div",
        { className: "header-title-container" },
        React.createElement(
          "button",
          {
            className: "hamburger-btn",
            onClick: toggleSidebar,
          },
          "☰"
        ),
        React.createElement(
          "h1",
          { className: "header-title" },
          "Bank Order & Inventory Management System"
        )
      ),
      React.createElement(
        "nav",
        { className: "header-nav" },
        React.createElement("a", { href: "/dashboard" }, "Home"),
        React.createElement("a", { href: "/orders" }, "Orders"),
        React.createElement("a", { href: "/orderslistpage" }, "Orders List"),
        React.createElement("a", { href: "/inventory" }, "Inventory"),
        React.createElement("a", { href: "/cart" }, `🛒 Cart (${totalItems})`),
        isLoggedIn &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "span",
              { className: "username" },
              `👤 ${username || "User"}`
            ),
            React.createElement(
              "button",
              {
                className: "logout-btn",
                onClick: handleLogout,
              },
              "Logout"
            )
          )
      )
    )
  );
};

export default Header;