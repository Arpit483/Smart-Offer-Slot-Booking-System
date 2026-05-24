

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-surface-alt)]">
      <h1 className="text-4xl font-display font-bold text-[var(--color-text-primary)]">404</h1>
      <p className="mt-2 mb-6 text-[var(--color-text-secondary)]">Page Not Found</p>
      <a href="/" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
        Go Home
      </a>
    </div>
  );
}
