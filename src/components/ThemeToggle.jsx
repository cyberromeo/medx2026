import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      {theme === 'light' ? 'NIGHT' : 'DAY'}
    </button>
  );
}
