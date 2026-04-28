import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active:     "text-success",
    completed:  "text-info",
    pending:    "text-warning",
    draft:      "text-secondary",
    cancelled:  "text-danger",
    in_progress:"text-accent",
    dispatched: "text-accent",
    quoted:     "text-warning",
    invoiced:   "text-info",
    paid:       "text-success",
  };
  return map[status.toLowerCase()] ?? "text-secondary";
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    active:     "badge-active",
    completed:  "badge-complete",
    pending:    "badge-pending",
    draft:      "badge-draft",
    cancelled:  "badge-danger",
    in_progress:"badge-accent",
    dispatched: "badge-accent",
    quoted:     "badge-pending",
    invoiced:   "badge-complete",
    paid:       "badge-active",
  };
  return map[status.toLowerCase()] ?? "badge-draft";
}

export function truncate(str: string, length = 40): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}
