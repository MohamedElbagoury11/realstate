export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-zinc-600">{description}</p>}
    </div>
  );
}
