"use client";

import Link from "next/link";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";

export default function LoginPage() {

  const { t } = useLanguage();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

alert(t("loginReady"));
};
  return (
    <main className="min-h-screen bg-white text-[#1a2a3a] dark:bg-gray-900 dark:text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 rounded-full bg-[#1a2a3a] p-3 dark:bg-white">
              <Shield className="h-8 w-8 text-white dark:text-[#1a2a3a]" />
            </div>

            <h1 className="text-center text-2xl font-bold">
              {t("loginTitle")}
            </h1>

            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {t("loginSubtitle")}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {
                <form
                         onSubmit={handleSubmit}
                         className="space-y-5"
                >
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
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />
  </div>

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
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>

  <button
    type="submit"
    className="w-full rounded-md bg-[#1a2a3a] px-4 py-3 font-medium text-white transition hover:bg-[#243b4f] dark:bg-white dark:text-[#1a2a3a] dark:hover:bg-gray-200"
  >
    {t("login")}
  </button>
</form>

            }
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/signup"
              className="font-medium text-[#1a2a3a] hover:underline dark:text-white"
            >
              {t("registerHere")}
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}