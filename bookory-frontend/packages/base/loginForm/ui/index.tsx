import { useState } from 'react';
import './index.css';

interface AuthTextFieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  showToggle?: boolean; // nytt
}

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