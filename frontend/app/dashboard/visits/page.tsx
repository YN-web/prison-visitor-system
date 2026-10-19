"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  XCircle,
  Trash2,
} from "lucide-react";

type Visit = {
  id: string;
  visitDate: string;
  status: string;
  purpose: string | null;
  inmate: {
    id: string;
    inmateNumber: string;
    fullName: string;
  };
};

export default function MyVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/visit/my",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load visits");
        }

        const data = await response.json();
        setVisits(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-RW",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      "en-RW",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

    const handleCancel = async (visitId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/visit/${visitId}/cancel`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to cancel visit");
    }

    setVisits((currentVisits) =>
      currentVisits.map((visit) =>
        visit.id === visitId
          ? { ...visit, status: "CANCELLED" }
          : visit,
      ),
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong.",
    );
  }
};

const handleDelete = async (visitId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this visit request?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/visit/${visitId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.message || "Failed to delete visit",
      );
    }

    setVisits((currentVisits) =>
      currentVisits.filter(
        (visit) => visit.id !== visitId,
      ),
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong.",
    );
  }
};

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";

      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";

      case "CHECKED_IN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

      case "CHECKED_OUT":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";

      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";

      case "NO_SHOW":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-[#1a2a3a] dark:bg-[#0f1720] dark:text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-500 dark:text-gray-400">
            Loading your visits...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-[#1a2a3a] dark:bg-[#0f1720] dark:text-white">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-[#1a2a3a] dark:bg-[#0f1720] dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Visits
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            View your visit requests and their current status.
          </p>
        </div>

        {visits.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-[#17212b]">
            <CalendarDays
              size={42}
              className="mx-auto text-gray-400"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No visits yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You have not submitted any visit requests.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#17212b]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <User size={22} />

                      <div>
                        <h2 className="text-lg font-semibold">
                          {visit.inmate.fullName}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {visit.inmate.inmateNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      visit.status,
                    )}`}
                  >
                    {visit.status.replace(
                      "_",
                      " ",
                    )}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 border-t border-gray-200 pt-5 dark:border-gray-700 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={19}
                      className="text-[#d4af37]"
                    />

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Visit Date
                      </p>

                      <p className="font-medium">
                        {formatDate(
                          visit.visitDate,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock
                      size={19}
                      className="text-[#d4af37]"
                    />

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Visit Time
                      </p>

                      <p className="font-medium">
                        {formatTime(
                          visit.visitDate,
                        )}
                      </p>
                    </div>
                  </div>
                </div> 

                {visit.status === "PENDING" && (
  <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-700 sm:flex-row sm:justify-end">
    <button
      onClick={() => handleCancel(visit.id)}
      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      <XCircle size={17} />
      Cancel Request
    </button>

    <button
      onClick={() => handleDelete(visit.id)}
      className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <Trash2 size={17} />
      Delete Request
    </button>
  </div>
)}

                {visit.purpose && (
                  <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Purpose
                    </p>

                    <p className="mt-1">
                      {visit.purpose}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

