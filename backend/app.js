
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import pool from "./src/config/db.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Employee Management API is Running");
});

// Employee routes
app.use("/api/employees", employeeRoutes);

// Start server after checking database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Neon PostgreSQL Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
