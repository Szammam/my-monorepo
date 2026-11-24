import { useAppContext } from '../../context/AppContext';
import './layout.css';

export function ModeSwitcher() {
  const { mode, setMode } = useAppContext();

  return (
    <div role="group" aria-label="Przełącznik trybu aplikacji" className="mode-switcher">
      <button
        type="button"
        aria-pressed={mode === 'client'}
        onClick={() => setMode('client')}
        className={`mode-switcher__option ${mode === 'client' ? 'mode-switcher__option--active' : ''}`}
      >
        Dla klientów
      </button>
      <button
        type="button"
        aria-pressed={mode === 'vendor'}
        onClick={() => setMode('vendor')}
        className={`mode-switcher__option ${mode === 'vendor' ? 'mode-switcher__option--active' : ''}`}
      >
        Dla dostawców
      </button>
    </div>
  );
}
