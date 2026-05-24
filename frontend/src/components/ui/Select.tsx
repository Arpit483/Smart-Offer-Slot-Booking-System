import React from 'react';

import { cn } from '../../utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-[13px] font-semibold text-[var(--color-text-secondary)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "h-[44px] w-full appearance-none rounded-[var(--radius-sm)] border-[1.5px] border-[var(--color-border)] bg-transparent px-3.5 pr-10 text-[15px] text-[var(--color-text-primary)] transition-colors focus:outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[rgba(255,107,53,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[rgba(229,62,62,0.15)]",
              className
            )}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <span className="text-[13px] text-[var(--color-danger)]">{error}</span>
        ) : helperText ? (
          <span className="text-[13px] text-[var(--color-text-secondary)]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
