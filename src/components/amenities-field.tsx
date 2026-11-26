"use client";

import { useState } from "react";

const standardAmenities = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Changing room",
  "Softboxes",
  "Backdrop stands",
  "Soundproofing",
  "Microphones",
  "Headphones",
  "Musical instruments",
];

type Props = {
  initialValues?: string[];
};

export default function AmenitiesField({ initialValues = [] }: Props) {
  const [options, setOptions] = useState(() => [
    ...new Set([...standardAmenities, ...initialValues]),
  ]);
  const [selected, setSelected] = useState(() => new Set(initialValues));
  const [custom, setCustom] = useState("");

  function toggle(name: string, checked: boolean) {
    setSelected(current => {
      const next = new Set(current);
      if (checked) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  function addCustom() {
    const value = custom.trim();
    if (!value) return;

    const existing = options.find(
      option => option.toLowerCase() === value.toLowerCase(),
    );
    const name = existing ?? value;

    if (!existing) setOptions(current => [...current, name]);
    toggle(name, true);
    setCustom("");
  }

  return (
    <fieldset className="min-w-0 sm:col-span-2">
      <legend className="font-semibold">Studio amenities</legend>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map(name => (
          <label
            key={name}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <input
              type="checkbox"
              name="amenities"
              value={name}
              checked={selected.has(name)}
              onChange={event => toggle(name, event.target.checked)}
              className="h-4 w-4 accent-[#ff6845]"
            />
            <span>{name}</span>
          </label>
        ))}
      </div>

      <label htmlFor="custom-amenity" className="mt-4 block text-sm">
        Other amenity
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="custom-amenity"
          value={custom}
          maxLength={80}
          onChange={event => setCustom(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder="e.g. Teleprompter"
          className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)]"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="rounded-full border border-[var(--border)] px-4 font-semibold disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </fieldset>
  );
}
