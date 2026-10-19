"use client";

import Link from "next/link";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STAFF_ROLES = [
  "ADMIN",
  "PRISON_OFFICER",
  "GATE_GUARD",
  "SUPERINTENDENT",
  "IT_SUPPORT",
];

export default function StaffLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      alert(`${t("email")}: ${t("requiredField")}`);
      return;
    }

    if (!email.includes("@")) {
      alert(t("invalidEmail"));
      return;
    }

    if (!password) {
      alert(`${t("password")}: ${t("requiredField")}`);
      return;
    }

    if (password.length < 8) {
      alert(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      // Login
      const loginResponse = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        alert(loginData.message || t("staffLoginFailed"));
        return;
      }

      // Get the currently logged-in user
      const meResponse = await fetch(
        "http://localhost:3000/auth/me",
        {
          method: "GET",
          credentials: "include",
        },
      );

      const meData = await meResponse.json();

      if (!meResponse.ok) {
        alert(t("staffLoginFailed"));
        return;
      }

      // Make sure this is a staff account
      if (!STAFF_ROLES.includes(meData.role)) {
        await fetch("http://localhost:3000/auth/logout", {
          method: "DELETE",
          credentials: "include",
        });

        alert(t("invalidStaffAccount"));
        return;
      }

      // Staff login successful
      router.push("/management/dashboard");
    } catch (error) {
      console.error("Staff login error:", error);
      alert(t("serverConnectionError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1a2a3a] dark:bg-gray-900 dark:text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Logo and title */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 rounded-full bg-[#1a2a3a] p-3 dark:bg-white">
              <Shield className="h-8 w-8 text-white dark:text-[#1a2a3a]" />
            </div>

            <h1 className="text-center text-2xl font-bold">
              {t("staffLoginTitle")}
            </h1>

            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {t("staffLoginSubtitle")}
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

            {/* Staff notice */}
            <div className="mb-5 rounded-md border border-[#d4af37]/40 bg-[#d4af37]/10 p-3 text-sm text-[#1a2a3a] dark:text-gray-200">
              {t("staffOnly")}
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("email")}
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email")}
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("password")}
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password")}
                    disabled={isLoading}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#1a2a3a] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#1a2a3a] px-4 py-3 font-medium text-white transition hover:bg-[#243b4f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-[#1a2a3a] dark:hover:bg-gray-200"
              >
                {isLoading ? t("loading") : t("staffLogin")}
              </button>
            </form>
          </div>

          {/* Back to visitor login */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/login"
              className="font-medium text-[#1a2a3a] hover:underline dark:text-white"
            >
              {t("backToHome")}
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}