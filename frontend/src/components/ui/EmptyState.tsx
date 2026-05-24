import { cn } from '../../utils';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#1A1C29]/50 p-8 text-center animate-in zoom-in-95 duration-500",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-[#2A2D43] text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-white/5">
          {icon}
        </div>
      )}
      <h3 className="mb-3 text-xl font-display font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mb-8 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-[#1A1C29] text-sm font-bold rounded-[10px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
