"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  errorMessage,
  loginReturnUrl,
  prepareStudioWrite,
  studioRequest,
  StudioRequestError,
} from "@/components/studio-requests";

type Booking = {
  _id: string;
  studioTitle: string;
  start: string;
  end: string;
  total: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-900",
  Confirmed: "bg-green-100 text-green-900",
  Completed: "bg-blue-100 text-blue-900",
  Cancelled: "bg-zinc-200 text-zinc-800",
};

const button =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold disabled:opacity-60";

export default function MyBookingsPage() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await studioRequest("/api/bookings/mine", {
          signal: controller.signal,
        });

        const data: Booking[] = await response.json();
        if (!controller.signal.aborted) setRows(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof StudioRequestError && err.status === 401) {
          router.replace(loginReturnUrl("/my-bookings"));
          return;
        }

        setError(errorMessage(err));
      }
    }

    void load();
    return () => controller.abort();
  }, [attempt, router]);

  async function cancelBooking() {
    if (!selected || busy) return;
    setBusy(true);

    try {
      await prepareStudioWrite();
      await studioRequest(`/api/bookings/${selected._id}/cancel`, {
        method: "PATCH",
      });

      setRows(current =>
        current?.map(row =>
          row._id === selected._id ? { ...row, status: "Cancelled" } : row
        ) ?? [],
      );

      dialog.current?.close();
      toast.success("Booking cancelled.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="studio-heading text-5xl uppercase sm:text-7xl">
        My Bookings
      </h1>

      {error ? (
        <div role="alert" className="mt-6">
          <p>{error}</p>
          <button className={`${button} mt-3`} onClick={() => {
            setError("");
            setAttempt(value => value + 1);
          }}>
            Try again
          </button>
        </div>
      ) : rows === null ? (
        <p role="status" className="mt-6 animate-pulse">Loading your bookings…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8">
          <p>You haven’t booked a studio yet.</p>
          <Link href="/studios" className={`${button} mt-4 bg-[#ff6845] text-black`}>
            Explore Studios
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4">
          {rows.map(row => (
            <li key={row._id} className="rounded-xl border border-[var(--border)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="studio-heading text-3xl">{row.studioTitle}</h2>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeStyles[row.status]}`}>
                  {row.status}
                </span>
              </div>

              <p className="mt-3">
                {new Date(row.start).toLocaleString()} – {new Date(row.end).toLocaleString()}
              </p>
              <p className="mt-1">Studio rental: ${row.total.toFixed(2)}</p>

              {row.status === "Pending" && (
                <button type="button" className={`${button} mt-4`}
                  onClick={() => {
                    setSelected(row);
                    dialog.current?.showModal();
                  }}>
                  Cancel booking
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <dialog ref={dialog} aria-labelledby="cancel-heading"
        onCancel={event => { if (busy) event.preventDefault(); }}
        className="m-auto w-[min(92vw,28rem)] rounded-xl border border-[var(--border)] bg-[var(--page)] p-6 text-[var(--text)] backdrop:bg-black/70">
        <h2 id="cancel-heading" className="studio-heading text-3xl">
          Cancel this booking?
        </h2>

        <p className="my-4">Cancel your reservation for {selected?.studioTitle}?</p>

        <div className="flex flex-wrap gap-3">
          <button type="button" autoFocus disabled={busy} className={button}
            onClick={() => dialog.current?.close()}>
            Keep booking
          </button>
          <button type="button" disabled={busy}
            className={`${button} bg-[#ff6845] text-black`} onClick={cancelBooking}>
            {busy ? "Cancelling…" : "Cancel booking"}
          </button>
        </div>
      </dialog>
    </main>
  );
}
