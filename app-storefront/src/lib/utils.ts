import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string) {
  // Convert to lowercase and trim leading/trailing spaces
  str = str.toLowerCase().trim();

  // Remove accents and special characters (optional, but good for broader compatibility)
  // This uses String.prototype.normalize and a regex to remove diacritics
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Replace invalid characters with spaces
  str = str.replace(/[^a-z0-9\s-]/g, ' ');

  // Replace multiple spaces or hyphens with a single hyphen
  str = str.replace(/[\s-]+/g, '-');

  return str;
}