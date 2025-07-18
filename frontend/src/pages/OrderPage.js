import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const OrderPage = () => {
  const { cart, setCart } = useCart();
  const [customerName] = useState(localStorage.getItem("username") || "");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products: " + err.message);
    }
  };

  const addToCart = (product, quantity) => {
    if (!quantity || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} units of ${product.item_name} available.`);
      return;
    }
    setCart((prev) => [...prev, { ...product, quantity }]);
  };

  const placeOrder = async () => {
    if (!customerName || cart.length === 0) {
      alert("Please ensure you are logged in and have added items to the cart.");
      return;
    }

    for (const item of cart) {
      const inventoryItem = products.find((p) => p.id === item.id);
      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        alert(`Insufficient stock for ${item.item_name}. Available: ${inventoryItem?.quantity || 0}`);
        return;
      }
    }

    const orderData = {
      customer_name: customerName,
      cart: cart.map((item) => ({
        name: item.item_name,
        quantity: item.quantity,
        price: item.price,
      })),
      transaction_id: "TXN-" + Math.floor(Math.random() * 1000000),
      payment_method: paymentMethod,
    };

    try {
      const orderResponse = await axios.post("http://localhost:5000/orders", orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Order response:", orderResponse.data);

      for (const item of cart) {
        const inventoryItem = products.find((p) => p.id === item.id);
        if (!inventoryItem) {
          throw new Error(`Inventory item ${item.item_name} not found`);
        }
        const newQuantity = inventoryItem.quantity - item.quantity;
        if (newQuantity < 0) {
          throw new Error(`Negative quantity for ${item.item_name}`);
        }
        try {
          await axios.put(
            `http://localhost:5000/inventory/${item.id}`,
            {
              item_name: item.item_name,
              quantity: newQuantity,
              supplier_name: item.supplier_name,
              price: item.price,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
        } catch (err) {
          console.error(`Failed to update inventory for ${item.item_name}:`, err);
          alert(`Failed to update inventory for ${item.item_name}: ${err.response?.data?.error || err.message}`);
          return;
        }
      }

      alert("Order placed and inventory updated successfully!");
      setCart([]);
      fetchProducts();
    } catch (err) {
      console.error("Failed to place order:", err.response?.data || err.message);
      alert("Failed to place order: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        .products {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .product-card {
          border: 1px solid #ddd;
          padding: 10px;
          width: 200px;
          text-align: center;
          border-radius: 5px;
        }
        .place-order-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .place-order-btn:hover {
          background-color: #218838;
        }
        input, select {
          margin: 10px 0;
          padding: 8px;
          width: 200px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        input[readonly] {
          background-color: #f4f4f4;
          cursor: not-allowed;
        }
        h2, h3 {
          color: #333;
        }
        button {
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
      `
    ),
    React.createElement(
      "div",
      { className: "page-content" },
      React.createElement("h2", null, "Place Your Order"),
      React.createElement("input", {
        type: "text",
        placeholder: "Customer Name",
        value: customerName,
        readOnly: true,
      }),
      React.createElement(
        "select",
        {
          value: paymentMethod,
          onChange: (e) => setPaymentMethod(e.target.value),
        },
        React.createElement("option", { value: "UPI" }, "UPI"),
        React.createElement("option", { value: "Card" }, "Card"),
        React.createElement("option", { value: "Cash" }, "Cash")
      ),
      React.createElement("input", {
        type: "text",
        placeholder: "Search products...",
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
      }),
      React.createElement(
        "div",
        { className: "products" },
        filteredProducts.length === 0
          ? React.createElement("p", null, "No products found.")
          : filteredProducts.map((product) =>
              React.createElement(
                "div",
                { className: "product-card", key: product.id },
                React.createElement("h3", null, product.item_name),
                React.createElement("p", null, `₹${product.price}`),
                React.createElement("input", {
                  type: "number",
                  placeholder: "Qty",
                  min: "1",
                  onChange: (e) => (product.qty = parseInt(e.target.value)),
                }),
                React.createElement(
                  "button",
                  { onClick: () => addToCart(product, product.qty) },
                  "Add to Cart"
                )
              )
            )
      ),
      React.createElement("h3", null, "🛒 Cart"),
      cart.length === 0
        ? React.createElement("p", null, "No items added yet.")
        : React.createElement(
            "ul",
            null,
            cart.map((item, index) =>
              React.createElement(
                "li",
                { key: index },
                `${item.item_name} × ${item.quantity} = ₹${item.quantity * item.price}`
              )
            )
          ),
      cart.length > 0 &&
        React.createElement(
          "button",
          { className: "place-order-btn", onClick: placeOrder },
          "✅ Place Order"
        )
    )
  );
};

export default OrderPage;