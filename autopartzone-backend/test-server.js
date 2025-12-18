import express from "express";
import cors from "cors";

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get("/", (req, res) => {
  res.json({ message: "TEST SERVER WORKING", timestamp: new Date().toISOString() });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ message: "Auth login endpoint working", body: req.body });
});

app.post("/api/auth/register", (req, res) => {
  res.json({ message: "Auth register endpoint working", body: req.body });
});

app.post("/api/auth/register-admin", (req, res) => {
  const { adminKey } = req.body;
  if (adminKey === "admin") {
    res.json({ 
      message: "Admin registration working", 
      token: "test-token",
      user: { id: 1, name: req.body.name, email: req.body.email, role: "admin" }
    });
  } else {
    res.status(403).json({ message: "Invalid admin registration key" });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`TEST SERVER running on port ${PORT}`);
});