import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('card', className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('border-b border-gray-700 pb-3 mb-3', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('font-f1 font-semibold text-lg text-white', className)}>
      {children}
    </h3>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={clsx(
          'border-2 border-f1-red border-t-transparent rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Retry
        </button>
      )}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'purple' | 'green' | 'yellow' | 'blue' | 'red';
}

export function Badge({ children, variant = 'blue' }: BadgeProps) {
  const variantClasses = {
    purple: 'badge-purple',
    green: 'badge-green',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    red: 'bg-red-900/50 text-red-300 border border-red-700',
  };

  return <span className={clsx('badge', variantClasses[variant])}>{children}</span>;
}
