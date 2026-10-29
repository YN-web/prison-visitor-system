
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function GateLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch(
        "http://localhost:3000/auth/login?type=staff",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const loginData = await loginResponse.json().catch(() => null);

      if (!loginResponse.ok) {
        setError(
          typeof loginData?.message === "string"
            ? loginData.message
            : "Login failed. Check your credentials and try again."
        );
        return;
      }

      const meResponse = await fetch(
        "http://localhost:3000/auth/staff-me",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const meData = await meResponse.json().catch(() => null);

      if (!meResponse.ok) {
        setError("Unable to verify your staff account. Please try again.");
        return;
      }

      if (meData?.role !== "GATE_GUARD") {
        await fetch("http://localhost:3000/auth/logout?type=staff", {
          method: "DELETE",
          credentials: "include",
        });

        setError(
          "Access denied. This portal is restricted to authorized gate guards."
        );
        return;
      }

      router.replace("/gate");
    } catch (err) {
      console.error("Gate login error:", err);
      setError(
        "Cannot connect to the server. Make sure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-[#1a2a3a] dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-[#1a2a3a]">
            <ShieldCheck className="h-8 w-8 text-[#d4af37]" />
          </div>

          <h1 className="text-2xl font-bold">
            Gate Officer Sign In
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Prison Visitor Management System
          </p>
        </div>

        <section className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 border-l-4 border-[#d4af37] bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-sm font-semibold">Authorized personnel only</p>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
              Sign in with your registered staff account. Only authorized
              gate guards can access gate operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Staff email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your staff email"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#1a2a3a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263e54] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Verifying account..." : "Sign In"}
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          All gate activities are subject to authorization and audit logging.
        </p>
      </div>
    </main>
  );
}
