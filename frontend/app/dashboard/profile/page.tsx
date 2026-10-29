
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  CreditCard,
} from "lucide-react";

type UserData = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  role: string;
  visitorNumber: string | null;
  profilePhoto?: string | null;
};

const API_URL = "http://localhost:3000";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/visitor-me`, {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data: UserData = await response.json();

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
      } catch (err) {
        console.error("Failed to load visitor profile:", err);

        if (!cancelled) {
          setError("Unable to load your profile. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
        <div className="flex items-center gap-3">
          <LoaderCircle size={22} className="animate-spin" />
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-red-600 dark:text-red-400">
            {error || "Profile information is unavailable."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-[#1a2a3a] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#d4af37] dark:text-[#1a2a3a]"
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-3 block w-full text-sm text-gray-500 hover:underline"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a2a3a] dark:bg-gray-950 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rwanda Correctional Services
            </p>
            <h1 className="mt-1 text-xl font-bold">My Profile</h1>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Profile summary */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-28 bg-[#1a2a3a] sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Visitor profile"
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm dark:border-gray-900 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#d4af37] text-2xl font-bold text-[#1a2a3a] shadow-sm dark:border-gray-900 sm:h-28 sm:w-28">
                  {initials || <UserRound size={34} />}
                </div>
              )}

              <div className="pb-1 sm:pb-2">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Visitor account
                </p>
              </div>

              <div className="sm:ml-auto sm:pb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                  <CheckCircle2 size={15} />
                  Active account
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              View your registered information and visitor identification
              details below.
            </p>
          </div>
        </section>

        {/* Personal information */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
              <UserRound size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Personal Information</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your registered account details
              </p>
            </div>
          </div>

          <div className="grid gap-x-8 sm:grid-cols-2">
            <ProfileField
              icon={<UserRound size={18} />}
              label="Full Name"
              value={user.fullName}
            />
            <ProfileField
              icon={<Mail size={18} />}
              label="Email Address"
              value={user.email}
            />
            <ProfileField
              icon={<Phone size={18} />}
              label="Phone Number"
              value={user.phoneNumber}
            />
            <ProfileField
              icon={<CreditCard size={18} />}
              label="National ID"
              value={user.nationalId}
            />
          </div>
        </section>

        {/* Visitor identification */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Visitor Identification</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your visitor registration details
              </p>
            </div>
          </div>

          <div className="grid gap-x-8 sm:grid-cols-2">
            <ProfileField
              icon={<CreditCard size={18} />}
              label="Visitor Number"
              value={user.visitorNumber || "Not assigned yet"}
            />
            <ProfileField
              icon={<ShieldCheck size={18} />}
              label="Account Role"
              value={user.role}
            />
          </div>

          <div className="mt-5 rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 p-4">
            <p className="text-sm leading-6">
              Keep your visitor identification information private. If your
              visitor number has not yet been assigned, contact the relevant
              prison administration for assistance.
            </p>
          </div>
        </section>

        {/* Return link */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg bg-[#1a2a3a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243b4f] dark:bg-[#d4af37] dark:text-[#1a2a3a]"
          >
            <CalendarDays size={18} />
            Return to Dashboard
          </button>
        </div>

        <footer className="py-8 text-center text-xs text-gray-500">
          Rwanda Correctional Services Visitor Management System
        </footer>
      </div>
    </main>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex min-w-0 gap-3 border-b border-gray-100 py-5 dark:border-gray-800">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}
