
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  getEmployees,
  deleteEmployee,
} from "@/services/employeeApi";

import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  BriefcaseBusiness,
  X,
  UsersRound,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Refresh when returning to dashboard
  useEffect(() => {
    const handleFocus = () => fetchEmployees();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchEmployees]);

  // Delete employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteEmployee(id);

      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete employee."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Unique departments
  const departments = useMemo(
    () =>
      [
        ...new Set(
          employees.map((emp) => emp.department).filter(Boolean)
        ),
      ].sort(),
    [employees]
  );

  // Search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        emp.name?.toLowerCase().includes(searchText) ||
        emp.email?.toLowerCase().includes(searchText) ||
        emp.department?.toLowerCase().includes(searchText) ||
        emp.position?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || emp.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        emp.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, search, statusFilter, departmentFilter]);

  // Statistics
  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "All registered employees",
    },
    {
      title: "Active Employees",
      value: employees.filter((e) => e.status === "Active").length,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Currently active",
    },
    {
      title: "Inactive Employees",
      value: employees.filter((e) => e.status === "Inactive").length,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      description: "Currently inactive",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      description: "Available departments",
    },
  ];

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  const hasFilters =
    search !== "" ||
    statusFilter !== "All" ||
    departmentFilter !== "All";

  return (
    <main className="dashboard-bg min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center dashboard-enter">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <BriefcaseBusiness size={16} />
              Employee Management System
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your workforce, employees and departments.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => router.push("/employees")}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                style={{ animationDelay: `${index * 100}ms` }}
                className="stat-card rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <div className={`rounded-xl p-3 ${item.iconBg}`}>
                    <Icon size={22} className={item.iconColor} />
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Employee Management */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dashboard-enter">

          {/* Section Header */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Employee Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all your employees.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <UsersRound size={17} />
                {filteredEmployees.length} employees
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative md:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="All">All Departments</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw
                size={30}
                className="animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading employees...
              </p>
            </div>
          ) : error ? (
            /* Error */
            <div className="px-5 py-16 text-center">
              <p className="mb-4 text-sm text-red-500">{error}</p>

              <button
                onClick={fetchEmployees}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="rounded-2xl bg-slate-100 p-5">
                <Users size={32} className="text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                {employees.length === 0
                  ? "No employees yet"
                  : "No employees found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {employees.length === 0
                  ? "Start building your team by adding your first employee."
                  : "Try changing your search or filter options."}
              </p>

              {employees.length === 0 ? (
                <button
                  onClick={() => router.push("/employees")}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add First Employee
                </button>
              ) : (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp, index) => (
                      <tr
                        key={emp.id}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className="employee-row text-sm transition duration-200 hover:bg-blue-50/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                              {emp.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {emp.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {emp.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {emp.department || "-"}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {emp.position || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              emp.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                emp.status === "Active"
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {emp.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                router.push(`/employees/${emp.id}`)
                              }
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                              title="Edit employee"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(emp.id)}
                              disabled={deletingId === emp.id}
                              className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50"
                              title="Delete employee"
                            >
                              {deletingId === emp.id ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and Tablet Cards */}
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
                {filteredEmployees.map((emp, index) => (
                  <div
                    key={emp.id}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="employee-row rounded-xl border border-slate-200 p-4 transition duration-300 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                          {emp.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-800">
                            {emp.name}
                          </h3>

                          <p className="truncate text-xs text-slate-500">
                            {emp.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>

                    <div className="my-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
                      <div>
                        <p className="text-xs text-slate-400">
                          Department
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {emp.department || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Position
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {emp.position || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/employees/${emp.id}`)
                        }
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        disabled={deletingId === emp.id}
                        className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        {deletingId === emp.id ? (
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>Employee Management System</p>

          <p>
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        </footer>
      </div>

      {/* Animations */}
      <style jsx global>{`
        .dashboard-bg {
          background: #f8fafc;
        }

        .dashboard-enter {
          animation: dashboardFade 0.6s ease-out both;
        }

        .stat-card {
          animation: cardEnter 0.6s ease-out both;
        }

        .employee-row {
          animation: rowEnter 0.4s ease-out both;
        }

        @keyframes dashboardFade {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rowEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-enter,
          .stat-card,
          .employee-row {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
