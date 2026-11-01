
import api from "@/lib/api";

// Get all employees
export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data.employees || [];
};

// Get single employee
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);

    console.log("Employee ID:", id);
    console.log("API Response:", response.data);

    // Supports both { employee: {...} } and direct employee responses
    return response.data?.employee ?? response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Create employee
export const createEmployee = async (data) => {
  const response = await api.post("/employees", data);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, data);
  return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};
