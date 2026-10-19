"use client";

import {
  Bell,
  CalendarCheck,
  CheckCircle,
  Clock,
  FileText,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";

type UserData = {
  fullName: string;
  email: string;
  role: string;
};

type DashboardStats = {
  totalVisitors: number;
  todaysVisits: number;
  pendingRequests: number;
  approvedVisits: number;
  checkedIn: number;
  completed: number;
  rejected: number;
  noShows: number;
  cancelled: number;
};

const STAFF_ROLES = [
  "ADMIN",
  "PRISON_OFFICER",
  "GATE_GUARD",
  "SUPERINTENDENT",
  "IT_SUPPORT",
];

export default function ManagementDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    totalVisitors: 0,
    todaysVisits: 0,
    pendingRequests: 0,
    approvedVisits: 0,
    checkedIn: 0,
    completed: 0,
    rejected: 0,
    noShows: 0,
    cancelled: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load logged-in staff user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/auth/me",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          router.push("/management/login");
          return;
        }

        const data = await response.json();

        if (!STAFF_ROLES.includes(data.role)) {
  await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
  });

  router.push("/management/login");
  return;
}

        setUser({
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        console.error(error);
        router.push("/management/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // Load dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/management/dashboard/stats",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard stats:",
          error,
        );
      }
    };

    fetchStats();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }

    router.push("/management/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
        <p>{t("loading")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a2a3a] dark:bg-gray-950 dark:text-white">

      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <Shield size={22} />

          <span className="font-semibold">
            {t("staffPortal")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {mounted && (
            <button
              onClick={() =>
                setTheme(
                  theme === "dark" ? "light" : "dark",
                )
              }
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
          )}

          <button
            onClick={() =>
              setLanguage(language === "en" ? "rw" : "en")
            }
            className="rounded-md px-2 py-2 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1a2a3a] p-2 dark:bg-white">
              <Shield
                size={20}
                className="text-white dark:text-[#1a2a3a]"
              />
            </div>

            <div>
              <p className="text-sm font-bold">
                Prison Management
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("staffPortal")}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          <button className="flex w-full items-center gap-3 rounded-md bg-[#1a2a3a] px-3 py-2.5 text-sm font-medium text-white">
            <FileText size={18} />
            {t("dashboard")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <CalendarCheck size={18} />
            {t("visitManagement")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <Users size={18} />
            {t("visitorManagement")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <Users size={18} />
            {t("inmateManagement")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <Shield size={18} />
            {t("prisonManagement")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <CheckCircle size={18} />
            {t("gateCheckIn")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <FileText size={18} />
            {t("reports")}
          </button>

          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell size={18} />
            {t("notifications")}
          </button>
        </nav>

        {/* Sidebar User */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3">
            <p className="truncate text-sm font-semibold">
              {user?.fullName}
            </p>

            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut size={18} />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">

        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-800 dark:bg-gray-900 lg:flex">
          <div>
            <h1 className="text-lg font-semibold">
              {t("dashboard")}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("staffPortalSystem")}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Theme */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(
                    theme === "dark" ? "light" : "dark",
                  )
                }
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>
            )}

            {/* Language */}
            <button
              onClick={() =>
                setLanguage(language === "en" ? "rw" : "en")
              }
              className="px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle language"
            >
              {language === "en" ? "RW" : "EN"}
            </button>

            {/* User */}
            <div className="ml-2 border-l border-gray-200 pl-4 text-right dark:border-gray-700">
              <p className="text-sm font-medium">
                {user?.fullName}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="p-4 sm:p-6 lg:p-8">

          {/* Welcome */}
          <div className="mb-6 rounded-xl bg-[#1a2a3a] p-6 text-white">
            <p className="mb-1 text-sm text-gray-300">
              {t("welcomeBack")}
            </p>

            <h2 className="text-2xl font-bold">
              {user?.fullName}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              {t("managementDescription")}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title={t("totalVisitors")}
              value={stats.totalVisitors}
              icon={<Users size={22} />}
            />

            <StatCard
              title={t("todaysVisits")}
              value={stats.todaysVisits}
              icon={<CalendarCheck size={22} />}
            />

            <StatCard
              title={t("pendingRequests")}
              value={stats.pendingRequests}
              icon={<Clock size={22} />}
            />

            <StatCard
              title={t("approvedVisits")}
              value={stats.approvedVisits}
              icon={<CheckCircle size={22} />}
            />

            <StatCard
              title={t("checkedIn")}
              value={stats.checkedIn}
              icon={<CheckCircle size={22} />}
            />

            <StatCard
              title={t("completed")}
              value={stats.completed}
              icon={<CheckCircle size={22} />}
            />

            <StatCard
              title={t("rejected")}
              value={stats.rejected}
              icon={<XCircle size={22} />}
            />

            <StatCard
              title={t("noShows")}
              value={stats.noShows}
              icon={<XCircle size={22} />}
            />

          </div>

          {/* Recent Activity */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h3 className="font-semibold">
                {t("recentActivity")}
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("recentActivityDescription")}
              </p>
            </div>

            <div className="flex min-h-40 items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
              {t("noRecentActivity")}
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <div className="mb-4 flex items-center justify-between">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}