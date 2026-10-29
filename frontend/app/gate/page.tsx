
"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  UserRound,
  Clock,
  ClipboardCheck,
  DoorOpen,
  FileText,
  LockKeyhole,
} from "lucide-react";

export default function GateManagementPage() {
  const [nationalId, setNationalId] = useState("");
  const [message, setMessage] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nationalId.trim()) {
      setMessage("Enter a national ID to search for a visitor.");
      return;
    }

    setMessage(
      "Visitor lookup is not connected to the server yet. No identity or visit has been verified."
    );
  }

  const summary = [
    { label: "Scheduled Visits", value: "—", icon: ClipboardCheck },
    { label: "Visitors Checked In", value: "—", icon: UserRound },
    { label: "Pending Verification", value: "—", icon: Clock },
    { label: "Visitors Currently Inside", value: "—", icon: DoorOpen },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1a2a3a]">
              <ShieldCheck className="h-6 w-6 text-[#d4af37]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Rwanda Correctional Management System
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Gate Operations
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 border-l border-slate-200 pl-5 sm:flex dark:border-slate-700">
            <LockKeyhole className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-sm font-medium">Gate Officer Portal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restricted access
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              SECURITY OPERATIONS / VISITOR CONTROL
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Gate Control Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Verify visitor identity and visit authorization before entry.
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live operational data: Not connected
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.label}
                  </p>
                  <Icon className="h-5 w-5 text-[#9b7915]" />
                </div>
                <p className="mt-4 text-3xl font-semibold tabular-nums">
                  {item.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <article className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h3 className="font-semibold">Visitor Identity Verification</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search the visitor register using the national ID presented.
              </p>
            </div>

            <div className="p-5">
              <form onSubmit={handleSearch} className="space-y-3">
                <label
                  htmlFor="nationalId"
                  className="block text-sm font-medium"
                >
                  National ID number
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="nationalId"
                    value={nationalId}
                    onChange={(e) => {
                      setNationalId(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Enter national ID number"
                    autoComplete="off"
                    className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#9b7915] focus:ring-2 focus:ring-[#d4af37]/30 dark:border-slate-700 dark:bg-slate-950"
                  />

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2a3a] px-5 py-3 text-sm font-medium text-white hover:bg-[#263e54] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    <Search className="h-4 w-4" />
                    Search Register
                  </button>
                </div>
              </form>

              {message && (
                <p
                  role="status"
                  className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                >
                  {message}
                </p>
              )}

              <div className="mt-6 border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-700">
                <UserRound className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-medium">
                  No visitor selected
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Search the register to view identity and visit details.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                A successful identity match does not authorize entry.
                Confirm the visit approval, scheduled date, applicable security
                checks, and prison entry procedures.
              </p>
            </div>
          </article>

          <article className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h3 className="font-semibold">Gate Operations</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Available operational functions
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <div className="flex gap-3 p-5">
                <ClipboardCheck className="mt-1 h-5 w-5 shrink-0 text-[#9b7915]" />
                <div>
                  <h4 className="text-sm font-semibold">
                    Scheduled Visit Verification
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Review approved visit requests and confirm that the
                    scheduled visit is valid for the current date.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-5">
                <UserRound className="mt-1 h-5 w-5 shrink-0 text-[#9b7915]" />
                <div>
                  <h4 className="text-sm font-semibold">
                    Walk-in Registration
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Record an unregistered arrival and submit it through the
                    required authorization procedure.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-5">
                <DoorOpen className="mt-1 h-5 w-5 shrink-0 text-[#9b7915]" />
                <div>
                  <h4 className="text-sm font-semibold">
                    Entry and Exit Register
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Record authorized check-ins and check-outs and monitor
                    visitors who remain inside.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-5">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-[#9b7915]" />
                <div>
                  <h4 className="text-sm font-semibold">
                    Gate Activity Records
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Maintain an auditable record of verification and gate
                    actions.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <footer className="border-t border-slate-200 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Authorized personnel only. All entry decisions must follow
          established prison security procedures.
        </footer>
      </div>
    </main>
  );
}
