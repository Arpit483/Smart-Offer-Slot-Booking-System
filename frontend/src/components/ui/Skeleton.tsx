
import { cn } from '../../utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border)]/50", className)}
      {...props}
    />
  );
}

export default Skeleton;
