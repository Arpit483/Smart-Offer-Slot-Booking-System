const statusBadgeClass: Record<string, string> = {
  Confirmed:  'bg-secondary text-on-secondary',
  Pending:    'bg-primary-container text-on-primary-container',
  Cancelled:  'bg-error text-on-error',
  Active:     'bg-secondary text-on-secondary',
  Full:       'bg-error text-on-error',
  Expired:    'bg-surface-container-high text-on-surface-variant',
  Draft:      'bg-surface-container-low text-on-surface',
  Paused:     'bg-primary-container text-on-primary-container',
};

export function StatusBadge({ status, className = '' }: { status: string, className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest neo-border ${statusBadgeClass[status] ?? 'bg-surface-container-low text-on-surface'} ${className}`}>
      {status}
    </span>
  );
}
