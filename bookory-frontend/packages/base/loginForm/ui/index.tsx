import { useState } from 'react';
import './index.css';

/** Props för AuthTextField-komponenten */
interface AuthTextFieldProps {
  /** Etikettens text ovanför fältet */
  label: string;
  /** HTML input-typ, t.ex. 'text', 'email', 'password' */
  type?: React.HTMLInputTypeAttribute;
  /** Det aktuella värdet */
  value: string;
  /** Callback som anropas när värdet ändras */
  onChange: (value: string) => void;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  /** Om true visas ett öga-ikon för att växla lösenordsvisning */
  showToggle?: boolean; // nytt
}

/**
 * AuthTextField – ett textfält för autentiseringsformulär.
 * Stödjer lösenordstoggle via showToggle-prop.
 */
export const AuthTextField = ({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  showToggle = false,
}: AuthTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = showToggle
    ? showPassword ? 'text' : 'password'
    : type;

  return (
    <label className="auth-textfield">
      <span className="auth-textfield__label">{label}</span>
      <div className="auth-textfield__input-wrapper">
        <input
          className="auth-textfield__input"
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete ?? 'off'}
        />
        {showToggle && (
          <i
            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        )}
      </div>
      <span className="auth-textfield__line" />
    </label>
  );
};