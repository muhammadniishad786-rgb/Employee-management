
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getEmployees,
  deleteEmployee,
} from "@/services/employeeApi";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  RefreshCw,
} from "lucide-react";

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
      setError("Failed to load employees. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (!id) {
      alert("Employee ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(id);

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id)
      );
    } catch (err) {
      console.error("Delete Employee Error:", err);
      alert("Failed to delete employee");
    }
  };

  // Filter employees
  const departments = [
    "All",
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchValue) ||
      employee.email?.toLowerCase().includes(searchValue) ||
      employee.position?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      employee.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Employees
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor your employees.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchEmployees}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => router.push("/employees/add")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Count */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Employees
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {employees.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name, email or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department === "All"
                ? "All Departments"
                : department}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Employee Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-10 text-center">
            <Users
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-700">
              No employees found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your filters or add a new employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {employee.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {employee.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {employee.department || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {employee.position || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      ₹{Number(employee.salary || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            if (!employee.id) {
                              alert("Employee ID is missing");
                              return;
                            }

                            router.push(
                              `/employees/${employee.id}`
                            );
                          }}
                          title="Edit Employee"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(employee.id)
                          }
                          title="Delete Employee"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>
    </div>
  );
}
