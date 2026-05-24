
import { cn } from '../../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'available' | 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'draft' | 'full' | 'completed' | 'default' | 'success' | 'danger' | 'warning' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold font-body tracking-wide transition-colors";
  
  const variants: Record<string, string> = {
    active: "bg-[#E6F9F3] text-[var(--color-accent)]",
    available: "bg-[#E6F9F3] text-[var(--color-accent)]",
    success: "bg-[#E6F9F3] text-[var(--color-accent)]",
    completed: "bg-[#E6F9F3] text-[var(--color-accent)]",
    pending: "bg-[#FFF7E6] text-[var(--color-warning)]",
    warning: "bg-[#FFF7E6] text-[var(--color-warning)]",
    confirmed: "bg-[#E8F5FF] text-[#0080CC]",
    cancelled: "bg-[#FEF0F0] text-[var(--color-danger)]",
    danger: "bg-[#FEF0F0] text-[var(--color-danger)]",
    expired: "bg-[#F1F3F5] text-[#94A3B8]",
    draft: "bg-[#F1F3F5] text-[#64748B]",
    full: "bg-[#FFF0E8] text-[var(--color-primary)]",
    neutral: "bg-[#F1F3F5] text-[#64748B]",
    default: "bg-[#F1F3F5] text-[#64748B]",
  };

  return (
    <span className={cn(baseStyles, variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;
