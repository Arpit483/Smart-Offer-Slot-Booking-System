
import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'font-body text-[14px] shadow-lg rounded-[var(--radius-md)] border border-[var(--color-border)]',
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-accent)',
            secondary: 'var(--color-surface)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--color-surface)',
          },
        },
      }}
    />
  );
}

