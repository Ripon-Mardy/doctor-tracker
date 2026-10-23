"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarRange, ChevronDown, X } from "lucide-react";

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateString(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function formatShort(value: string, withYear = true) {
  return parseDateString(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
  });
}

function formatRange(from: string | null, to: string | null) {
  if (from && to) {
    if (from === to) return formatShort(from);
    const sameYear = from.slice(0, 4) === to.slice(0, 4);
    return `${formatShort(from, !sameYear)} – ${formatShort(to)}`;
  }
  if (from) return `From ${formatShort(from)}`;
  if (to) return `Until ${formatShort(to)}`;
  return "";
}

const PRESETS = [
  { label: "Today", range: () => [new Date(), new Date()] },
  { label: "Last 7 days", range: () => [daysAgo(6), new Date()] },
  { label: "Last 30 days", range: () => [daysAgo(29), new Date()] },
  { label: "Last 90 days", range: () => [daysAgo(89), new Date()] },
  {
    label: "This month",
    range: () => {
      const now = new Date();
      return [new Date(now.getFullYear(), now.getMonth(), 1), now];
    },
  },
  {
    label: "This year",
    range: () => [new Date(new Date().getFullYear(), 0, 1), new Date()],
  },
];

interface DateRangePickerProps {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  label?: string;
  placeholder?: string;
  align?: "start" | "end";
  className?: string;
}

export function DateRangePicker({
  from,
  to,
  onChange,
  label = "Date range",
  placeholder = "Any date",
  align = "start",
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasValue = Boolean(from || to);
  const today = toDateString(new Date());

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      setDraftFrom(from ?? "");
      setDraftTo(to ?? "");
    }
    setOpen(!open);
  }

  function apply(nextFrom: string | null, nextTo: string | null) {
    onChange(nextFrom, nextTo);
    setOpen(false);
  }

  function handleApply() {
    apply(draftFrom || null, draftTo || draftFrom || null);
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={hasValue ? `${label}: ${formatRange(from, to)}` : label}
        className={`flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white pl-3 text-sm outline-none transition hover:bg-gray-50 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
          hasValue ? "pr-9 text-gray-900" : "pr-3 text-gray-500"
        }`}
      >
        <CalendarRange className="size-4 shrink-0 text-gray-400" aria-hidden />
        <span className="truncate">
          {hasValue ? formatRange(from, to) : placeholder}
        </span>
        {!hasValue && (
          <ChevronDown
            className={`ml-auto size-4 shrink-0 text-gray-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        )}
      </button>

      {hasValue && (
        <button
          type="button"
          onClick={() => onChange(null, null)}
          aria-label={`Clear ${label.toLowerCase()}`}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={`absolute z-30 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-1 border-b border-gray-100 p-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const [start, end] = preset.range();
                  apply(toDateString(start), toDateString(end));
                }}
                className="h-8 rounded-lg px-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 p-3">
            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-500">From</span>
              <input
                type="date"
                value={draftFrom}
                max={draftTo || today}
                onChange={(e) => setDraftFrom(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 px-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-500">To</span>
              <input
                type="date"
                value={draftTo}
                min={draftFrom || undefined}
                max={today}
                onChange={(e) => setDraftTo(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 px-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={() => apply(null, null)}
              className="h-8 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!draftFrom}
              className="h-8 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
