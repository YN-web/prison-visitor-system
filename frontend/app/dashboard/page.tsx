
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
  Check,
  CheckCheck,
  LoaderCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type UserData = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  role: string;
  visitorNumber: string | null;
};

type NotificationData = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const API_URL = "http://localhost:3000";

export default function DashboardPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [updatingNotification, setUpdatingNotification] = useState(false);

  const isKinyarwanda = language === "rw";

  // Check the authenticated visitor
  useEffect(() => {
    let cancelled = false;

    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/visitor-me`, {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data: UserData = await response.json();

        // This dashboard is only for visitor accounts.
        if (data.role !== "VISITOR") {
          await fetch(`${API_URL}/auth/logout?type=visitor`, {
            method: "DELETE",
            credentials: "include",
          });

          router.push("/login");
          return;
        }

        if (!cancelled) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load visitor:", error);

        if (!cancelled) {
          router.push("/login");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Load notifications and unread count.
  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationError("");

    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        fetch(`${API_URL}/notifications`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/notifications/unread-count`, {
          credentials: "include",
        }),
      ]);

      if (notificationsResponse.status === 401 ||
          notificationsResponse.status === 403 ||
          countResponse.status === 401 ||
          countResponse.status === 403) {
        setNotifications([]);
        setUnreadCount(0);
        setNotificationError(
          isKinyarwanda
            ? "Ntibishobotse kubona imenyesha. Ongera winjire."
            : "Unable to load notifications. Please sign in again.",
        );
        return;
      }

      if (!notificationsResponse.ok || !countResponse.ok) {
        throw new Error("Could not load notifications.");
      }

      const notificationData: NotificationData[] =
        await notificationsResponse.json();

      const countData = await countResponse.json();

      setNotifications(
        Array.isArray(notificationData) ? notificationData : [],
      );

      setUnreadCount(
        typeof countData === "number"
          ? countData
          : typeof countData?.count === "number"
            ? countData.count
            : 0,
      );
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotificationError(
        isKinyarwanda
          ? "Ntibishobotse kubona imenyesha. Ongera ugerageze."
          : "Could not load notifications. Please try again.",
      );
    } finally {
      setNotificationsLoading(false);
    }
  }, [isKinyarwanda]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  // Open notifications from either the header bell or sidebar.
  const openNotifications = () => {
    setNotificationsOpen(true);
    setMobileMenuOpen(false);
    loadNotifications();
  };

  // Mark one notification as read.
  const markAsRead = async (notificationId: string) => {
    const notification = notifications.find(
      (item) => item.id === notificationId,
    );

    if (!notification || notification.isRead) {
      return;
    }

    setUpdatingNotification(true);

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read.");
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId
            ? { ...item, isRead: true }
            : item,
        ),
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotificationError(
        isKinyarwanda
          ? "Ntibishobotse gushyira iri menyesha mu yasomwe."
          : "Could not mark this notification as read.",
      );
    } finally {
      setUpdatingNotification(false);
    }
  };

  // Mark all notifications as read.
  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    setUpdatingNotification(true);

    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read.");
      }

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotificationError(
        isKinyarwanda
          ? "Ntibishobotse gushyira amatangazo yose mu yasomwe."
          : "Could not mark all notifications as read.",
      );
    } finally {
      setUpdatingNotification(false);
    }
  };

  // Logout visitor.
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout?type=visitor`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    router.push("/login");
    router.refresh();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Loading screen.
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
        <p>{isKinyarwanda ? "Birimo gutegurwa..." : "Loading..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1a2a3a] p-2.5 dark:bg-[#d4af37]">
              <LayoutDashboard
                size={22}
                className="text-white dark:text-[#1a2a3a]"
              />
            </div>

            <div>
              <p className="font-bold">Visitor Portal</p>
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

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <SidebarButton
            onClick={() => {
              router.push("/");
              setMobileMenuOpen(false);
            }}
            icon={<Home size={19} />}
            label={t("home")}
          />

          <SidebarButton
            active
            onClick={() => setMobileMenuOpen(false)}
            icon={<LayoutDashboard size={19} />}
            label={t("dashboard")}
          />

          <SidebarButton
            onClick={() => {
              router.push("/apply");
              setMobileMenuOpen(false);
            }}
            icon={<CalendarDays size={19} />}
            label={t("applyForVisit")}
          />

          <SidebarButton
            onClick={() => {
              router.push("/dashboard/visits");
              setMobileMenuOpen(false);
            }}
            icon={<FileText size={19} />}
            label={t("myVisits")}
          />

          {/* Existing sidebar item: no extra bell is added. */}
          <SidebarButton
            onClick={openNotifications}
            icon={<Bell size={19} />}
            label={t("notifications")}
            badge={unreadCount}
          />

          <SidebarButton
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/dashboard/profile");
            }}
            icon={<User size={19} />}
            label={t("myProfile")}
          />
        </nav>

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

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
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
                title={isKinyarwanda ? "Hindura isura" : "Change theme"}
              >
                {theme === "dark" ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>

              {/* Language */}
              <button
                onClick={() => setLanguage(language === "en" ? "rw" : "en")}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {language === "en" ? "RW" : "EN"}
              </button>

              {/* Single header bell and notification panel */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (notificationsOpen) {
                      setNotificationsOpen(false);
                    } else {
                      openNotifications();
                    }
                  }}
                  className="relative rounded-lg border border-gray-200 p-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  aria-label={isKinyarwanda ? "Amatangazo" : "Notifications"}
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={19} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1 text-xs font-semibold text-[#1a2a3a]">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className="absolute right-0 top-full z-[60] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
                    role="region"
                    aria-label={isKinyarwanda ? "Amatangazo" : "Notifications"}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700">
                      <div>
                        <h2 className="font-semibold">
                          {isKinyarwanda ? "Amatangazo" : "Notifications"}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {unreadCount}{" "}
                          {isKinyarwanda ? "atarasomwa" : "unread"}
                        </p>
                      </div>

                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label={isKinyarwanda ? "Funga" : "Close"}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {unreadCount > 0 && (
                      <div className="flex justify-end border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                        <button
                          onClick={markAllAsRead}
                          disabled={updatingNotification}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#8b6b00] hover:underline disabled:opacity-50 dark:text-[#d4af37]"
                        >
                          <CheckCheck size={15} />
                          {isKinyarwanda
                            ? "Soma yose"
                            : "Mark all as read"}
                        </button>
                      </div>
                    )}

                    {notificationError && (
                      <div className="px-4 py-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {notificationError}
                        </p>
                        <button
                          onClick={loadNotifications}
                          className="mt-2 text-sm font-medium underline"
                        >
                          {isKinyarwanda ? "Ongera ugerageze" : "Try again"}
                        </button>
                      </div>
                    )}

                    {notificationsLoading ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-gray-500">
                        <LoaderCircle size={18} className="animate-spin" />
                        {isKinyarwanda ? "Birimo gutegurwa..." : "Loading..."}
                      </div>
                    ) : !notificationError && notifications.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <Bell
                          size={28}
                          className="mx-auto mb-3 text-gray-400"
                        />
                        <p className="text-sm font-medium">
                          {isKinyarwanda
                            ? "Nta matangazo urabona"
                            : "No notifications yet"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {isKinyarwanda
                            ? "Amakuru mashya azagaragara hano."
                            : "Updates will appear here."}
                        </p>
                      </div>
                    ) : !notificationError ? (
                      <div className="max-h-[min(26rem,60vh)] overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`border-b border-gray-100 px-4 py-4 last:border-b-0 dark:border-gray-800 ${
                              notification.isRead
                                ? ""
                                : "bg-[#d4af37]/10"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 rounded-full p-1.5 ${
                                  notification.isRead
                                    ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
                                    : "bg-[#d4af37]/20 text-[#8b6b00] dark:text-[#d4af37]"
                                }`}
                              >
                                <Bell size={15} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                  {notification.title}
                                </p>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-300">
                                  {notification.message}
                                </p>
                                <p className="mt-2 text-xs text-gray-400">
                                  {new Date(
                                    notification.createdAt,
                                  ).toLocaleString(
                                    language === "rw" ? "rw-RW" : "en-GB",
                                  )}
                                </p>

                                {!notification.isRead && (
                                  <button
                                    onClick={() =>
                                      markAsRead(notification.id)
                                    }
                                    disabled={updatingNotification}
                                    className="mt-2 flex items-center gap-1 text-xs font-medium text-[#8b6b00] hover:underline disabled:opacity-50 dark:text-[#d4af37]"
                                  >
                                    <Check size={14} />
                                    {isKinyarwanda
                                      ? "Shyira mu yasomwe"
                                      : "Mark as read"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                      <button
                        onClick={loadNotifications}
                        disabled={notificationsLoading}
                        className="w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        {isKinyarwanda ? "Kongera kuvugurura" : "Refresh"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Visitor information */}
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="max-w-32 truncate text-sm font-semibold">
                    {user?.fullName || "Visitor"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isKinyarwanda ? "Umushyitsi" : "Visitor"}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a2a3a] text-white dark:bg-[#d4af37] dark:text-[#1a2a3a]">
                  <User size={19} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Welcome */}
          <section className="mb-8">
            <p className="mb-2 text-sm font-bold tracking-wide text-[#d4af37]">
              VISITOR PORTAL
            </p>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {isKinyarwanda ? "Murakaza neza" : "Welcome"},{" "}
                  {user?.fullName || (isKinyarwanda ? "Mushyitsi" : "Visitor")}
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                  {isKinyarwanda
                    ? "Genzura ubusabe bwo gusura, gahunda z'isura n'amakuru ya konti yawe."
                    : "Manage your prison visit applications, appointments, and account information."}
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

          {/* Main cards */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Upcoming visit */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 dark:border-gray-800">
                <div>
                  <h2 className="font-semibold">
                    {isKinyarwanda ? "Isura itaha" : "Upcoming Visit"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isKinyarwanda
                      ? "Gahunda y'isura yawe yemejwe izagaragara hano."
                      : "Your next approved appointment"}
                  </p>
                </div>

                <CalendarDays size={21} className="text-[#d4af37]" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                  <div className="text-center">
                    <CalendarDays
                      size={34}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="font-medium">
                      {isKinyarwanda ? "Nta sura iteganyijwe" : "No upcoming visit"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {isKinyarwanda
                        ? "Isura zemejwe zizagaragara hano."
                        : "Approved visits will appear here."}
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
                      {isKinyarwanda ? "Umwirondoro wanjye" : "My Profile"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isKinyarwanda ? "Amakuru y'umushyitsi" : "Visitor information"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <ProfileRow
                  label={isKinyarwanda ? "Amazina yose" : "Full Name"}
                  value={user?.fullName || "—"}
                />
                <ProfileRow
                  label={isKinyarwanda ? "Nimero y'umushyitsi" : "Visitor Number"}
                  value={user?.visitorNumber || (isKinyarwanda ? "Ntiremezwa" : "Not assigned")}
                />
                <ProfileRow
                  label="Email"
                  value={user?.email || "—"}
                />
                <ProfileRow
                  label={isKinyarwanda ? "Imimerere" : "Status"}
                  value={isKinyarwanda ? "Ikora" : "Active"}
                />
              </div>
            </div>
          </section>

          {/* Recent requests */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800">
              <h2 className="font-semibold">
                {isKinyarwanda ? "Ubusabe bwo gusura buheruka" : "Recent Visit Requests"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isKinyarwanda
                  ? "Kurikirana ubusabe bwawe buheruka."
                  : "Track your latest applications"}
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
                    {isKinyarwanda ? "Nta busabe bwo gusura buraboneka" : "No visit requests yet"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isKinyarwanda
                      ? "Ubusabe watanze buzagaragara hano."
                      : "Your submitted applications will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-gray-500">
            Rwanda Correctional Services Visitor Management System
          </footer>
        </div>
      </div>
    </main>
  );
}

// Sidebar button
function SidebarButton({
  icon,
  label,
  active = false,
  onClick,
  badge = 0,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
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
      <span className="flex-1 text-left">{label}</span>

      {badge > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1.5 py-0.5 text-xs font-semibold text-[#1a2a3a]">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// Profile row
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
