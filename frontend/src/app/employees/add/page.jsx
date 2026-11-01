
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/services/employeeApi";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function AddEmployee() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createEmployee({
        ...form,
        salary: Number(form.salary),
      });

      alert("Employee added successfully!");
      router.push("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "department", label: "Department", type: "text" },
    { name: "position", label: "Position", type: "text" },
    { name: "salary", label: "Salary", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 text-slate-600"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-7 flex items-center gap-3">
          <UserPlus className="text-blue-600" size={30} />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Add Employee
            </h1>
            <p className="text-sm text-slate-500">
              Enter employee details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  min={field.type === "number" ? "0" : undefined}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
