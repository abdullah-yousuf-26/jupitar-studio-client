"use client";
import AmenitiesField from "./amenities-field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

type Host = { name: string; email: string };
type Listing = {
  _id: string;
  title: string;
  location: string;
  hourlyRate: number;
  category: string;
};
type HostData = { host: Host; listings: Listing[] };

const categories = [
  ["photo", "Photo Studio"],
  ["film", "Sound Stage"],
  ["podcast", "Podcast Room"],
  ["music", "Music Suite"],
  ["workshop", "Art Workshop"],
];

const control =
  "mt-2 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)]";
const primary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-5 font-semibold text-[#191919] disabled:opacity-60";
const secondary =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold disabled:opacity-60";

async function checkedFetch(path: string, options?: RequestInit) {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || `Request failed (${response.status}).`);
  }

  return response;
}

async function prepareWrite() {
  await checkedFetch("/api/host/session", { method: "POST" });
}

function AddStudioForm({ host }: { host: Host }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const requestId = useRef("");

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const data = new FormData(event.currentTarget);
    const photo = data.get("photo");

    if (!(photo instanceof File) || !photo.size) {
      toast.error("Choose a studio photo.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(photo.type) || photo.size > 5 * 1024 * 1024) {
      toast.error("Choose a PNG or JPEG up to 5 MB.");
      return;
    }

    setBusy(true);
    try {
      await prepareWrite();

      let uploaded = imageUrl;
      if (!uploaded) {
        const response = await checkedFetch("/api/host/images", {
          method: "POST",
          headers: { "Content-Type": photo.type },
          body: photo,
        });
        uploaded = (await response.json()).imageUrl;
        setImageUrl(uploaded);
      }

      requestId.current ||= crypto.randomUUID();

      const payload = {
        requestId: requestId.current,
        title: String(data.get("title")).trim(),
        category: String(data.get("category")),
        hourlyRate: Number(data.get("hourlyRate")),
        securityDeposit: Number(data.get("securityDeposit")),
        maxCapacity: Number(data.get("maxCapacity")),
        location: String(data.get("location")).trim(),
        overview: String(data.get("overview")).trim(),
        amenities: data.getAll("amenities").map(String),
        imageUrl: uploaded,
      };

      await checkedFetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Studio published.");
      router.replace("/my-listings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn’t publish the studio.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={publish} className="mt-8 max-w-3xl">
      <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          Studio title
          <input name="title" required maxLength={120} className={control} />
        </label>

        <label>
          Category
          <select name="category" required defaultValue="" className={control}>
            <option value="" disabled>Choose a category</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label>
          Maximum capacity
          <input name="maxCapacity" type="number" min="1" step="1" required className={control} />
        </label>

        <label>
          Hourly rate ($)
          <input name="hourlyRate" type="number" min="0.01" step="0.01" required className={control} />
        </label>

        <label>
          Security deposit ($)
          <input name="securityDeposit" type="number" min="0" step="0.01" defaultValue="0" required className={control} />
        </label>

        <label className="sm:col-span-2">
          Location or address
          <input name="location" maxLength={250} required className={control} />
        </label>

        <label className="sm:col-span-2">
          Studio photo (PNG or JPEG, up to 5 MB)
          <input
            name="photo"
            type="file"
            accept="image/png,image/jpeg"
            required
            className={control}
            onChange={() => setImageUrl("")}
          />
        </label>

        {imageUrl && (
          <label className="sm:col-span-2">
            Uploaded image URL
            <input value={imageUrl} readOnly className={control} />
          </label>
        )}

        <AmenitiesField />

        <label className="sm:col-span-2">
          Detailed overview
          <textarea name="overview" required maxLength={5000} rows={5} className={control} />
        </label>

        <label>
          Host name
          <input value={host.name} readOnly className={control} />
        </label>

        <label>
          Host email
          <input value={host.email} readOnly className={control} />
        </label>

        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className={primary}>
            {busy ? "Publishing…" : "Publish studio"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function Listings({ initial }: { initial: Listing[] }) {
  const [listings, setListings] = useState(initial);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  async function deleteListing() {
    if (!selected || busy) return;
    setBusy(true);

    try {
      await prepareWrite();
      await checkedFetch(`/api/studios/${selected._id}`, { method: "DELETE" });
      setListings((items) => items.filter((item) => item._id !== selected._id));
      dialog.current?.close();
      toast.success("Studio deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn’t delete the studio.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link href="/add-studio" className={`${primary} mt-6`}>Add New Studio</Link>

      {listings.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">
          You haven’t published a studio yet. Add your first space to see it here.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {listings.map((item) => (
            <li key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-5">
              <div>
                <Link href={`/studios/${item._id}`} className="studio-heading text-3xl hover:underline">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {item.location} · ${item.hourlyRate} / hr
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/studios/edit/${item._id}`} className={secondary}>Update</Link>
                <button
                  type="button"
                  className={secondary}
                  onClick={() => {
                    setSelected(item);
                    dialog.current?.showModal();
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        onCancel={(event) => { if (busy) event.preventDefault(); }}
        onClose={() => setSelected(null)}
        className="m-auto w-[min(90vw,28rem)] rounded-xl border border-[var(--border)] bg-[var(--page)] p-6 text-[var(--text)] backdrop:bg-black/70"
      >
        <h2 id="delete-title" className="studio-heading text-3xl">Delete this studio?</h2>
        <p className="my-4">
          “{selected?.title}” will be removed from your listings and Explore Studios.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" autoFocus disabled={busy} className={secondary} onClick={() => dialog.current?.close()}>
            Keep studio
          </button>
          <button type="button" disabled={busy} className={primary} onClick={deleteListing}>
            {busy ? "Deleting…" : "Delete studio"}
          </button>
        </div>
      </dialog>
    </>
  );
}

export default function HostStudios({ mode }: { mode: "add" | "list" }) {
  const router = useRouter();
  const [data, setData] = useState<HostData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const response = await fetch("/api/host/listings", {
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.status === 401) {
        const destination = mode === "add" ? "/add-studio" : "/my-listings";
        router.replace(`/login?returnTo=${encodeURIComponent(destination)}`);
        return;
      }
      if (!response.ok) throw new Error();

      const result: HostData = await response.json();
      if (!controller.signal.aborted) setData(result);
    }

    load().catch(() => {
      if (!controller.signal.aborted) setFailed(true);
    });

    return () => controller.abort();
  }, [attempt, mode, router]);

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="studio-heading text-5xl uppercase sm:text-7xl">
        {mode === "add" ? "Add New Studio" : "My Studio Listings"}
      </h1>

      {failed ? (
        <div role="alert" className="mt-6">
          <p>Couldn’t load your host account.</p>
          <button
            type="button"
            className={`${secondary} mt-3`}
            onClick={() => { setFailed(false); setAttempt((count) => count + 1); }}
          >
            Try again
          </button>
        </div>
      ) : !data ? (
        <p role="status" className="mt-6 animate-pulse">Loading your host account…</p>
      ) : mode === "add" ? (
        <AddStudioForm host={data.host} />
      ) : (
        <Listings initial={data.listings} />
      )}
    </main>
  );
}
