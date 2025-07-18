import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    supplier_name: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const branches = ["Main Branch", "City Branch", "Downtown Branch"];

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      alert("Failed to fetch inventory: " + err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch orders: " + (err.response?.data?.error || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item_name, quantity, supplier_name, price } = formData;

    if (!item_name || !quantity || !supplier_name || !price) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/inventory/${editingId}`,
          {
            item_name,
            quantity: parseInt(quantity),
            supplier_name,
            price: parseFloat(price),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("Item updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/inventory",
          {
            item_name,
            quantity: parseInt(quantity),
            supplier_name,
            price: parseFloat(price),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("Item added successfully!");
      }
      setFormData({ item_name: "", quantity: "", supplier_name: "", price: "" });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item: " + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (item) => {
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      supplier_name: item.supplier_name,
      price: item.price,
    });
    setEditingId(item.id);
  };

  const handleRequest = async (item) => {
    const quantity = prompt(`Enter quantity to request for ${item.item_name}:`);
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/inventory/request",
        {
          item_id: item.id,
          item_name: item.item_name,
          quantity: parseInt(quantity),
          branch: localStorage.getItem("branch"),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Request for ${quantity} units of ${item.item_name} submitted!`);
    } catch (err) {
      console.error("Error requesting item:", err);
      alert("Failed to request item: " + (err.response?.data?.error || err.message));
    }
  };

  const handleIssue = async (item) => {
    const quantity = prompt(`Enter quantity to issue for ${item.item_name}:`);
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (parseInt(quantity) > item.quantity) {
      alert(`Cannot issue ${quantity} units. Only ${item.quantity} available.`);
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/inventory/${item.id}`,
        {
          item_name: item.item_name,
          quantity: item.quantity - parseInt(quantity),
          supplier_name: item.supplier_name,
          price: item.price,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Issued ${quantity} units of ${item.item_name} successfully!`);
      fetchInventory();
    } catch (err) {
      console.error("Error issuing item:", err);
      alert("Failed to issue item: " + (err.response?.data?.error || err.message));
    }
  };

  const handleTransfer = async (item) => {
    const quantity = prompt(`Enter quantity to transfer for ${item.item_name}:`);
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (parseInt(quantity) > item.quantity) {
      alert(`Cannot transfer ${quantity} units. Only ${item.quantity} available.`);
      return;
    }
    const targetBranch = prompt(
      `Enter target branch (e.g., Main Branch, City Branch, Downtown Branch):`
    );
    if (!targetBranch || !branches.includes(targetBranch)) {
      alert("Please enter a valid branch.");
      return;
    }
    if (targetBranch === localStorage.getItem("branch")) {
      alert("Cannot transfer to the same branch.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/inventory/transfer",
        {
          item_id: item.id,
          item_name: item.item_name,
          quantity: parseInt(quantity),
          from_branch: localStorage.getItem("branch"),
          to_branch: targetBranch,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await axios.put(
        `http://localhost:5000/inventory/${item.id}`,
        {
          item_name: item.item_name,
          quantity: item.quantity - parseInt(quantity),
          supplier_name: item.supplier_name,
          price: item.price,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Transferred ${quantity} units of ${item.item_name} to ${targetBranch} successfully!`);
      fetchInventory();
    } catch (err) {
      console.error("Error transferring item:", err);
      alert("Failed to transfer item: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Order status updated!");
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, []);

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
        .inventory-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .inventory-form input {
          padding: 8px;
          width: 150px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .inventory-form button {
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .inventory-form button:hover {
          background-color: #0056b3;
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
        table button {
          margin: 0 5px;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        table button.edit {
          background-color: #ffc107;
          color: black;
        }
        table button.edit:hover {
          background-color: #e0a800;
        }
        table button.request {
          background-color: #17a2b8;
          color: white;
        }
        table button.request:hover {
          background-color: #138496;
        }
        table button.issue {
          background-color: #6c757d;
          color: white;
        }
        table button.issue:hover {
          background-color: #5a6268;
        }
        table button.transfer {
          background-color: #28a745;
          color: white;
        }
        table button.transfer:hover {
          background-color: #218838;
        }
        h2, h3 {
          color: #333;
        }
        .order-list {
          margin-top: 20px;
        }
        .order-list button.process {
          background-color: #28a745;
          color: white;
        }
        .order-list button.process:hover {
          background-color: #218838;
        }
      `
    ),
    React.createElement(
      "div",
      { className: "page-content" },
      React.createElement("h2", null, "Manage Inventory"),
      React.createElement(
        "div",
        { className: "inventory-form" },
        React.createElement("input", {
          type: "text",
          name: "item_name",
          placeholder: "Item Name",
          value: formData.item_name,
          onChange: handleInputChange,
        }),
        React.createElement("input", {
          type: "number",
          name: "quantity",
          placeholder: "Quantity",
          min: "0",
          value: formData.quantity,
          onChange: handleInputChange,
        }),
        React.createElement("input", {
          type: "text",
          name: "supplier_name",
          placeholder: "Supplier Name",
          value: formData.supplier_name,
          onChange: handleInputChange,
        }),
        React.createElement("input", {
          type: "number",
          name: "price",
          placeholder: "Price",
          min: "0",
          step: "0.01",
          value: formData.price,
          onChange: handleInputChange,
        }),
        React.createElement(
          "button",
          { onClick: handleSubmit },
          editingId ? "Update Item" : "Add Item"
        )
      ),
      React.createElement("h3", null, "📦 Inventory Items"),
      inventory.length === 0
        ? React.createElement("p", null, "No items in inventory.")
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
                React.createElement("th", null, "Item Name"),
                React.createElement("th", null, "Quantity"),
                React.createElement("th", null, "Supplier"),
                React.createElement("th", null, "Price"),
                React.createElement("th", null, "Actions")
              )
            ),
            React.createElement(
              "tbody",
              null,
              inventory.map((item) =>
                React.createElement(
                  "tr",
                  { key: item.id },
                  React.createElement("td", null, item.id),
                  React.createElement("td", null, item.item_name),
                  React.createElement("td", null, item.quantity),
                  React.createElement("td", null, item.supplier_name),
                  React.createElement("td", null, `₹${item.price}`),
                  React.createElement(
                    "td",
                    null,
                    React.createElement(
                      "button",
                      { className: "edit", onClick: () => handleEdit(item) },
                      "Edit"
                    ),
                    React.createElement(
                      "button",
                      { className: "request", onClick: () => handleRequest(item) },
                      "Request"
                    ),
                    React.createElement(
                      "button",
                      { className: "issue", onClick: () => handleIssue(item) },
                      "Issue"
                    ),
                    React.createElement(
                      "button",
                      { className: "transfer", onClick: () => handleTransfer(item) },
                      "Transfer"
                    )
                  )
                )
              )
            )
          ),
      React.createElement(
        "div",
        { className: "order-list" },
        React.createElement("h3", null, "Orders"),
        orders.length === 0
          ? React.createElement("p", null, "No orders found.")
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
                  React.createElement("th", null, "Customer Name"),
                  React.createElement("th", null, "Product Name"),
                  React.createElement("th", null, "Quantity"),
                  React.createElement("th", null, "Price"),
                  React.createElement("th", null, "Transaction ID"),
                  React.createElement("th", null, "Payment Method"),
                  React.createElement("th", null, "Status"),
                  React.createElement("th", null, "Action")
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
                    React.createElement("td", null, order.price),
                    React.createElement("td", null, order.transaction_id),
                    React.createElement("td", null, order.payment_method),
                    React.createElement("td", null, order.status || "Pending"),
                    React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "button",
                        { className: "process", onClick: () => handleUpdateStatus(order.id, "Processed") },
                        "Mark as Processed"
                      )
                    )
                  )
                )
              )
            )
      )
    )
  );
};

export default InventoryPage;