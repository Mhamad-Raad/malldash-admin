import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Display validation errors from backend API responses
 * @param title - The main error title
 * @param errors - Array of error messages or a single error message
 * @param fallbackMessage - Fallback message if no errors provided
 */
export function showValidationErrors(
  title: string,
  errors?: string[] | string,
  fallbackMessage?: string
) {
  if (Array.isArray(errors) && errors.length > 0) {
    // Show errors as a proper list using React elements
    toast.error(title, {
      description: React.createElement(
        'ul',
        { className: 'mt-1 space-y-1 list-disc list-inside text-sm' },
        errors.map((err, index) =>
          React.createElement('li', { key: index }, err)
        )
      ),
      duration: 6000,
    });
  } else if (typeof errors === 'string' && errors) {
    toast.error(title, {
      description: errors,
    });
  } else if (fallbackMessage) {
    toast.error(title, {
      description: fallbackMessage,
    });
  } else {
    toast.error(title);
  }
}
