"use client";
import AmenitiesField from "./amenities-field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  errorMessage,
  loginReturnUrl,
  prepareStudioWrite,
  studioRequest,
  StudioRequestError,
} from "./studio-requests";

type EditData = {
  host: { name: string; email: string };
  studio: {
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    overview: string;
    amenities: string[];
    imageUrl?: string;
  };
};

const field =
  "mt-2 block min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)]";

export default function EditStudioForm({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<EditData | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const editPath = `/studios/edit/${id}`;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await studioRequest(`/api/host/listings/${id}`, {
          signal: controller.signal,
        });
        const result: EditData = await response.json();
        if (!controller.signal.aborted) setData(result);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof StudioRequestError && err.status === 401) {
          router.replace(loginReturnUrl(editPath));
          return;
        }

        setError(errorMessage(err));
      }
    }

    void load();
    return () => controller.abort();
  }, [id, editPath, router]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    setBusy(true);

    try {
      await prepareStudioWrite();

      let imageUrl: string | undefined;
      const photo = form.get("photo");

      if (photo instanceof File && photo.size > 0) {
        if (!["image/png", "image/jpeg"].includes(photo.type) ||
            photo.size > 5 * 1024 * 1024) {
          throw new Error("Choose a PNG or JPEG up to 5 MB.");
        }

        const upload = await studioRequest("/api/host/images", {
          method: "POST",
          headers: { "Content-Type": photo.type },
          body: photo,
        });

        imageUrl = (await upload.json()).imageUrl;
      }

      await studioRequest(`/api/studios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          category: form.get("category"),
          hourlyRate: Number(form.get("hourlyRate")),
          securityDeposit: Number(form.get("securityDeposit")),
          maxCapacity: Number(form.get("maxCapacity")),
          location: form.get("location"),
          overview: form.get("overview"),
          amenities: form.getAll("amenities").map(String),
          imageUrl,
        }),
      });

      toast.success("Studio updated.");
      router.replace("/my-listings");
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  }

  if (error) {
    return <div className="py-8" role="alert">
      <p>{error}</p>
      <Link href="/my-listings" className="mt-3 inline-block underline">
        Back to My Listings
      </Link>
    </div>;
  }

  if (!data) {
    return <p role="status" className="animate-pulse py-8">Loading your studio…</p>;
  }

  const { studio, host } = data;

  return (
    <form onSubmit={save} className="mt-8 max-w-3xl">
      <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">Studio title
          <input className={field} name="title" defaultValue={studio.title} maxLength={120} required />
        </label>

        <label>Category
          <select className={field} name="category" defaultValue={studio.category} required>
            <option value="photo">Photo Studio</option>
            <option value="film">Sound Stage</option>
            <option value="podcast">Podcast Room</option>
            <option value="music">Music Suite</option>
            <option value="workshop">Art Workshop</option>
          </select>
        </label>

        <label>Capacity
          <input className={field} name="maxCapacity" type="number" min="1"
            step="1" defaultValue={studio.maxCapacity} required />
        </label>

        <label>Hourly rate ($)
          <input className={field} name="hourlyRate" type="number" min="0.01"
            step="0.01" defaultValue={studio.hourlyRate} required />
        </label>

        <label>Security deposit ($)
          <input className={field} name="securityDeposit" type="number" min="0"
            step="0.01" defaultValue={studio.securityDeposit} required />
        </label>

        <label className="sm:col-span-2">Location
          <input className={field} name="location" defaultValue={studio.location} maxLength={250} required />
        </label>

        <AmenitiesField initialValues={studio.amenities} />

        <label className="sm:col-span-2">Overview
          <textarea className={field} name="overview" defaultValue={studio.overview}
            rows={5} maxLength={5000} required />
        </label>

        {studio.imageUrl && (
          <figure className="sm:col-span-2">
            <img src={studio.imageUrl} alt={studio.title}
              width={320} height={180} className="max-h-48 rounded-lg object-cover" />
            <figcaption className="mt-1 text-sm">Current studio photo</figcaption>
          </figure>
        )}

        <label className="sm:col-span-2">Replace photo (optional)
          <input className={field} type="file" name="photo" accept="image/png,image/jpeg" />
        </label>

        <label>Host name
          <input className={field} value={host.name} readOnly />
        </label>

        <label>Host email
          <input className={field} value={host.email} readOnly />
        </label>

        <div className="flex items-center gap-5 sm:col-span-2">
          <button type="submit" className="rounded-full bg-[#ff6845] px-5 py-3 font-semibold text-black disabled:opacity-60">
            {busy ? "Saving…" : "Save changes"}
          </button>
          <Link href="/my-listings" className="underline">Back to listings</Link>
        </div>
      </fieldset>
    </form>
  );
}
