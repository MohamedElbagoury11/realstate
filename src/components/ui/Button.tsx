import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  loadingLabel?: string;
};

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--brand)] text-white hover:opacity-90',
  secondary: 'border border-zinc-300 bg-white hover:bg-zinc-50',
  ghost: 'hover:bg-zinc-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({
  className,
  variant = 'primary',
  loading = false,
  loadingLabel,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
