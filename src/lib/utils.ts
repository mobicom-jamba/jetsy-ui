import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting (safe)
export function formatDate(date: string | number | Date) {
  const d = toValidDate(date);
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

// Date and time formatting (safe)
export function formatDateTime(date: string | number | Date) {
  const d = toValidDate(date);
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Status color mapping
export function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "PAUSED":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "DELETED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

// Get status variant for shadcn Badge component
export function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "default";
    case "PAUSED":
      return "secondary";
    case "DELETED":
      return "destructive";
    case "ARCHIVED":
      return "outline";
    default:
      return "outline";
  }
}

// Calculate CTR (Click-Through Rate)
export function calculateCTR(clicks: number, impressions: number) {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

// Calculate CPC (Cost Per Click)
export function calculateCPC(spend: number, clicks: number) {
  if (clicks === 0) return 0;
  return spend / clicks;
}

// Calculate CPM (Cost Per Thousand Impressions)
export function calculateCPM(spend: number, impressions: number) {
  if (impressions === 0) return 0;
  return (spend / impressions) * 1000;
}

// Calculate ROAS (Return on Ad Spend)
export function calculateROAS(revenue: number, spend: number) {
  if (spend === 0) return 0;
  return revenue / spend;
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Email validation
export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Truncate text
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Get relative time (safe)
export function getRelativeTime(date: string | number | Date) {
  const target = toValidDate(date);
  if (!target) return "—";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 0) return "In the future";
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

// Check if value is empty
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Capitalize first letter
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Format objective text
export function formatObjective(objective: string) {
  return objective.replace("OUTCOME_", "").toLowerCase().replace(/_/g, " ");
}

// Get campaign status badge props
export function getCampaignStatusProps(status: string) {
  const statusConfig = {
    ACTIVE: { variant: "default" as const, label: "Active" },
    PAUSED: { variant: "secondary" as const, label: "Paused" },
    DELETED: { variant: "destructive" as const, label: "Deleted" },
    ARCHIVED: { variant: "outline" as const, label: "Archived" },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
    }
  );
}

// Format bytes to human readable
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Check if date is today (safe)
export function isToday(date: string | number | Date) {
  const d = toValidDate(date);
  if (!d) return false;
  const today = new Date();
  return today.toDateString() === d.toDateString();
}

// Get date range for analytics
export function getAnalyticsDateRange(period: string) {
  const now = new Date();
  const ranges = {
    today: {
      start: now.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    },
    yesterday: {
      start: new Date(now.getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date(now.getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    last7days: {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: now.toISOString().split("T")[0],
    },
    last30days: {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: now.toISOString().split("T")[0],
    },
    thisMonth: {
      start: new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0],
      end: now.toISOString().split("T")[0],
    },
    lastMonth: {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0],
      end: new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0],
    },
  };

  return ranges[period as keyof typeof ranges] || ranges.last7days;
}

export function toValidDate(input: string | number | Date): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === "string") {
    // Prefer ISO-like strings; fallback to Date parsing
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatCurrency(amount: number, currency = "USD") {
  const n = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// Number formatting with K/M (support negatives too)
export function formatNumber(num: number) {
  if (!Number.isFinite(num)) return "0";
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

// Percentage formatting (guard)
export function formatPercentage(num: number, decimals = 2) {
  const n = Number.isFinite(num) ? num : 0;
  return `${n.toFixed(decimals)}%`;
}
