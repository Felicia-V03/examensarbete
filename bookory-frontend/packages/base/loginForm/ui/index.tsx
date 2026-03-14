import './index.css';

interface AuthTextFieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
}

export const AuthTextField = ({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
}: AuthTextFieldProps) => {
  return (
    <label className="auth-textfield">
      <span className="auth-textfield__label">{label}</span>
      <input
        className="auth-textfield__input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      <span className="auth-textfield__line" />
    </label>
  );
};