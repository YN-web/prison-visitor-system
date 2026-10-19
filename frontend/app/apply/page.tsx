"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Search, Send, User } from "lucide-react";

type Inmate = {
  id: string;
  inmateNumber: string;
  fullName: string;
};

export default function ApplyPage() {
  const [search, setSearch] = useState("");
  const [inmates, setInmates] = useState<Inmate[]>([]);
  const [selectedInmate, setSelectedInmate] =
    useState<Inmate | null>(null);

  const [visitDate, setVisitDate] = useState("");
  const [purpose, setPurpose] = useState("");

  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (search.trim().length < 2) {
      setInmates([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);

      try {
        const response = await fetch(
          `http://localhost:3000/inmate/search?q=${encodeURIComponent(
            search,
          )}`,
        );

        if (!response.ok) {
          throw new Error("Failed to search inmates");
        }

        const data = await response.json();
        setInmates(data);
      } catch {
        setInmates([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const selectInmate = (inmate: Inmate) => {
    setSelectedInmate(inmate);
    setSearch("");
    setInmates([]);
  };

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setVisitDate(value);
    setMessage("");

    if (!value) {
      setDateError("");
      return;
    }

    const selectedDate = new Date(value);

    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    const timeInMinutes = hours * 60 + minutes;

    const openingTime = 9 * 60;
    const closingTime = 17 * 60;

    if (
      timeInMinutes < openingTime ||
      timeInMinutes > closingTime
    ) {
      setDateError(
        "Visit time must be between 09:00 and 17:00 Rwanda time.",
      );
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    if (!selectedInmate) {
      setMessage("Please select an inmate.");
      return;
    }

    if (!visitDate) {
      setMessage("Please select a visit date and time.");
      return;
    }

    if (dateError) {
      setMessage(
        "Please select a visit time between 09:00 and 17:00 Rwanda time.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:3000/visit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            inmateId: selectedInmate.id,
            visitDate: new Date(
              visitDate,
            ).toISOString(),
            purpose: purpose || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit visit request",
        );
      }

      setMessage(
        "Visit request submitted successfully.",
      );

      setSelectedInmate(null);
      setSearch("");
      setVisitDate("");
      setPurpose("");
      setDateError("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-[#1a2a3a] dark:bg-[#0f1720] dark:text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Apply for a Visit
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Submit a request to visit an inmate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#17212b]"
        >
          <div className="space-y-6">
            {/* Inmate Search */}
            <div className="relative">
              <label
                htmlFor="inmate-search"
                className="mb-2 block text-sm font-medium"
              >
                Search Inmate
              </label>

              {selectedInmate ? (
                <div className="flex items-center justify-between rounded-lg border border-[#d4af37] bg-gray-50 px-4 py-3 dark:bg-[#111a22]">
                  <div className="flex items-center gap-3">
                    <User size={20} />

                    <div>
                      <p className="font-medium">
                        {selectedInmate.fullName}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedInmate.inmateNumber}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedInmate(null)
                    }
                    className="text-sm font-medium text-[#1a2a3a] hover:underline dark:text-[#d4af37]"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="inmate-search"
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search by name or inmate number"
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-[#d4af37] dark:border-gray-600 dark:bg-[#111a22]"
                    />
                  </div>

                  {search.trim().length === 1 && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter at least 2 characters to search.
                    </p>
                  )}

                  {(searching || inmates.length > 0) && (
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#17212b]">
                      {searching && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Searching...
                        </div>
                      )}

                      {!searching &&
                        inmates.map((inmate) => (
                          <button
                            key={inmate.id}
                            type="button"
                            onClick={() =>
                              selectInmate(inmate)
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#111a22]"
                          >
                            <User size={18} />

                            <div>
                              <p className="font-medium">
                                {inmate.fullName}
                              </p>

                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {inmate.inmateNumber}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Visit Date */}
            <div>
              <label
                htmlFor="visitDate"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <CalendarDays size={18} />
                Visit Date and Time
              </label>

              <input
                id="visitDate"
                type="datetime-local"
                value={visitDate}
                min={new Date()
                  .toISOString()
                  .slice(0, 16)}
                onChange={handleDateChange}
                className={`w-full rounded-lg border bg-white px-4 py-3 outline-none dark:bg-[#111a22] ${
                  dateError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:border-[#d4af37]`}
              />

              {dateError && (
                <p className="mt-2 text-sm text-red-600">
                  {dateError}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Visiting hours: 09:00 to 17:00 Rwanda time.
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label
                htmlFor="purpose"
                className="mb-2 block text-sm font-medium"
              >
                Purpose of Visit
              </label>

              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
                rows={4}
                placeholder="Enter the purpose of your visit"
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#d4af37] dark:border-gray-600 dark:bg-[#111a22]"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg border p-4 text-sm ${
                  message.includes("successfully")
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#111a22]"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !!dateError}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a2a3a] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />

              {submitting
                ? "Submitting..."
                : "Submit Visit Request"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

