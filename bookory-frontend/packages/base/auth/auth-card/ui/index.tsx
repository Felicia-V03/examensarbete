import './index.css';
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <section className="auth-card">
      {children}
    </section>
  );
};