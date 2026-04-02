import './index.css';
import type { ReactNode } from 'react';

/** Props för AuthCard-komponenten */
interface AuthCardProps {
  /** Innehållet som renderas inuti kortet */
  children: ReactNode;
}

/**
 * AuthCard – ett wrapper-kort som används för inloggnings- och registreringsformulär.
 * Omsluter sina barn (children) i en styled section.
 */
export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <section className="auth-card">
      {children}
    </section>
  );
};