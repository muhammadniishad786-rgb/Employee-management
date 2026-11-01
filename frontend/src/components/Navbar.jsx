
"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    const updatePath = () => {
      setPathname(window.location.pathname);
    };

    updatePath();

    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/employees") return "Employees";
    if (pathname === "/employees/add") return "Add Employee";

    if (pathname.startsWith("/employees/")) {
      return "Edit Employee";
    }

    return "Employee Management";
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {getPageTitle()}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Welcome to your employee management system
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">

        <button
          type="button"
          aria-label="Search"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:block"
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />
        </div>

      </div>
    </header>
  );
}
