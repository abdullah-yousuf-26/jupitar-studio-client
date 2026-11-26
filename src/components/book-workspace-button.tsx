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

const input =
  "mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2";
const button =
  "rounded-full border border-[var(--border)] px-4 py-2 font-semibold disabled:opacity-60";

export default function BookWorkspaceButton({ studioId, hourlyRate }: Props) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const submissionId = useRef("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [busy, setBusy] = useState(false);

  const hours = (Date.parse(end) - Date.parse(start)) / 3_600_000;

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

    if (!(hours > 0) || Date.parse(start) <= Date.now()) {
      toast.error("Choose a future start time and a later end time.");
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
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
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
      <button type="button" disabled={busy} onClick={openDialog}
        className="mt-5 rounded-full bg-[#ff6845] px-5 py-3 font-semibold text-black disabled:opacity-60">
        Book Workspace Now
      </button>

      <dialog ref={dialog} aria-labelledby="booking-heading"
        onCancel={event => { if (busy) event.preventDefault(); }}
        className="m-auto w-[min(92vw,28rem)] rounded-xl border border-[var(--border)] bg-[var(--page)] p-6 text-[var(--text)] backdrop:bg-black/70">
        <h2 id="booking-heading" className="studio-heading text-3xl">
          Book this workspace
        </h2>

        <p className="mt-2">Choose your session in your local time. ${hourlyRate} per hour.</p>

        <form onSubmit={book}>
          <fieldset disabled={busy} className="mt-5 grid gap-4">
            <label>Start time
              <input className={input} type="datetime-local" required value={start}
                onChange={event => {
                  setStart(event.target.value);
                  submissionId.current = "";
                }} />
            </label>

            <label>End time
              <input className={input} type="datetime-local" required value={end}
                onChange={event => {
                  setEnd(event.target.value);
                  submissionId.current = "";
                }} />
            </label>

            {hours > 0 && <p>Studio rental: ${(hours * hourlyRate).toFixed(2)}</p>}

            <div className="flex flex-wrap gap-3">
              <button type="button" className={button} onClick={() => dialog.current?.close()}>
                Close
              </button>
              <button type="submit" className={`${button} bg-[#ff6845] text-black`}>
                {busy ? "Submitting…" : "Request booking"}
              </button>
            </div>
          </fieldset>
        </form>
      </dialog>
    </>
  );
}
