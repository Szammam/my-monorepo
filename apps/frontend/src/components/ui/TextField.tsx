import { useId, type ChangeEvent, type InputHTMLAttributes } from 'react';
import './TextField.css';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'type' | 'value' | 'onChange' | 'required'
> {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  const inputClasses = ['ui-field__input', hasError ? 'ui-field__input--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ui-field">
      <label htmlFor={inputId} className="ui-field__label">
        {label}
        {required && (
          <span aria-hidden="true" className="ui-field__required">
            *
          </span>
        )}
      </label>

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={inputClasses}
        {...rest}
      />

      {hasError && (
        <p id={errorId} role="alert" className="ui-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
