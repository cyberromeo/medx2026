import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      navigate('/subjects');
    } else {
      setError('ACCESS DENIED. INVALID CREDENTIALS.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="login-page" id="login-page">
      {/* Header */}
      <header className="login-page__header">
        <div className="login-page__brand">
          <span className="login-page__brand-text">MEDX 2026</span>
        </div>
        <div className="login-page__geo-accent"></div>
      </header>

      {/* Main Content */}
      <main className="login-page__content animate-slide-up">
        {/* Hero */}
        <section className="login-page__hero">
          <div className="login-page__title-wrap">
            <h1 className="login-page__title">
              PASS<br />WORD
            </h1>
            <div className="login-page__title-accent"></div>
          </div>
          <p className="login-page__subtitle">
            ACCESS THE VAULT. INPUT YOUR CREDENTIALS TO CONTINUE.
          </p>
        </section>

        {/* Form */}
        <form className="login-page__form" onSubmit={handleSubmit} id="login-form">
          <div className="login-page__input-group">
            <label className="login-page__label" htmlFor="password-input">
              Private Key
            </label>
            <div className="login-page__input-wrap">
              <input
                className={`input-field ${isShaking ? 'login-page__input--shaking' : ''}`}
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <span className="material-symbols-outlined login-page__input-icon">
                lock
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-page__error animate-fade-in" id="login-error">
              <span className="material-symbols-outlined">
                error
              </span>
              {error}
            </div>
          )}

          {/* Geometric Divider */}
          <div className="login-page__divider">
            <div className="login-page__divider-line"></div>
            <div className="login-page__divider-circle"></div>
            <div className="login-page__divider-rect"></div>
          </div>

          {/* Submit Button */}
          <button className="btn-offset" type="submit" id="login-submit">
            <div className="btn-offset__shadow"></div>
            <div className="btn-offset__face login-page__submit-face">
              <span>ENTER</span>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
                arrow_forward
              </span>
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="login-page__footer">
          <a href="https://wa.me/919087375875" target="_blank" rel="noopener noreferrer" className="login-page__forgot">
            <span className="material-symbols-outlined">
              help
            </span>
            Forgot Access Code?
          </a>
          <div className="login-page__footer-dots">
            <div className="login-page__footer-dot login-page__footer-dot--red"></div>
            <div className="login-page__footer-dot login-page__footer-dot--yellow"></div>
            <div className="login-page__footer-dot login-page__footer-dot--blue"></div>
          </div>
        </div>
      </main>

      {/* Theme Toggle */}
      <div className="login-page__theme-toggle">
        <ThemeToggle />
      </div>

      {/* Background Decorations */}
      <div className="login-page__bg-circle"></div>
      <div className="login-page__bg-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="login-page__bg-grid-dot"></div>
        ))}
      </div>
      <div className="login-page__bg-strip-right"></div>
      <div className="login-page__bg-strip-left"></div>
    </div>
  );
}
