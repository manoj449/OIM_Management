import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const userRole = localStorage.getItem("userRole");

  return React.createElement(
    "div",
    { className: "dashboard-container" },
    React.createElement(
      "style",
      null,
      `
        .dashboard-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .main-content {
          text-align: center;
        }
        .main-content h1 {
          color: #333;
          margin-bottom: 20px;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }
        .card {
          flex: 1;
          min-width: 150px;
          padding: 20px;
          border-radius: 5px;
          color: white;
          text-align: center;
        }
        .card.blue {
          background-color: #007bff;
        }
        .card.orange {
          background-color: #ff8c00;
        }
        .card.purple {
          background-color: #6f42c1;
        }
        .card.green {
          background-color: #28a745;
        }
        .card h3 {
          margin: 0 0 10px;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .nav-links {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        .nav-links a {
          color: #007bff;
          text-decoration: none;
          font-size: 16px;
        }
        .nav-links a:hover {
          text-decoration: underline;
        }
      `
    ),
    React.createElement(
      "main",
      { className: "main-content" },
      React.createElement("h1", null, "Welcome to Order & Inventory Management"),
      React.createElement(
        "div",
        { className: "stats" },
        React.createElement(
          "div",
          { className: "card blue" },
          React.createElement("h3", null, "Total Sales"),
          React.createElement("p", null, "$11,500")
        ),
        React.createElement(
          "div",
          { className: "card orange" },
          React.createElement("h3", null, "Total Orders"),
          React.createElement("p", null, "420")
        ),
        React.createElement(
          "div",
          { className: "card purple" },
          React.createElement("h3", null, "Total Revenue"),
          React.createElement("p", null, "$2,200")
        ),
        React.createElement(
          "div",
          { className: "card green" },
          React.createElement("h3", null, "Visitors"),
          React.createElement("p", null, "4,320")
        )
      ),
      React.createElement(
        "div",
        { className: "nav-links" },
        userRole === "Order User" || userRole === "Admin"
          ? React.createElement(Link, { to: "/orders" }, "Go to Orders")
          : null,
        userRole === "Inventory User" || userRole === "Admin"
          ? React.createElement(Link, { to: "/inventory" }, "Go to Inventory")
          : null
      )
    )
  );
};

export default Dashboard;