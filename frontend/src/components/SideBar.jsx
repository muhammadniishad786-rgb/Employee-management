
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  X,
  BriefcaseBusiness,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    name: "Add Employee",
    href: "/employees/add",
    icon: UserPlus,
  },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-900 text-white transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-700 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Staff<span className="text-blue-400">Flow</span>
              </h1>
              <p className="text-xs text-slate-400">
                Employee Management
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-700 p-2">
              <Building2 size={20} />
            </div>

            <div>
              <p className="text-sm font-medium">
                StaffFlow Admin
              </p>
              <p className="text-xs text-slate-400">
                Management Panel
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
