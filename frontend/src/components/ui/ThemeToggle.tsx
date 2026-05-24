import { useTheme } from '../../hooks/useTheme';
import { Icon } from './Icon';

export default function ThemeToggle() {
  const { setTheme, isDark } = useTheme();

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-surface-alt transition-all"
    >
      {isDark ? (
        <Icon name="light_mode" className="text-warning" fill />
      ) : (
        <Icon name="dark_mode" />
      )}
    </button>
  );
}
