import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
//  May 23, 2024
export function formatDate2(dateStr: string): string {
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

// Calculate reading time for an article
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 225; // Average reading speed
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper for calculating scroll percentage with smoothing
export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // Calculate how far we've scrolled through the scrollable content
  const scrollableHeight = documentHeight - windowHeight;
  return scrollableHeight <= 0
    ? 100
    : Math.min(Math.round((scrollTop / scrollableHeight) * 100), 100);
}
