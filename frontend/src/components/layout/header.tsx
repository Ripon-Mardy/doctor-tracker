"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Search,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", title: "Doctors", icon: Stethoscope },
  { href: "/patients", title: "Patients", icon: Users },
];

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getPageTitle(pathname: string) {
  const match = NAV_ITEMS.find((item) => isNavActive(pathname, item.href));
  if (match) return match.title;

  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment) return "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

function getInitials(name?: string) {
  if (!name) return "A";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  // Close menus when the route changes
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close the profile menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      router.replace("/login");
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex size-9 items-center justify-center rounded-lg text-gray-600 outline-none hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>

        {/* Page title */}
        <h1 className="min-w-0 truncate text-base font-semibold text-gray-900 sm:text-lg">
          {pageTitle}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="relative hidden sm:block"
          >
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="h-9 w-48 rounded-lg border border-gray-200 bg-gray-50 pr-3 pl-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 lg:w-64"
            />
          </form>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-lg text-gray-600 outline-none hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Bell className="size-4" aria-hidden />
            <span
              className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white"
              aria-hidden
            />
          </button>

          {/* Profile menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex h-9 items-center gap-2 rounded-lg pr-2 pl-1 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {getInitials(admin?.name)}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 lg:block">
                {admin?.name ?? "Admin"}
              </span>
              <ChevronDown
                className={`size-4 text-gray-400 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {admin?.name ?? "Admin"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {admin?.email ?? ""}
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-gray-700 outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
                  >
                    <User className="size-4" aria-hidden />
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm text-red-600 outline-none hover:bg-red-50 focus-visible:bg-red-50 disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <LogOut className="size-4" aria-hidden />
                    )}
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer (sidebar is hidden below md) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            aria-label="Mobile navigation"
            className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Stethoscope className="size-4" aria-hidden />
                </span>
                <span className="text-base font-bold text-gray-900">
                  Doctor Tracker
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 p-3">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="size-4" aria-hidden />
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
