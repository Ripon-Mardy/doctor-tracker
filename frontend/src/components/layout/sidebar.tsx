"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Stethoscope,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", title: "Doctors", icon: Stethoscope },
  { href: "/patients", title: "Patients", icon: Users },
];

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Main navigation"
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-gray-200 bg-white text-gray-700 transition-[width] duration-200 md:flex ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-14 items-center border-b border-gray-200 ${
          collapsed ? "justify-center px-0" : "px-4"
        }`}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Stethoscope className="size-4" aria-hidden />
          </span>
          {!collapsed && (
            <span className="truncate text-base font-bold text-gray-900">
              Doctor Tracker
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <p
          className={`px-2 pb-1 text-[0.7rem] font-medium tracking-wider text-gray-400 uppercase ${
            collapsed ? "sr-only" : ""
          }`}
        >
          Workspace
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-9 items-center gap-3 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    collapsed ? "justify-center px-0" : "px-2.5"
                  } ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-blue-600"
                      aria-hidden
                    />
                  )}
                  <Icon
                    className={`size-4 shrink-0 ${active ? "text-blue-600" : ""}`}
                    aria-hidden
                  />
                  <span className={collapsed ? "sr-only" : "truncate"}>
                    {item.title}
                  </span>
                </Link>

                {/* Tooltip shown only when collapsed */}
                {collapsed && (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {item.title}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-9 w-full items-center gap-3 rounded-lg text-sm font-medium text-gray-600 transition-colors outline-none hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 ${
            collapsed ? "justify-center px-0" : "justify-start px-2.5"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
