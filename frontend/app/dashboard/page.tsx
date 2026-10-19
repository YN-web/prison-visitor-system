"use client";

import {
  Bell,
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserData = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  role: string;
  visitorNumber: string | null;
};

export default function DashboardPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authenticated user
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/auth/me",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          router.push("/login");
          return;
        }

      const data = await response.json();

// Visitor dashboard is only for VISITOR accounts
if (data.role !== "VISITOR") {
  await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
  });

  router.push("/login");
  return;
}

setUser(data);

      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // Logout
  const handleLogout = async () => {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }

  router.push("/login");
  router.refresh();
};

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Loading screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a2a3a] dark:bg-gray-950 dark:text-white">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1a2a3a] p-2.5 dark:bg-[#d4af37]">
              <LayoutDashboard
                size={22}
                className="text-white dark:text-[#1a2a3a]"
              />
            </div>

            <div>
              <p className="font-bold">
                Visitor Portal
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                RCS Services
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">

          <SidebarButton
            onClick={() => router.push("/")}
            icon={<Home size={19} />}
            label={t("home")}
          />

          <SidebarButton
            active
            icon={<LayoutDashboard size={19} />}
            label={t("dashboard")}
          />

          <SidebarButton
            onClick={() => router.push("/apply")}
            icon={<CalendarDays size={19} />}
            label={t("applyForVisit")}
          />

          <SidebarButton
            onClick={() =>
              router.push("/dashboard/visits")
            }
            icon={<FileText size={19} />}
            label={t("myVisits")}
          />

          <SidebarButton
            icon={<Bell size={19} />}
            label={t("notifications")}
          />

          <SidebarButton
            icon={<User size={19} />}
            label={t("myProfile")}
          />

        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut size={19} />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={23} />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rwanda Correctional Services
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="rounded-lg border border-gray-200 p-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                title="Change theme"
              >
                {theme === "dark" ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>

              {/* Language */}
              <button
                onClick={() =>
                  setLanguage(
                    language === "en" ? "rw" : "en",
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {language === "en" ? "RW" : "EN"}
              </button>

              {/* Notifications */}
              <button
                className="relative rounded-lg border border-gray-200 p-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d4af37]" />
              </button>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="max-w-32 truncate text-sm font-semibold">
                    {user?.fullName || "Loading..."}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Visitor
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a2a3a] text-white dark:bg-[#d4af37] dark:text-[#1a2a3a]">
                  <User size={19} />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* Welcome */}
          <section className="mb-8">
            <p className="mb-2 text-sm font-bold tracking-wide text-[#d4af37]">
              VISITOR PORTAL
            </p>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Welcome, {user?.fullName || "Visitor"}
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                  Manage your prison visit applications,
                  appointments, and account information.
                </p>
              </div>

              <button
                onClick={() => router.push("/apply")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a2a3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#243b4f] dark:bg-[#d4af37] dark:text-[#1a2a3a] dark:hover:bg-[#e1bd4f] sm:w-auto"
              >
                <CalendarDays size={18} />
                {t("applyForVisit")}
              </button>
            </div>
          </section>

          {/* Core Content */}
          <section className="grid gap-6 xl:grid-cols-3">

            {/* Upcoming Visit */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 dark:border-gray-800">
                <div>
                  <h2 className="font-semibold">
                    Upcoming Visit
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your next approved appointment
                  </p>
                </div>

                <CalendarDays
                  size={21}
                  className="text-[#d4af37]"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                  <div className="text-center">
                    <CalendarDays
                      size={34}
                      className="mx-auto mb-3 text-gray-400"
                    />

                    <p className="font-medium">
                      No upcoming visit
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Approved visits will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800">
                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      My Profile
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Visitor information
                    </p>
                  </div>

                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">

                <ProfileRow
                  label="Full Name"
                  value={user?.fullName || "Loading..."}
                />

                <ProfileRow
                  label="Visitor Number"
                  value={
                    user?.visitorNumber ||
                    "Not assigned"
                  }
                />

                <ProfileRow
                  label="Email"
                  value={user?.email || "Loading..."}
                />

                <ProfileRow
                  label="Status"
                  value="Active"
                />

              </div>
            </div>

          </section>

          {/* Recent Requests */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800">
              <h2 className="font-semibold">
                Recent Visit Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your latest applications
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">

                <div className="text-center">
                  <FileText
                    size={32}
                    className="mx-auto mb-3 text-gray-400"
                  />

                  <p className="font-medium">
                    No visit requests yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your submitted applications will appear here.
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* Footer */}
          <footer className="py-8 text-center text-xs text-gray-500">
            Rwanda Correctional Services Visitor Management System
          </footer>

        </div>
      </div>
    </main>
  );
}

// ==========================================
// SIDEBAR BUTTON
// ==========================================

function SidebarButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-[#1a2a3a] text-white dark:bg-[#d4af37] dark:text-[#1a2a3a]"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ==========================================
// PROFILE ROW
// ==========================================

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="max-w-[60%] truncate text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}