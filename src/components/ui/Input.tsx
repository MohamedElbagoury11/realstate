import { cn } from '@/lib/cn';

export function Input({
  className,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-zinc-700">{label}</span>}
      <input
        className={cn(
          'rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
