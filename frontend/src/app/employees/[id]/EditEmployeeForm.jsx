
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getEmployeeById,
  updateEmployee,
} from "@/services/employeeApi";
import { ArrowLeft, Save } from "lucide-react";

export default function EditEmployeeForm() {
  const params = useParams();
  const router = useRouter();

  // Get employee ID from URL
  const id = params?.id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch employee details
  useEffect(() => {
    let isMounted = true;

    const fetchEmployee = async () => {
      console.log("Current URL:", window.location.pathname);
      console.log("Route Params:", params);
      console.log("Employee ID:", id);

      if (
        !id ||
        id === "undefined" ||
        !/^\d+$/.test(String(id))
      ) {
        setError("Invalid employee ID. Please return to dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const employee = await getEmployeeById(id);

        if (!employee || !employee.id) {
          throw new Error("Employee not found");
        }

        if (!isMounted) return;

        setForm({
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          department: employee.department || "",
          position: employee.position || "",
          salary: employee.salary ?? "",
          status: employee.status || "Active",
        });
      } catch (err) {
        console.error("Fetch Employee Error:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load employee"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEmployee();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !id ||
      id === "undefined" ||
      !/^\d+$/.test(String(id))
    ) {
      setError("Invalid employee ID");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateEmployee(id, {
        ...form,
        salary: Number(form.salary),
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Update Employee Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <p className="text-slate-600">
          Loading employee...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="mb-6 text-2xl font-bold">
          Edit Employee
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2"
        >
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["department", "Department"],
            ["position", "Position"],
            ["salary", "Salary"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {label}
              </label>

              <input
                name={name}
                type={
                  name === "salary"
                    ? "number"
                    : name === "email"
                    ? "email"
                    : "text"
                }
                value={form[name]}
                onChange={handleChange}
                required
                min={name === "salary" ? "0" : undefined}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
