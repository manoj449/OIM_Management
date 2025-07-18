const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "oim_db",
});

// ✅ Register
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ msg: "User registered" });
    }
  );
});

// ✅ Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ msg: "User not found" });

      const valid = await bcrypt.compare(password, results[0].password);
      if (!valid) return res.status(401).json({ msg: "Invalid password" });

      const token = jwt.sign(
        { id: results[0].id, username: results[0].username, role: results[0].role },
        "secretkey",
        { expiresIn: "1d" }
      );
      res.json({ token, user: { username: results[0].username, role: results[0].role } });
    }
  );
});

// ✅ Middleware to verify token (optional if needed)
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token" });

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// ✅ Inventory Routes (store-based)
app.get("/inventory", (req, res) => {
  db.query("SELECT * FROM inventory", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/inventory", (req, res) => {
  const { store, item_name, quantity } = req.body;
  if (!store || !item_name || !quantity)
    return res.status(400).json({ msg: "Missing fields" });

  db.query(
    "INSERT INTO inventory (store, item_name, quantity) VALUES (?, ?, ?)",
    [store, item_name, quantity],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, store, item_name, quantity });
    }
  );
});

app.put("/inventory/:id", (req, res) => {
  const { store, item_name, quantity } = req.body;
  if (!store || !item_name || !quantity)
    return res.status(400).json({ msg: "Missing fields" });

  db.query(
    "UPDATE inventory SET store=?, item_name=?, quantity=? WHERE id=?",
    [store, item_name, quantity, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Inventory updated" });
    }
  );
});

app.delete("/inventory/:id", (req, res) => {
  db.query("DELETE FROM inventory WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Inventory deleted" });
  });
});

// ✅ Store Routes
app.get("/stores", (req, res) => {
  db.query("SELECT * FROM stores", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/stores", (req, res) => {
  const { name, location } = req.body;
  if (!name || !location)
    return res.status(400).json({ msg: "Missing store fields" });

  db.query(
    "INSERT INTO stores (name, location) VALUES (?, ?)",
    [name, location],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId, name, location });
    }
  );
});

app.put("/stores/:id", (req, res) => {
  const { name, location } = req.body;
  if (!name || !location)
    return res.status(400).json({ msg: "Missing store fields" });

  db.query(
    "UPDATE stores SET name=?, location=? WHERE id=?",
    [name, location, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Store updated" });
    }
  );
});

app.delete("/stores/:id", (req, res) => {
  db.query("DELETE FROM stores WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Store deleted" });
  });
});

// ✅ Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
