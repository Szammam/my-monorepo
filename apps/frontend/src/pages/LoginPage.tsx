import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAppContext, type UserRole } from '../context/AppContext';
import './LoginPage.css';

type AuthMode = 'register' | 'login';

interface FormErrors {
  fullName?: string;
  restaurantName?: string;
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { role, setRole, loginAs } = useAppContext();

  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [fullName, setFullName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole);
    setErrors((prev) => ({ ...prev, restaurantName: undefined }));
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (authMode === 'register' && !fullName.trim()) {
      nextErrors.fullName = 'Wypełnij to pole.';
    }

    if (authMode === 'register' && role === 'vendor' && !restaurantName.trim()) {
      nextErrors.restaurantName = 'Wypełnij to pole.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Wypełnij to pole.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Wypełnij to pole.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const derivedName =
      fullName.trim() || email.split('@')[0]?.trim() || (role === 'vendor' ? 'andy' : 'Klient');

    window.setTimeout(() => {
      loginAs({
        userName: derivedName,
        role,
        restaurantName: role === 'vendor' ? restaurantName.trim() : undefined,
      });
      setIsSubmitting(false);
      navigate(role === 'vendor' ? '/vendors' : '/vendors');
    }, 350);
  }

  const isRegister = authMode === 'register';

  return (
    <div className="auth-screen">
      <div className="auth-card" role="region" aria-labelledby="auth-heading">
        <p className="auth-card__eyebrow">DOŁĄCZ DO SZAMMAM</p>
        <h1 id="auth-heading" className="auth-card__title">
          {isRegister ? 'Załóż konto' : 'Zaloguj się'}
        </h1>

        <div className="auth-role-group">
          <span className="auth-role-group__label">WCHODZĘ JAKO</span>
          <div role="group" aria-label="Wybór roli konta" className="auth-role-buttons">
            <button
              type="button"
              aria-pressed={role === 'client'}
              onClick={() => handleRoleChange('client')}
              className={`auth-role-btn ${role === 'client' ? 'auth-role-btn--active' : ''}`}
            >
              Klient
            </button>
            <button
              type="button"
              aria-pressed={role === 'vendor'}
              onClick={() => handleRoleChange('vendor')}
              className={`auth-role-btn ${role === 'vendor' ? 'auth-role-btn--active' : ''}`}
            >
              Dostawca
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {isRegister && (
            <TextField
              label="Imię i nazwisko"
              name="fullName"
              type="text"
              placeholder="np. Jan Kowalski"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
              error={errors.fullName}
              required
            />
          )}

          {isRegister && role === 'vendor' && (
            <TextField
              label="Nazwa restauracji"
              name="restaurantName"
              type="text"
              placeholder="np. Bistro na Kampusie"
              value={restaurantName}
              onChange={(e) => {
                setRestaurantName(e.target.value);
                if (errors.restaurantName) {
                  setErrors((prev) => ({ ...prev, restaurantName: undefined }));
                }
              }}
              error={errors.restaurantName}
              required
            />
          )}

          <TextField
            label="E-mail"
            name="email"
            type="email"
            placeholder="twoj@adres.pl"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            error={errors.email}
            required
          />

          <TextField
            label="Hasło"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="auth-form__submit"
          >
            {isRegister ? 'Utwórz konto →' : 'Zaloguj się →'}
          </Button>
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__switch">
            {isRegister ? (
              <>
                Masz już konto?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrors({});
                  }}
                  className="auth-card__inline-btn"
                >
                  Zaloguj się
                </button>
              </>
            ) : (
              <>
                Nie masz jeszcze konta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrors({});
                  }}
                  className="auth-card__inline-btn"
                >
                  Załóż konto
                </button>
              </>
            )}
          </p>

          <Link to="/" className="auth-card__back">
            Wróć do szAmmAm
          </Link>
        </div>
      </div>
    </div>
  );
}
