
import pool from "../config/db.js";

// Validate PostgreSQL employee ID
const isValidId = (id) => {
  return /^\d+$/.test(id) && Number(id) > 0;
};

// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      position,
      salary,
      status,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO employees
       (name, email, phone, department, position, salary, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        email,
        phone || null,
        department || null,
        position || null,
        salary ?? 0,
        status || "Active",
      ]
    );

    return res.status(201).json({
      message: "Employee created successfully",
      employee: result.rows[0],
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create employee",
    });
  }
};

// GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY created_at DESC"
    );

    return res.status(200).json({
      count: result.rows.length,
      employees: result.rows,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    return res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

// GET SINGLE EMPLOYEE
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      employee: result.rows[0],
    });
  } catch (error) {
    console.error("Get Employee Error:", error);

    return res.status(500).json({
      message: "Failed to fetch employee",
    });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    const {
      name,
      email,
      phone,
      department,
      position,
      salary,
      status,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const result = await pool.query(
      `UPDATE employees
       SET name = $1,
           email = $2,
           phone = $3,
           department = $4,
           position = $5,
           salary = $6,
           status = $7
       WHERE id = $8
       RETURNING *`,
      [
        name,
        email,
        phone || null,
        department || null,
        position || null,
        salary ?? 0,
        status || "Active",
        Number(id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employee: result.rows[0],
    });
  } catch (error) {
    console.error("Update Employee Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update employee",
    });
  }
};

// DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);

    return res.status(500).json({
      message: "Failed to delete employee",
    });
  }
};
