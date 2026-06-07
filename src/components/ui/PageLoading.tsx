import {
  FormSkeleton,
  PropertyGridSkeleton,
  Skeleton,
  StatGridSkeleton,
  TableSkeleton,
  TextSkeleton,
} from './Skeleton';

type Variant =
  | 'public'
  | 'search'
  | 'property'
  | 'auth'
  | 'admin'
  | 'seller'
  | 'form';

export function PageLoading({ variant = 'public' }: { variant?: Variant }) {
  if (variant === 'auth') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
          <Skeleton className="mx-auto h-7 w-48" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'property') {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-80 max-w-full" />
            <Skeleton className="h-7 w-36" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="aspect-[16/9] w-full" />
            <TextSkeleton lines={5} />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <StatGridSkeleton count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'search') {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-56" />
        <FormSkeleton />
        <Skeleton className="h-4 w-40" />
        <PropertyGridSkeleton count={6} />
      </div>
    );
  }

  if (variant === 'admin' || variant === 'seller') {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <StatGridSkeleton count={variant === 'admin' ? 5 : 4} />
        <div className="grid gap-8 lg:grid-cols-2">
          <FormSkeleton />
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-14">
      <section className="rounded-xl bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        <Skeleton className="h-12 w-96 max-w-full" />
        <Skeleton className="mt-4 h-5 w-[32rem] max-w-full" />
        <Skeleton className="mt-8 h-14 w-full" />
      </section>
      <PropertyGridSkeleton count={6} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}
