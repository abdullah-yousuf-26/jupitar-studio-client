"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  errorMessage,
  loginReturnUrl,
  prepareStudioWrite,
  studioRequest,
  StudioRequestError,
} from "./studio-requests";

type Props = {
  studioId: string;
  hourlyRate: number;
};

const inputStyle =
  "mt-2 block min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)]";

const buttonStyle =
  "rounded-full border border-[var(--border)] px-4 py-2 font-semibold disabled:opacity-60";

const hourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`,
}));

function getSlot(date: string, startHour: string, endHour: string) {
  if (!date || startHour === "" || endHour === "" || startHour === endHour) {
    return null;
  }

  const start = new Date(`${date}T${startHour.padStart(2, "0")}:00:00+06:00`);
  const overnight = Number(endHour) < Number(startHour);
  const hours = (Number(endHour) - Number(startHour) + 24) % 24;
  const end = new Date(start.getTime() + hours * 3_600_000);

  if (!Number.isFinite(end.getTime())) return null;
  return { start, end, hours, overnight };
}

export default function BookWorkspaceButton({ studioId, hourlyRate }: Props) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const submissionId = useRef("");

  const [contactNumber, setContactNumber] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [today, setToday] = useState("");
  const [busy, setBusy] = useState(false);

  const slot = getSlot(date, startHour, endHour);

  function handleError(err: unknown) {
    if (err instanceof StudioRequestError && err.status === 401) {
      router.push(loginReturnUrl(`/studios/${studioId}`));
      return;
    }

    toast.error(errorMessage(err));
  }

  async function openDialog() {
    if (busy) return;
    setBusy(true);

    try {
      await prepareStudioWrite();

      // Calculate today's Bangladesh date when the visitor opens the form.
      const dhakaNow = new Date(Date.now() + 6 * 3_600_000);
      setToday(dhakaNow.toISOString().slice(0, 10));
      dialog.current?.showModal();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const phone = contactNumber.replace(/[\s()-]/g, "");

    if (!/^(?:0\d{9,10}|\+[1-9]\d{6,14})$/.test(phone)) {
      toast.error("Enter a valid contact number, such as 01712345678 or +8801712345678.");
      return;
    }

    if (!slot) {
      toast.error("Choose a date and two different hours.");
      return;
    }

    if (slot.start.getTime() <= Date.now()) {
      toast.error("Please choose a future start hour.");
      return;
    }

    setBusy(true);

    try {
      await prepareStudioWrite();
      submissionId.current ||= crypto.randomUUID();

      await studioRequest("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          contactNumber: phone,
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          requestId: submissionId.current,
        }),
      });

      dialog.current?.close();
      toast.success("Booking requested.");
      router.push("/my-bookings");
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={openDialog}
        className="mt-5 rounded-full bg-[#ff6845] px-5 py-3 font-semibold text-black disabled:opacity-60"
      >
        Book Workspace Now
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="booking-heading"
        onCancel={event => {
          if (busy) event.preventDefault();
        }}
        className="m-auto max-h-[90dvh] w-[min(92vw,30rem)] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--page)] p-6 text-[var(--text)] backdrop:bg-black/70"
      >
        <h2 id="booking-heading" className="studio-heading text-3xl">
          Book this workspace
        </h2>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Bangladesh time (GMT+6) · ${hourlyRate} per hour
        </p>

        <form
          onSubmit={book}
          onChange={() => {
            submissionId.current = "";
          }}
        >
          <fieldset disabled={busy} className="mt-5 grid gap-4">
            <label>
              Contact number
              <input
                type="tel"
                autoComplete="tel"
                placeholder="01712345678 or +8801712345678"
                maxLength={32}
                value={contactNumber}
                onChange={event => setContactNumber(event.target.value)}
                className={inputStyle}
                required
              />
            </label>

            <label>
              Booking date
              <input
                type="date"
                value={date}
                min={today}
                onChange={event => setDate(event.target.value)}
                className={inputStyle}
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                Start hour
                <select
                  value={startHour}
                  onChange={event => {
                    const value = event.target.value;
                    setStartHour(value);
                    if (endHour === value) setEndHour("");
                  }}
                  className={inputStyle}
                  required
                >
                  <option value="" disabled>Select hour</option>
                  {hourOptions.map(hour => (
                    <option key={hour.value} value={hour.value}>
                      {hour.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                End hour
                <select
                  value={endHour}
                  onChange={event => setEndHour(event.target.value)}
                  className={inputStyle}
                  required
                >
                  <option value="" disabled>Select hour</option>
                  {hourOptions.map(hour => (
                    <option
                      key={hour.value}
                      value={hour.value}
                      disabled={hour.value === startHour}
                    >
                      {hour.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {slot && (
              <div
                aria-live="polite"
                className="rounded-lg border border-[var(--border)] p-3"
              >
                <p>
                  {slot.overnight && "Ends the next day · "}
                  {slot.hours} {slot.hours === 1 ? "hour" : "hours"}
                </p>
                <p className="mt-1 font-semibold">
                  Studio rental: ${(slot.hours * hourlyRate).toFixed(2)}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={buttonStyle}
                onClick={() => dialog.current?.close()}
              >
                Close
              </button>

              <button
                type="submit"
                className={`${buttonStyle} bg-[#ff6845] text-black`}
              >
                {busy ? "Submitting…" : "Request booking"}
              </button>
            </div>
          </fieldset>
        </form>
      </dialog>
    </>
  );
}
