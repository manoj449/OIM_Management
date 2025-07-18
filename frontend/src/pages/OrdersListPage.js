import React, { useState, useEffect } from "react";
import axios from "axios";

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("username") || "";

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders", {
        params: { customer_name: username },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch orders: " + err.message);
    }
  };

  useEffect(() => {
    if (username) {
      fetchOrders();
    } else {
      alert("Please log in to view your orders.");
    }
  }, [fetchOrders, username]);

  return React.createElement(
    "div",
    null,
    React.createElement(
      "style",
      null,
      `
        .page-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
      `
    ),
    React.createElement(
      "div",
      { className: "page-content" },
      React.createElement("h2", null, "📋 Your Orders"),
      orders.length === 0
        ? React.createElement("p", null, "No orders placed yet.")
        : React.createElement(
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("th", null, "ID"),
                React.createElement("th", null, "Customer"),
                React.createElement("th", null, "Product"),
                React.createElement("th", null, "Qty"),
                React.createElement("th", null, "Price"),
                React.createElement("th", null, "Txn ID"),
                React.createElement("th", null, "Payment"),
                React.createElement("th", null, "Status")
              )
            ),
            React.createElement(
              "tbody",
              null,
              orders.map((order) =>
                React.createElement(
                  "tr",
                  { key: order.id },
                  React.createElement("td", null, order.id),
                  React.createElement("td", null, order.customer_name),
                  React.createElement("td", null, order.product_name),
                  React.createElement("td", null, order.quantity),
                  React.createElement("td", null, `₹${order.price}`),
                  React.createElement("td", null, order.transaction_id),
                  React.createElement("td", null, order.payment_method),
                  React.createElement("td", null, order.status)
                )
              )
            )
          )
    )
  );
};

export default OrdersListPage;